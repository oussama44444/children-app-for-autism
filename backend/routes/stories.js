const express = require('express');
const router = express.Router();
const multer = require('multer');
const storiesController = require('../controllers/storiesController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', storiesController.getAllStories);
router.get('/:id', storiesController.getStoryById);
router.post('/', upload.single('image'), storiesController.createStory);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 100 }]), storiesController.updateStory);
router.post('/upload-audio', upload.single('audio'), storiesController.uploadAudio);
router.post('/upload-image', upload.single('image'), storiesController.uploadImage);
router.delete('/:id', storiesController.deleteStory);

module.exports = router;