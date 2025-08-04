const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
      required: true,
    },
    image_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Slider = mongoose.model("Slider", sliderSchema);

module.exports = Slider;
