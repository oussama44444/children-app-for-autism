const storiesService = require('../services/stories');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userService = require('../services/user');

const getAllStories = async (req, res) => {
  try {
    console.log('Get all stories request, query params:', req.query);
    const language = req.query.language || 'fr';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    console.log('Fetching stories for language:', language, 'page:', page, 'limit:', limit);
    // determine whether to include premium stories based on authenticated user's premium flag
    let includePremium = true;
    const result = await storiesService.getAllStories(language, page, limit, includePremium);
    // return data with pagination metadata for client-side paging
    res.json({ success: true, count: result.count, data: result.data, pagination: result.pagination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStoryById = async (req, res) => {
  try {
    const story = await storiesService.getStoryById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    // If story is premium, only allow access to premium users
    if (story.isPremium) {
      // try to extract user from Authorization header if present
      const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
      let userIsPremium = false;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const u = await User.findById(decoded.userId);
          userIsPremium = !!(u && u.premium);
        } catch (e) {
          userIsPremium = false;
        }
      }
      if (!userIsPremium) {
        return res.status(403).json({ success: false, message: 'Premium content. Upgrade to access.' });
      }
    }
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createStory = async (req, res) => {
  try {
    const story = await storiesService.createStory({ file: req.file, body: req.body });
    res.json({ success: true, message: 'Story created successfully!', data: story });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

const updateStory = async (req, res) => {
  try {
    const updated = await storiesService.updateStory(req.params.id, { files: req.files, body: req.body });
    res.json({ success: true, message: 'Story updated successfully!', data: updated });
  } catch (error) {
    const status = error.status || 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

const uploadAudio = async (req, res) => {
  try {
    const url = await storiesService.uploadAudio(req.file);
    res.json({ success: true, audioUrl: url, message: 'Audio uploaded successfully' });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message || 'Failed to upload audio' });
  }
};

const uploadImage = async (req, res) => {
  try {
    const url = await storiesService.uploadImage(req.file);
    res.json({ success: true, imageUrl: url, message: 'Image uploaded successfully' });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message || 'Failed to upload image' });
  }
};

const deleteStory = async (req, res) => {
  try {
    const data = await storiesService.deleteStory(req.params.id);
    res.json({ success: true, message: 'Story deleted successfully', data });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

// Marks a story as completed by the authenticated user and adds story points to their account
const completeStory = async (req, res) => {
  try {
    const userId = req.user && req.user.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const storyId = req.params.id;
    const story = await storiesService.getStoryById(storyId);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });

    const points = Number(story.points || 0);

      // increment user points (pass storyId to avoid double-counting)
      const { user: updatedUser, pointsAdded } = await userService.addPoints(userId, points, storyId);

      return res.json({ success: true, message: 'Story completed', pointsAdded: pointsAdded || 0, userPoints: updatedUser.points });
  } catch (err) {
    console.error('Complete story error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  uploadAudio,
  uploadImage,
  deleteStory,
  completeStory,
};
