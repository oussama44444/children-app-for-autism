const userService = require("../services/user");

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
