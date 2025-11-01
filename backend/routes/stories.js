const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Story = require('../models/story');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// GET single story by ID
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ 
        success: false,
        message: 'Story not found' 
      });
    }
    res.json({
      success: true,
      data: story
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// CREATE story
// CREATE story
// CREATE story
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📁 File received:", req.file);
    console.log("📝 Body received:", req.body);

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    // Parse the JSON strings from form data
    const title = JSON.parse(req.body.title);
    const availableLanguages = JSON.parse(req.body.availableLanguages);
    const stagesData = JSON.parse(req.body.stages);
    
    console.log("📖 Parsed title:", title);
    console.log("🌍 Parsed availableLanguages:", availableLanguages);
    console.log("🎬 Parsed stagesData:", stagesData);

    // Upload image to Cloudinary
    console.log("☁️ Uploading image to Cloudinary...");
    
    const imageB64 = Buffer.from(req.file.buffer).toString('base64');
    const imageDataURI = "data:" + req.file.mimetype + ";base64," + imageB64;
    
    const imageResult = await cloudinary.uploader.upload(imageDataURI, {
      folder: "stories/images",
    });

    console.log("✅ Image uploaded:", imageResult.secure_url);

    // Create the story - FIX: Handle both French-only and Tunisian-only properly
    const storyData = {
      title: {
        fr: availableLanguages.includes('fr') ? (title.fr || "Titre français") : "Titre français", // Always provide French fallback
        tn: availableLanguages.includes('tn') ? (title.tn || "عنوان تونسي") : ""
      },
      image: imageResult.secure_url,
      availableLanguages: availableLanguages,
      stages: stagesData.map((stage, stageIndex) => ({
        segments: stage.segments.map((segment, segmentIndex) => {
          // Handle audio - ensure French has content even for Tunisian-only stories
          const audio = {
            fr: availableLanguages.includes('fr') ? (segment.audio.fr || "") : "https://example.com/placeholder-fr.mp3",
            tn: availableLanguages.includes('tn') ? (segment.audio.tn || "") : ""
          };

          // Handle questions and answers
          const questionData = {
            question: {
              fr: availableLanguages.includes('fr') ? (segment.question.question.fr || `Question ${stageIndex + 1}-${segmentIndex + 1}`) : `Question ${stageIndex + 1}-${segmentIndex + 1}`,
              tn: availableLanguages.includes('tn') ? (segment.question.question.tn || `سؤال ${stageIndex + 1}-${segmentIndex + 1}`) : ""
            },
            answers: segment.question.answers.map((answer, answerIndex) => ({
              text: {
                fr: availableLanguages.includes('fr') ? (answer.text.fr || `Réponse ${answerIndex + 1}`) : `Réponse ${answerIndex + 1}`,
                tn: availableLanguages.includes('tn') ? (answer.text.tn || `جواب ${answerIndex + 1}`) : ""
              },
              correct: answer.correct
            })),
            hint: {
              fr: segment.question.hint?.fr || "",
              tn: segment.question.hint?.tn || ""
            }
          };

          return {
            audio: audio,
            question: questionData
          };
        })
      }))
    };

    console.log("💾 Final story data to save:", JSON.stringify(storyData, null, 2));

    // Validate that required fields are present
    const validationErrors = [];
    
    // Check French fields if French is selected
    if (availableLanguages.includes('fr')) {
      if (!storyData.title.fr || !storyData.title.fr.trim()) {
        validationErrors.push("French title is required");
      }
      storyData.stages.forEach((stage, stageIndex) => {
        stage.segments.forEach((segment, segmentIndex) => {
          if (!segment.audio.fr || !segment.audio.fr.trim()) {
            validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}: French audio is required`);
          }
          if (!segment.question.question.fr || !segment.question.question.fr.trim()) {
            validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}: French question is required`);
          }
          segment.question.answers.forEach((answer, answerIndex) => {
            if (!answer.text.fr || !answer.text.fr.trim()) {
              validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}, Answer ${answerIndex + 1}: French answer text is required`);
            }
          });
        });
      });
    }

    // Check Tunisian fields if Tunisian is selected
    if (availableLanguages.includes('tn')) {
      if (!storyData.title.tn || !storyData.title.tn.trim()) {
        validationErrors.push("Tunisian title is required");
      }
      storyData.stages.forEach((stage, stageIndex) => {
        stage.segments.forEach((segment, segmentIndex) => {
          if (!segment.audio.tn || !segment.audio.tn.trim()) {
            validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}: Tunisian audio is required`);
          }
          if (!segment.question.question.tn || !segment.question.question.tn.trim()) {
            validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}: Tunisian question is required`);
          }
          segment.question.answers.forEach((answer, answerIndex) => {
            if (!answer.text.tn || !answer.text.tn.trim()) {
              validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}, Answer ${answerIndex + 1}: Tunisian answer text is required`);
            }
          });
        });
      });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed: " + validationErrors.join(", ")
      });
    }

    const story = new Story(storyData);
    await story.save();

    res.json({
      success: true,
      message: "Story created successfully!",
      data: story,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE story by ID
router.put('/:id', upload.single("image"), async (req, res) => {
  try {
    console.log("🔄 UPDATE request received");
    console.log("📁 File:", req.file);
    console.log("📝 Body:", req.body);

    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Parse JSON data from form data
    let title = story.title;
    let availableLanguages = story.availableLanguages;
    let stagesData = story.stages;

    if (req.body.title) {
      try {
        title = JSON.parse(req.body.title);
      } catch (e) {
        console.log("Title not JSON, using as-is");
        title = req.body.title;
      }
    }

    if (req.body.availableLanguages) {
      try {
        availableLanguages = JSON.parse(req.body.availableLanguages);
      } catch (e) {
        console.log("availableLanguages not JSON, using as-is");
        availableLanguages = req.body.availableLanguages;
      }
    }

    if (req.body.stages) {
      try {
        stagesData = JSON.parse(req.body.stages);
      } catch (e) {
        console.log("Stages not JSON, using as-is");
        stagesData = req.body.stages;
      }
    }

    // Update image if provided
    if (req.file) {
      console.log("☁️ Uploading new image to Cloudinary...");
      const imageB64 = Buffer.from(req.file.buffer).toString('base64');
      const imageDataURI = "data:" + req.file.mimetype + ";base64," + imageB64;
      
      const imageResult = await cloudinary.uploader.upload(imageDataURI, {
        folder: "stories/images",
      });
      story.image = imageResult.secure_url;
      console.log("✅ New image uploaded:", story.image);
    }

    // Update other fields
    if (title) story.title = title;
    if (availableLanguages) story.availableLanguages = availableLanguages;
    if (stagesData) story.stages = stagesData;

    console.log("💾 Saving updated story:", {
      title: story.title,
      availableLanguages: story.availableLanguages,
      stagesCount: story.stages?.length
    });

    const updatedStory = await story.save();

    res.json({
      success: true,
      message: 'Story updated successfully!',
      data: updatedStory
    });

  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Upload audio file
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file provided' });
    }

    const audioB64 = Buffer.from(req.file.buffer).toString('base64');
    const audioDataURI = "data:" + req.file.mimetype + ";base64," + audioB64;
    
    const audioResult = await cloudinary.uploader.upload(audioDataURI, {
      resource_type: 'video',
      folder: 'stories/audio'
    });

    res.json({
      success: true,
      audioUrl: audioResult.secure_url,
      message: 'Audio uploaded successfully'
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload audio' });
  }
});

// Upload image file (like audio)
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const imageB64 = Buffer.from(req.file.buffer).toString('base64');
    const imageDataURI = "data:" + req.file.mimetype + ";base64," + imageB64;

    const imageResult = await cloudinary.uploader.upload(imageDataURI, {
      folder: 'stories'
    });

    res.json({
      success: true,
      imageUrl: imageResult.secure_url,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

// DELETE story by ID
router.delete('/:id', async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ 
        success: false,
        message: 'Story not found'
      });
    }
    res.json({
      success: true,
      message: 'Story deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message
    });
  }
});

module.exports = router;