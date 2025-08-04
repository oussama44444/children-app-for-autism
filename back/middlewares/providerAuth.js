const jwt = require("jsonwebtoken");
const providerModel = require("../models/provider");

const isProvider = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access Denied: No token provided.");
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find provider based on the decoded token
    const provider = await providerModel.findById(decoded._id);

    if (!provider) {
      return res.status(403).send("Forbidden: You are not a provider.");
    }

   
    req.provider = provider; // Set the restaurant data in the request object

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error(error);
    return res.status(401).send("Invalid or expired token.");
  }
};

module.exports = isProvider;
