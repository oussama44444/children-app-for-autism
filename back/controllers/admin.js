const adminService = require("../services/admin");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await adminService.login(email, password);
    res.status(200).send(token);
  } catch (error) {
    res.status(401).send(error.message);
  }
};
exports.add = async (req, res) => {
  try {
    const userData = req.body;
    const savedUser = await adminService.add(userData);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getall = async (req, res) => {
  try {
    const users = await adminService.getall();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.modifyReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const providerData = req.body;
    const updatedReport = await adminService.updateReportById(
      reportId,
      providerData
    );
    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteReportById = async (req, res) => {
  try {
    const reportId = req.params.id;
    const deletedReport = await adminService.deleteReportById(reportId);
    res.status(200).json(deletedReport);
  } catch (error) {
    console.error("Error deleting report by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.createadmin = async (req, res) => {
  try {
    const result = await adminService.createadmin(req.body, res);
  } catch (error) {
    console.error(error);
  }
};

exports.addprovider = async (req, res) => {
  try {
    const providerData = req.body;
    console.log(providerData);

    const imagePath = req.file ? req.file.path : null;
    if (!imagePath) {
      return res.status(400).json({ error: "please Image is required" });
    }

    const savedprovider = await adminService.addprovider({
      ...providerData,
      image: imagePath,
    });
    res.status(201).json(savedprovider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getproviders = async (req, res) => {
  try {
    const providers = await adminService.getproviders();
    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.modifyprovider = async (req, res) => {
  try {
    const providerId = req.params.id;
    const providerData = req.body;
    const updatedprovider = await adminService.modifyprovider(
      providerId,
      providerData
    );
    res.status(200).json(updatedprovider);
  } catch (error) {
    console.error("Error updating provider:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteproviderById = async (req, res) => {
  try {
    const providerId = req.params.id;
    const deletedprovider = await adminService.deleteprovider(providerId);
    res.status(200).json(deletedprovider);
  } catch (error) {
    console.error("Error deleting provider by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addProvider = async (req, res) => {
  try {
    const { email, password, name, phonenumber } = req.body;

    // Validate the necessary fields
    if (!email || !password || !name || !phonenumber) {
      return res.status(400).json({
        error:
          "Missing required fields: email, password, name, and phonenumber.",
      });
    }

    // Call the service to add the provider
    const savedProvider = await adminService.addProvider(req.body);

    // Return the saved provider data
    res.status(201).json(savedProvider);
  } catch (error) {
    console.error("Error while adding provider:", error);
    res.status(500).json({
      error: error.message || "An error occurred while adding the provider",
    });
  }
};

exports.getProviders = async (req, res) => {
  try {
    const providers = await adminService.getProviders();
    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.modifyProvider = async (req, res) => {
  try {
    const providerId = req.params.id;
    const providerData = req.body;
    const updatedProvider = await adminService.modifyProvider(
      providerId,
      providerData
    );
    res.status(200).json(updatedProvider);
  } catch (error) {
    console.error("Error updating provider:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteProviderById = async (req, res) => {
  try {
    const providerId = req.params.id;
    const deletedProvider = await adminService.deleteProvider(providerId);
    res.status(200).json(deletedProvider);
  } catch (error) {
    console.error("Error deleting provider by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getallOrders = async (req, res) => {
  try {
    const orders = await adminService.getallOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getbyid = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await adminService.getbyid(id);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getbyemail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await adminService.getbyemail(email);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deletebyid = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await adminService.deletebyid(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error("Error deleting user by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deletebyemail = async (req, res) => {
  try {
    const email = req.params.email;
    const deletedUser = await adminService.deletebyemail(email);
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error("Error deleting user by email:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updatebyid = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const updatedUser = await adminService.updatebyid(id, newData);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const updatedOrder = await adminService.updateOrderById(id, newData);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addToSlider = async (req, res) => {
  try {
    const { image_url, image_name } = req.body;
    if (!image_url || typeof image_url !== "string") {
      return res.status(400).json({
        error: "Image URL is required and must be a valid string: " + image_url,
      });
    }
    const savedImage = await adminService.addToSlider(image_name, image_url);
    res.status(201).json({
      message: "Image successfully added to slider",
      image: savedImage,
    });
  } catch (error) {
    console.error("Error adding image:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSlider = async (req, res) => {
  try {
    const images = await adminService.getFromSlider();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const updatedImage = await adminService.updateImagebyid(id, newData);
    res.status(200).json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteImagebyid = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteImage = await adminService.deleteFromSlider(id);
    res.status(200).json(deleteImage);
  } catch (error) {
    console.error("Error deleting image by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getallReports = async (req, res) => {
  try {
    const reports = await adminService.getallReports();
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await adminService.getReportById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }
    res.status(200).json({
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the report.",
    });
  }
};
