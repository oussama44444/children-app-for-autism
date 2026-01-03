const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  age: { type: Number, default: 0 },
  // ==================== IMAGE ====================
  image: {
    type: String,
    default: "https://i.pinimg.com/474x/51/f6/fb/51f6fb256629fc755b8870c801092942.jpg"
  },
  premium: { type: Boolean, default: false },
  // points accumulated by the user for completed stories
  points: { type: Number, default: 0 },
  // list of completed story ids to prevent double-awarding
  completedStories: [{ type: require('mongoose').Schema.Types.ObjectId, ref: 'Story' }],
  completedStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  subscriptionDate: { type: Date, default: null },
  subscriptionEndDate: { type: Date, default: null },
  points: { type: Number, default: 0 },
  verified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notif_token: { type: String , default: null } 
});



const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
