require("dotenv").config();
require("./config/connect");

const cors = require("cors");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const geoip = require("geoip-lite");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Route imports
const providerRoute = require("./routes/provider.js");
const userRoute = require("./routes/user.js");
const adminRoute = require("./routes/admin.js");
const profileRoute = require("./routes/profile.js");
const orderRoute = require("./routes/order.js");
const productRoute = require("./routes/product.js");
const categoryRoute = require("./routes/category.js");

const app = express();
app.set("trust proxy", true); // If behind a proxy

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3001",
        "https://promo-net.tn",
        "https://www.promo-net.tn",
        "https://freelance-qny8.vercel.app",
      ];
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});


const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
// Track active sockets and their locations
const activeSockets = new Set();
const userLocations = {};

function getAggregatedLocationStats() {
  const locationCounts = {};
  for (const loc of Object.values(userLocations)) {
    const key = `${loc.country} - ${loc.city}`;
    locationCounts[key] = (locationCounts[key] || 0) + 1;
  }
  const total = Object.values(locationCounts).reduce((a, b) => a + b, 0);

  return {
    total,
    locations: Object.entries(locationCounts).map(([loc, count]) => ({
      location: loc,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    })),
  };
}

io.on("connection", async (socket) => {
  activeSockets.add(socket.id);

  let ip = socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;
  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  if (ip === "::1" || ip === "127.0.0.1") {
    console.log("🧪 Local user connected (no location lookup).");
    userLocations[socket.id] = { city: "Localhost", country: "Local" };
  } else {
    const geo = geoip.lookup(ip);

    console.log("🌍 New user connected:");
    console.log("📡 IP:", ip);

    if (geo && geo.ll) {
      const [latitude, longitude] = geo.ll;

      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}&language=en`
        );
        const data = await response.json();

        if (data && data.results.length > 0) {
          const components = data.results[0].components;
          const city =
            components.city ||
            components.town ||
            components.village ||
            components.county ||
            "Unknown city";
          const country = components.country || "Unknown country";

          console.log(`📍 Approximate location: ${city}, ${country}`);

          userLocations[socket.id] = { city, country };
        } else {
          console.log("📍 Could not resolve coordinates to a city.");
          userLocations[socket.id] = { city: "Unknown", country: "Unknown" };
        }
      } catch (error) {
        console.error("❌ Error with OpenCage API:", error.message);
        userLocations[socket.id] = { city: "Unknown", country: "Unknown" };
      }
    } else {
      console.log("📍 No coordinates found for IP.");
      userLocations[socket.id] = { city: "Unknown", country: "Unknown" };
    }
  }

  console.log("👥 Current online users:", activeSockets.size);

  // Emit user count and aggregated location stats
  io.emit("updateUserCount", activeSockets.size);
  io.emit("userLocationStats", getAggregatedLocationStats());

  socket.on("disconnect", () => {
    activeSockets.delete(socket.id);
    delete userLocations[socket.id];
    console.log("❌ A user disconnected");
    console.log("👥 Current online users:", activeSockets.size);

    io.emit("updateUserCount", activeSockets.size);
    io.emit("userLocationStats", getAggregatedLocationStats());
  });
});

// API route for online users count (optional)
app.get("/provider/online-users", (req, res) => {
  res.json({ onlineUsers: activeSockets.size });
});

// CORS and middleware
const allowedOrigins = [
  "http://localhost:3001",
  "https://promo-net.tn",
  "https://www.promo-net.tn",
  "https://freelance-qny8.vercel.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/profile", profileRoute);
app.use("/order", orderRoute);
app.use("/product", productRoute);
app.use("/provider", providerRoute);
app.use("/category", categoryRoute);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to promonet Server");
});

// Start server
const port = 5000;
server.listen(port, () => {
  console.log(`🚀 Server running with Socket.IO on port ${port}`);
});
