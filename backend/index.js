require("dotenv").config();
const connectDB = require("./config/connect");
const express = require("express");
const cors = require("cors");
const storiesRoute = require("./routes/stories");
const userRoute = require("./routes/user");
const profileRoute = require("./routes/profile");
const adminRoute = require("./routes/admin");
const transactionsRoute = require("./routes/transactions");
const os = require("os");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- Add this line for form-data support

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/stories", storiesRoute);
app.use("/user", userRoute);
app.use("/profile", profileRoute);
app.use("/admin", adminRoute);
app.use("/transactions", transactionsRoute);
// Default route
app.get("/", (req, res) => {
  res.send("🚀 Autism Stories Backend is Running!");
});

// Catch-all 404 handler
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
const port = 5000;
const host = "0.0.0.0";

// find first non-internal IPv4
function getLocalIPv4() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "localhost";
}

app.listen(port, host, () => {
  const ip = getLocalIPv4();
  console.log(`✅ Server running on http://localhost:${port} and http://${ip}:${port}`);
  console.log("Ensure your firewall allows inbound TCP 5000.");
});