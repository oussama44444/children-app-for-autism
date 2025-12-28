const userService = require("../services/user");
const notificationService = require("../services/notification");

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const result = await userService.getAll(req);
    const users = result.users || [];
    const totalUsers = result.total || 0;
    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: skip + users.length < totalUsers,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await userService.login(req.body, res);
  } catch (error) {
    console.error(error);
  }
};

exports.register = async (req, res) => {
  try {
    const result = await userService.register(req.body, res);
  } catch (error) {
    console.error(error);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { id, token } = req.params;
    const result = await userService.verifyEmail(id, token);
    if (result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.forgetPassword(email);

    if (result.error) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json({
      message: "Reset password email sent",
      resetPasswordToken: result.resetPasswordToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;
    const message = await userService.resetPassword(newPassword, token);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.sendReport = async (req, res) => {
  const { userId, email, reportIssue, content, orderID } = req.body;

  if (!userId || !email || !reportIssue || !content) {
    return res.status(400).json({
      success: false,
      message: "All fields except orderID are required.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  try {
    const report = await userService.submitReport({
      userId,
      email,
      reportIssue,
      content,
      orderID,
    });

    res.status(200).json({
      success: true,
      message: "Report submitted successfully.",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting the report.",
      error: error.message,
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await userService.getUserReviewsById(userId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register or update push notification token
exports.registerPushToken = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user.userId; // from auth middleware

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Push token is required'
      });
    }

    const result = await notificationService.updateUserToken(userId, token);
    
    res.status(200).json({
      success: true,
      message: 'Push token registered successfully',
      data: result
    });
  } catch (error) {
    console.error('Error registering push token:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove push notification token (e.g., on logout)
exports.removePushToken = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await notificationService.removeUserToken(userId);
    
    res.status(200).json({
      success: true,
      message: 'Push token removed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error removing push token:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
