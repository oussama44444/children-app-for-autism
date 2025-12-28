const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const userModel = require("../models/user");


exports.login = async (email, password) => {
  const admin = await userModel.findOne({ email, role: "admin" });

  if (!admin) {
    throw new Error("Email or password invalid");
  }

  const validPass = bcrypt.compareSync(password, admin.password);

  if (!validPass) {
    throw new Error("Email or password invalid");
  }

  console.log(admin);
  const secretKey = process.env.JWT_SECRET;
  const payload = {
    _id: admin._id,
    email: admin.email,
    role: admin.role,
  };

  const token = jwt.sign(payload, secretKey);

  return { mytoken: token };
};
