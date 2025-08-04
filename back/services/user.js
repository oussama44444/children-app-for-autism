require("dotenv").config();

const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const ReviewModel = require("../models/Review");
const userModel = require("../models/user");
const accountveriftokenModel = require("../models/accountveriftoken");
const resetpasswordtokenModel = require("../models/resetpasswordtoken");
const ReportModel = require("../models/Report");
const OrderModel = require("../models/order");
exports.login = async (req, res) => {
  try {
    const { email, password } = req;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Email or password invalid" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ error: "Email or password invalid" });
    }

    if (!user.verified) {
      return res
        .status(400)
        .json({ error: "Please verify your account via email" });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error("JWT secret is not defined in the environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = jwt.sign(payload, secretKey);

    return res.status(200).json({
      jwt: token,
      verified: user.verified,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, name, phonenumber, password, address } = req;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email address already registered" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new userModel({
      name,
      phonenumber,
      email,
      password: hashedPassword,
      address: address,
    });

    newUser.verified = true;

    await newUser.save();

    const tokenstring = crypto.randomBytes(20).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const vtoken = new accountveriftokenModel({
      userId: newUser._id,
      token: tokenstring,
      expiresAt,
    });

    await vtoken.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Sarbini Account Verification",
      html: `
       <body style="background-color: #f7e8e8; font-family: Arial, sans-serif; margin: 0; padding: 0;">
       <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin-top: 50px;">
         <tr>
           <td align="center" style="background: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
             <h2 style="color: #333333; font-size: 24px; margin-bottom: 24px;">Welcome to Sarbini</h2>
             <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 32px;">
               Please verify your account to get started.
             </p>
             <a href="${process.env.BASE_URL}/user/verify/${newUser._id}/${vtoken.token}" target="_blank" style="background-image: linear-gradient(to right, #f472b6, #fde68a); color: #ffffff; padding: 16px 32px; border-radius: 30px; text-decoration: none; font-weight: bold; display: inline-block;">
               Verify Account
             </a>
             <p style="color: #999999; font-size: 12px; margin-top: 32px;">
               If you did not request this email, no further action is required.
             </p>
           </td>
         </tr>
       </table>
     </body>
     `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyEmail = async (userId, token) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return { success: false, message: "Invalid Verification Link" };
    }

    if (user.verified) {
      return { success: false, message: "User Already Verified" };
    }

    const verificationToken = await accountveriftokenModel.find({
      userId,
      token,
    });
    if (!verificationToken) {
      return { success: false, message: "Invalid Verification Link" };
    }
    user.verified = true;
    await user.save();
    await accountveriftokenModel.findByIdAndDelete(verificationToken._id);
    return { success: true, message: "Email verified successfully." };
  } catch (error) {
    console.log(error);
    return { success: false, message: "An error occured" };
  }
};

exports.forgetPassword = async (email) => {
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return { error: true, message: "User with this email not found" };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const resetPasswordToken = await resetpasswordtokenModel.create({
      userId: user._id,
      token,
      expiresAt,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "My Box Password Reset",
      html: `
      <body style="background-color: #f7e8e8; font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin-top: 50px;">
          <tr>
            <td align="center" style="background: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #333333; font-size: 24px; margin-bottom: 24px;">Password Reset Request</h2>
              <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 32px;">
                We received a request to reset your password. Click the button below to proceed.
              </p>
              <a href="${process.env.BASE_URL}/reset-password?token=${resetPasswordToken.token}" target="_blank" style="background-image: linear-gradient(to right, #f472b6, #fde68a); color: #ffffff; padding: 16px 32px; border-radius: 30px; text-decoration: none; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
              <p style="color: #999999; font-size: 12px; margin-top: 32px;">
                If you did not request this email, no further action is required.
              </p>
            </td>
          </tr>
        </table>
      </body>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { error: false, resetPasswordToken };
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

exports.resetPassword = async (newPassword, token) => {
  try {
    const passToken = await resetpasswordtokenModel.findOne({ token });
    if (!passToken) {
      throw new Error("Invalid Token");
    }
    if (passToken.expired || passToken.expiresAt < Date.now())
      throw new Error("Token Expired");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userModel.findByIdAndUpdate(passToken.userId, {
      password: hashedPassword,
    });
    passToken.expired = true;
    passToken.expiresAt = undefined;
    await passToken.save();
    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.submitReport = async ({
  userId,
  email,
  reportIssue,
  content,
  orderID,
}) => {
  try {
    if (orderID) {
      const orderExists = await OrderModel.findById(orderID).exec();
      if (!orderExists) {
        throw new Error("Order ID does not exist");
      }
    }

    const report = new ReportModel({
      userId,
      email,
      reportIssue,
      content,
      orderID: orderID || null,
      createdAt: new Date(),
    });

    return await report.save();
  } catch (error) {
    throw new Error(`Failed to submit report: ${error.message}`);
  }
};

exports.getUserReviewsById = async (userId) => {
  try {
    const reviews = await ReviewModel.find({ user: userId })
      .populate("user", "name") // Optional: to get user's name
      .populate("provider", "name") // Populate provider name
      .populate("product", "name");
    return reviews;
  } catch (error) {
    throw new Error(`Error fetching user reviews: ${error.message}`);
  }
};
