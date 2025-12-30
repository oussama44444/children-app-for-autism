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

