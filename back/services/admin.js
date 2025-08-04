const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const providerModel = require("../models/provider");

const userModel = require("../models/user");
const orderModel = require("../models/order");
const SliderModel = require("../models/Slider");
const ReportModel = require("../models/Report");
const ProviderModel = require("../models/provider");
exports.addprovider = async (providerData) => {
  try {
    const {
      provider,
      name,
      description,
      phonenumber,
      image,
      deliveryTime,
      verified,
      rating,
      address,
      location,
      specialities,
      ...otherFields
    } = providerData;

    // Convert specialties to array if it's a string
    const specialitiesArray = Array.isArray(specialities)
      ? specialities
      : specialities.split(",").map((item) => item.trim());

    // Check if provider exists
    const Provider = await ProviderModel.findById(provider);
    if (!Provider) {
      throw new Error("Provider not found");
    }

    // Create the new provider object
    const newprovider = new providerModel({
      name,
      description,
      phonenumber,
      image,
      deliveryTime,
      verified,
      rating,
      address,
      location,
      specialities: specialitiesArray, // Ensure it's saved as an array
      provider: provider,
      ...otherFields,
    });

    // Save the new provider
    const savedprovider = await newprovider.save();
    return savedprovider;
  } catch (error) {
    throw new Error("Error adding provider: " + error.message);
  }
};

exports.getproviders = async () => {
  try {
    const providers = await providerModel.find().populate("provider"); // Populate provider details
    return providers;
  } catch (error) {
    throw new Error("Error fetching providers: " + error.message);
  }
};

exports.modifyprovider = async (providerId, updatedData) => {
  try {
    const updatedprovider = await providerModel.findOneAndUpdate(
      { _id: providerId },
      updatedData,
      { new: true }
    );
    return updatedprovider;
  } catch (error) {
    throw new Error("Error modifying provider: " + error.message);
  }
};

exports.deleteprovider = async (providerId) => {
  try {
    const deletedprovider = await providerModel.findOneAndDelete({
      _id: providerId,
    });
    return deletedprovider;
  } catch (error) {
    throw new Error("Error deleting provider: " + error.message);
  }
};

exports.add = async (userData) => {
  try {
    const { password, ...otherFields } = userData;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const updatedUserData = {
      ...otherFields,
      password: hashedPassword,
    };

    const newUser = new userModel(updatedUserData);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getall = async () => {
  try {
    const users = await userModel.find({ role: "user" });
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

exports.addProvider = async (providerData) => {
  try {
    console.log(providerData);
    const { password, email, ...otherFields } = providerData;
    const existingProvider = await ProviderModel.findOne({ email });
    if (existingProvider) {
      throw new Error("Provider with this email already exists.");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const updatedProviderData = {
      ...otherFields,
      email,
      password: hashedPassword,
      role: "provider",
      verified: true,
    };

    const newProvider = new ProviderModel(updatedProviderData);
    const savedProvider = await newProvider.save();
    return savedProvider;
  } catch (error) {
    throw new Error(error.message);
  }
};
exports.getProviders = async () => {
  try {
    const providers = await ProviderModel.find();
    return providers;
  } catch (error) {
    throw new Error("Error fetching providers: " + error.message);
  }
};
exports.modifyProvider = async (providerId, updatedData) => {
  try {
    const updatedProvider = await ProviderModel.findOneAndUpdate(
      { _id: providerId },
      updatedData,
      { new: true }
    );
    return updatedProvider;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteProvider = async (providerId) => {
  try {
    const deletedProvider = await ProviderModel.findOneAndDelete({
      _id: providerId,
    });
    return deletedProvider;
  } catch (error) {
    throw new Error(error.message);
  }
};
exports.getallOrders = async () => {
  try {
    const orders = await orderModel
      .find({})
      .populate({
        path: "items.product",
        select: "name price provider image_url",
      })
      .populate("user", "email");
    return orders;
  } catch (error) {
    throw new Error("Error fetching orders: " + error.message);
  }
};

exports.getbyid = async (id) => {
  try {
    const user = await userModel.findOne({ _id: id, role: "user" });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getbyemail = async (email) => {
  try {
    const user = await userModel.findOne({ email, role: "user" });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deletebyid = async (id) => {
  try {
    const deletedUser = await userModel.findOneAndDelete({
      _id: id,
      role: "user",
    });
    return deletedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deletebyemail = async (email) => {
  try {
    const deletedUser = await userModel.findOneAndDelete({
      email,
      role: "user",
    });
    return deletedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updatebyid = async (id, newData) => {
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: id, role: "user" },
      newData,
      {
        new: true,
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateOrderById = async (id, newData) => {
  try {
    const updatedOrder = await orderModel.findOneAndUpdate(
      {
        _id: id,
      },
      newData,
      { new: true }
    );
    return updatedOrder;
  } catch (error) {
    throw new Error("Error updating order: " + error.message);
  }
};

exports.createadmin = async (req, res) => {
  try {
    const { email, password, name } = req;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (email !== "admin@gmail.com") {
      return res.status(403).json({
        error: "Not authorized to create admin, contact the website admin",
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email address already registered" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newAdmin = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      verified: true,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

exports.addToSlider = async (image_name, image_url) => {
  try {
    const newImage = new SliderModel({ image_name, image_url });

    await newImage.save();

    return newImage;
  } catch (error) {
    throw new Error(`Failed to add image: ${error.message}`);
  }
};

exports.getFromSlider = async () => {
  try {
    const images = await SliderModel.find();
    return images;
  } catch (error) {
    throw new Error("Error fetching images: " + error.message);
  }
};

exports.deleteFromSlider = async (id) => {
  try {
    const deletedimage = await SliderModel.findOneAndDelete({
      _id: id,
    });
    return deletedimage;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateImagebyid = async (id, newData) => {
  try {
    const updatedImage = await SliderModel.findOneAndUpdate(
      { _id: id },
      newData,
      {
        new: true,
      }
    );
    return updatedImage;
  } catch (error) {
    throw new Error(error.message);
  }
};
exports.getallReports = async () => {
  try {
    const reports = await ReportModel.find({});

    return reports;
  } catch (error) {
    throw new Error("Error fetching reports: " + error.message);
  }
};

exports.getReportById = async (id) => {
  return await ReportModel.findById(id);
};
exports.updateReportById = async (id, newData) => {
  try {
    const updatedReport = await ReportModel.findOneAndUpdate(
      {
        _id: id,
      },
      newData,
      { new: true }
    );
    return updatedReport;
  } catch (error) {
    throw new Error("Error updating report: " + error.message);
  }
};

exports.deleteReportById = async (id) => {
  try {
    const deletedReport = await ReportModel.findOneAndDelete({
      _id: id,
    });
    return deletedReport;
  } catch (error) {
    throw new Error(error.message);
  }
};
