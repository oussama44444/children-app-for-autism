// models/notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'general',
      'booking_confirmed',
      'booking_paid',
      'player_joined',
      'invitation_received',
      'booking_cancelled',
      'booking_reminder',
      'payment_reminder'
    ]
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date,
    default: null
  },
  delivered: {
    type: Boolean,
    default: false
  },
  // Reference to related entities
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ sentAt: -1 });

// Virtual for age of notification
notificationSchema.virtual('age').get(function() {
  return Date.now() - this.sentAt;
});

module.exports = mongoose.model('Notification', notificationSchema);
