const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("Token:", token);
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Error decoding token:", err);
      return res.status(403).json({ error: "Failed to authenticate token" });
    }
    console.log("Decoded token:", decoded);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access is not authorized to this user" });
    }
    next();
  });
};

module.exports = isAdmin;
