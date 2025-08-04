const profileService = require("../services/profile");

exports.updateuser = async (req, res) => {
  try {
    await profileService.updateuser(req, res);
  } catch (error) {
    console.error(error);
  }
};

exports.updatepwd = async (req, res) => {
  try {
    await profileService.updatepwd(req, res);
  } catch (error) {
    console.error(error);
  }
};

exports.updateemail = async (req, res) => {
  try {
    await profileService.updateemail(req, res);
  } catch (error) {
    console.error(error);
  }
};

exports.verifyemail = async (req, res) => {
  try {
    const { id, token } = req.params;
    const result = await profileService.verifyemail(id, token);
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

exports.getalldata = async (req, res) => {
  try {
    await profileService.getalldata(req, res);
  } catch (error) {
    console.error(error);
  }
};

exports.uploadimg = async (req, res) => {
  try {
    await profileService.uploadimg(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteaccount = async (req, res) => {
  try {
    await profileService.deleteaccount(req, res);
  } catch (error) {
    console.error(error);
  }
};
