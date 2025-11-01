require("dotenv").config();
const connectDB = require("./config/connect");
const express = require("express");
const cors = require("cors");
const storiesRoute = require("./routes/stories");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- Add this line for form-data support

// Routes
app.use("/stories", storiesRoute);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Autism Stories Backend is Running!");
});

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});