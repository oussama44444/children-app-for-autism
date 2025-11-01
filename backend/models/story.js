const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: {
    fr: { type: String, required: false, default: "Titre français" }, // Remove required
    tn: { type: String, required: false, default: "" }
  },
  image: { type: String, required: true },
  availableLanguages: [{ type: String, enum: ['fr', 'tn'] }],
  stages: [{
    segments: [{
      audio: {
        fr: { type: String, required: false, default: "" }, // Remove required
        tn: { type: String, required: false, default: "" }
      },
      question: {
        question: {
          fr: { type: String, required: false, default: "Question" }, // Remove required
          tn: { type: String, required: false, default: "" }
        },
        answers: [{
          text: {
            fr: { type: String, required: false, default: "Réponse" }, // Remove required
            tn: { type: String, required: false, default: "" }
          },
          correct: { type: Boolean, required: true }
        }],
        hint: {
          fr: { type: String, default: "" },
          tn: { type: String, default: "" }
        }
      }
    }]
  }],
  createdAt: { type: Date, default: Date.now }
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;