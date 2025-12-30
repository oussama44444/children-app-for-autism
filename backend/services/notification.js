// services/notification.js
const { Expo } = require('expo-server-sdk');
const User = require('../models/user');
const Notification = require('../models/notification');

// Create a new Expo SDK client
const expo = new Expo();

class NotificationService {
  /**
   * Send a push notification to a user
   * @param {String} userId - User ID to send notification to
   * @param {Object} notification - Notification data
   * @param {String} notification.title - Notification title
   * @param {String} notification.body - Notification body
   * @param {Object} notification.data - Additional data to send with notification
   * @param {String} notification.type - Notification type (optional)
   * @param {String} notification.bookingId - Related booking ID (optional)
   * @param {String} notification.relatedUserId - Related user ID (optional)
   */
  async sendNotification(userId, { title, body, data = {}, type = 'general', bookingId = null, relatedUserId = null }) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        console.log(`User ${userId} not found`);
        return { success: false, reason: 'User not found' };
      }

      console.log(`User ${userId} notification token:`, user.notif_token ? 'EXISTS' : 'MISSING');

      // Create and store notification in database
      const notificationDoc = await Notification.create({
        user: userId,
        type,
        title,
        body,
        data,
        booking: bookingId,
        relatedUser: relatedUserId,
        sentAt: new Date(),
        delivered: false,
        read: false
      });

      // If user has no push token, just save to DB
      if (!user.notif_token) {
        console.log(`User ${userId} has no notification token - saved to DB only`);
        return { success: true, reason: 'Saved to DB only - no push token', notificationId: notificationDoc._id };
      }

      const pushToken = user.notif_token;

      // Check that the token is a valid Expo push token
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return { success: true, reason: 'Saved to DB only - invalid push token', notificationId: notificationDoc._id };
      }

      // Construct the notification message
      const message = {
        to: pushToken,
        sound: 'default',
        title,
        body,
        data: {
          ...data,
          notificationId: notificationDoc._id.toString()
        },
        priority: 'high',
        channelId: 'default',
      };

      // Send the notification
      const chunks = expo.chunkPushNotifications([message]);
      const tickets = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('Error sending notification chunk:', error);
        }
      }

      // Update notification as delivered
      if (tickets.length > 0 && tickets[0].status === 'ok') {
        await Notification.findByIdAndUpdate(notificationDoc._id, { delivered: true });
      }

      console.log('Notification sent successfully:', tickets);
      return { success: true, tickets, notificationId: notificationDoc._id };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notifications to multiple users
   * @param {Array<String>} userIds - Array of user IDs
   * @param {Object} notification - Notification data
   */
  async sendBulkNotifications(userIds, notification) {
    const results = await Promise.allSettled(
      userIds.map(userId => this.sendNotification(userId, notification))
    );

    return results.map((result, index) => ({
      userId: userIds[index],
      status: result.status,
      value: result.value || result.reason
    }));
  }

  /**
   * Send notification when booking status changes
   * @param {Object} booking - Booking object
   * @param {String} oldStatus - Previous status
   * @param {String} newStatus - New status
   */
  async sendBookingStatusNotification(booking, oldStatus, newStatus) {
    try {
      const statusMessages = {
        confirmed: {
          title: '✅ Booking Confirmed!',
          body: `Your booking #${booking.bookingNumber} has been confirmed for ${new Date(booking.date).toLocaleDateString()}.`,
        },
        cancelled: {
          title: '❌ Booking Cancelled',
          body: `Your booking #${booking.bookingNumber} has been cancelled.`,
        },
        declined: {
          title: '❌ Booking Declined',
          body: `Your booking #${booking.bookingNumber} has been declined by the space owner.`,
        },
        completed: {
          title: '🎉 Booking Completed',
          body: `Your booking #${booking.bookingNumber} has been marked as completed. We hope you had a great game!`,
        },
        no_show: {
          title: '⚠️ Booking Marked as No-Show',
          body: `Your booking #${booking.bookingNumber} was marked as no-show.`,
        },
      };

      const notificationData = statusMessages[newStatus];
      
      if (!notificationData) {
        console.log(`No notification template for status: ${newStatus}`);
        return;
      }

      await this.sendNotification(booking.client.toString(), {
        title: notificationData.title,
        body: notificationData.body,
        data: {
          type: 'booking_status_change',
          bookingId: booking._id.toString(),
          bookingNumber: booking.bookingNumber,
          oldStatus,
          newStatus,
        },
      });
    } catch (error) {
      console.error('Error sending booking status notification:', error);
    }
  }

  /**
   * Send notification to space owner when new booking is created
   * @param {Object} booking - Booking object with populated space and client
   * @param {Object} spaceOwner - Space owner user object
   */
  async sendNewBookingNotification(booking, spaceOwner) {
    try {
      const clientName = booking.client.firstName && booking.client.lastName 
        ? `${booking.client.firstName} ${booking.client.lastName}`
        : 'A client';

      await this.sendNotification(spaceOwner._id.toString(), {
        title: '🎾 New Booking Received!',
        body: `${clientName} has created a new booking (#${booking.bookingNumber}) for ${new Date(booking.date).toLocaleDateString()} at ${booking.startTime}.`,
        data: {
          type: 'new_booking',
          bookingId: booking._id.toString(),
          bookingNumber: booking.bookingNumber,
          clientId: booking.client._id.toString(),
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
        },
      });
    } catch (error) {
      console.error('Error sending new booking notification:', error);
    }
  }

  /**
   * Send notification when payment status changes
   * @param {Object} booking - Booking object
   * @param {String} newPaymentStatus - New payment status
   */
  async sendPaymentStatusNotification(booking, newPaymentStatus) {
    try {
      const paymentMessages = {
        paid: {
          title: '💰 Payment Confirmed',
          body: `Payment for booking #${booking.bookingNumber} has been confirmed.`,
        },
        partially_paid: {
          title: '💰 Partial Payment Received',
          body: `Partial payment for booking #${booking.bookingNumber} has been received. Remaining: ${booking.pricing.remainingToPay} DT`,
        },
        failed: {
          title: '❌ Payment Failed',
          body: `Payment for booking #${booking.bookingNumber} has failed. Please try again.`,
        },
        refunded: {
          title: '↩️ Payment Refunded',
          body: `Payment for booking #${booking.bookingNumber} has been refunded.`,
        },
      };

      const notificationData = paymentMessages[newPaymentStatus];
      
      if (!notificationData) {
        return;
      }

      await this.sendNotification(booking.client.toString(), {
        title: notificationData.title,
        body: notificationData.body,
        data: {
          type: 'payment_status_change',
          bookingId: booking._id.toString(),
          bookingNumber: booking.bookingNumber,
          paymentStatus: newPaymentStatus,
          remainingToPay: booking.pricing.remainingToPay,
        },
      });
    } catch (error) {
      console.error('Error sending payment status notification:', error);
    }
  }

  /**
   * Update user's notification token
   * @param {String} userId - User ID
   * @param {String} token - Expo push token
   */
  async updateUserToken(userId, token) {
    try {
      if (!Expo.isExpoPushToken(token)) {
        throw new Error('Invalid Expo push token');
      }

      await User.findByIdAndUpdate(userId, {
        notif_token: token,
        updatedAt: new Date()
      });

      return { success: true, message: 'Token updated successfully' };
    } catch (error) {
      console.error('Error updating user token:', error);
      throw error;
    }
  }

  /**
   * Remove user's notification token (e.g., on logout)
   * @param {String} userId - User ID
   */
  async removeUserToken(userId) {
    try {
      await User.findByIdAndUpdate(userId, {
        notif_token: null,
        updatedAt: new Date()
      });

      return { success: true, message: 'Token removed successfully' };
    } catch (error) {
      console.error('Error removing user token:', error);
      throw error;
    }
  }

  /**
   * Get unread notifications for a user
   * @param {String} userId - User ID
   * @param {Number} limit - Maximum number of notifications to return
   */
  async getUnreadNotifications(userId, limit = 50) {
    try {
      const notifications = await Notification.find({
        user: userId,
        read: false
      })
      .populate('relatedUser', 'firstName lastName profilePicture')
      .populate('booking', 'bookingNumber date startTime endTime')
      .sort({ createdAt: -1 })
      .limit(limit);

      return { success: true, notifications };
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      throw error;
    }
  }

  /**
   * Get all notifications for a user
   * @param {String} userId - User ID
   * @param {Number} limit - Maximum number of notifications to return
   * @param {Number} skip - Number of notifications to skip
   */
  async getNotifications(userId, limit = 50, skip = 0) {
    try {
      const notifications = await Notification.find({ user: userId })
        .populate('relatedUser', 'firstName lastName profilePicture')
        .populate('booking', 'bookingNumber date startTime endTime')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Notification.countDocuments({ user: userId });
      const unreadCount = await Notification.countDocuments({ user: userId, read: false });

      return { 
        success: true, 
        notifications, 
        total,
        unreadCount,
        hasMore: total > skip + notifications.length
      };
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID (for authorization)
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId, read: false },
        { read: true, readAt: new Date() },
        { new: true }
      );

      if (!notification) {
        return { success: false, message: 'Notification not found or already read' };
      }

      return { success: true, notification };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {String} userId - User ID
   */
  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { user: userId, read: false },
        { read: true, readAt: new Date() }
      );

      return { success: true, modifiedCount: result.modifiedCount };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID (for authorization)
   */
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        user: userId
      });

      if (!notification) {
        return { success: false, message: 'Notification not found' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Notify user when booking is confirmed
   * @param {Object} booking - Booking object
   * @param {String} userId - User ID to notify (usually the booking creator)
   */
  async notifyBookingConfirmed(booking, userId) {
    try {
      console.log('Sending booking confirmed notification to user:', userId);
      console.log('Booking details:', { id: booking._id, date: booking.date, startTime: booking.startTime });
      
      const bookingRef = booking.bookingNumber || `#${booking._id.toString().slice(-6)}`;
      
      await this.sendNotification(userId, {
        title: '✅ Booking Confirmed!',
        body: `Your booking ${bookingRef} for ${new Date(booking.date).toLocaleDateString()} at ${booking.startTime} has been confirmed.`,
        data: {
          type: 'booking_confirmed',
          bookingId: booking._id.toString(),
          bookingNumber: booking.bookingNumber,
        },
        type: 'booking_confirmed',
        bookingId: booking._id
      });
      
      console.log('Booking confirmed notification sent successfully');
    } catch (error) {
      console.error('Error notifying booking confirmed:', error);
    }
  }

  /**
   * Notify user when booking payment is completed
   * @param {Object} booking - Booking object
   * @param {String} userId - User ID to notify (usually the booking creator)
   */
  async notifyBookingPaid(booking, userId) {
    try {
      console.log('Sending booking paid notification to user:', userId);
      console.log('Booking details:', { id: booking._id, date: booking.date, startTime: booking.startTime });
      
      const bookingRef = booking.bookingNumber || `#${booking._id.toString().slice(-6)}`;
      
      await this.sendNotification(userId, {
        title: '💰 Payment Confirmed!',
        body: `Payment for your booking ${bookingRef} on ${new Date(booking.date).toLocaleDateString()} at ${booking.startTime} has been completed.`,
        data: {
          type: 'booking_paid',
          bookingId: booking._id.toString(),
          bookingNumber: booking.bookingNumber,
        },
        type: 'booking_paid',
        bookingId: booking._id
      });
      
      console.log('Booking paid notification sent successfully');
    } catch (error) {
      console.error('Error notifying booking paid:', error);
    }
  }

  /**
   * Notify matchmaking participants when a new player joins
   * @param {Object} booking - Booking object
   * @param {String} newPlayerId - ID of the player who just joined
   * @param {String} newPlayerName - Name of the player who just joined
   */
  async notifyPlayerJoined(booking, newPlayerId, newPlayerName) {
    try {
      // Get all participants except the new player
      // For group bookings, use splitPayment.paidParticipants
      const paidParticipants = booking.splitPayment?.paidParticipants || booking.matchmakingDetails?.paidParticipants || [];
      
      const existingParticipants = paidParticipants
        .filter(p => p.user.toString() !== newPlayerId.toString())
        .map(p => p.user.toString());

      if (existingParticipants.length === 0) {
        console.log('No existing participants to notify about new player');
        return; // No one to notify
      }

      console.log(`Notifying ${existingParticipants.length} participants about new player joining`);

      // Send notification to all existing participants
      const notifications = existingParticipants.map(participantId =>
        this.sendNotification(participantId, {
          title: '🎾 New Player Joined!',
          body: `${newPlayerName} has joined your matchmaking game on ${new Date(booking.date).toLocaleDateString()} at ${booking.startTime}.`,
          data: {
            type: 'player_joined',
            bookingId: booking._id.toString(),
            bookingNumber: booking.bookingNumber,
            newPlayerId: newPlayerId.toString(),
          },
          type: 'player_joined',
          bookingId: booking._id,
          relatedUserId: newPlayerId
        })
      );

      await Promise.all(notifications);
      console.log(`Notified ${existingParticipants.length} participants about new player joining`);
    } catch (error) {
      console.error('Error notifying player joined:', error);
    }
  }
}

module.exports = new NotificationService();
