const cloudinary = require('../config/cloudinary');
const Story = require('../models/story');

// GET all stories
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single story by ID
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE story
const createStory = async (req, res) => {
  try {
    console.log('📁 File received:', req.file);
    console.log('📝 Body received:', req.body);

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const title = JSON.parse(req.body.title);
    const availableLanguages = JSON.parse(req.body.availableLanguages);
    const stagesData = JSON.parse(req.body.stages);

    console.log('📖 Parsed title:', title);
    console.log('🌍 Parsed availableLanguages:', availableLanguages);
    console.log('🎬 Parsed stagesData:', stagesData);

    console.log('☁️ Uploading image to Cloudinary...');
    const imageB64 = Buffer.from(req.file.buffer).toString('base64');
    const imageDataURI = 'data:' + req.file.mimetype + ';base64,' + imageB64;

    const imageResult = await cloudinary.uploader.upload(imageDataURI, {
      folder: 'stories/images',
    });

    console.log('✅ Image uploaded:', imageResult.secure_url);

    const storyData = {
      title: {
        fr: availableLanguages.includes('fr') ? (title.fr || 'Titre français') : 'Titre français',
        tn: availableLanguages.includes('tn') ? (title.tn || 'عنوان تونسي') : '',
      },
      image: imageResult.secure_url,
      availableLanguages: availableLanguages,
      stages: stagesData.map((stage, stageIndex) => ({
        segments: stage.segments.map((segment, segmentIndex) => {
          const audio = {
            fr: availableLanguages.includes('fr') ? (segment.audio?.fr || '') : 'https://example.com/placeholder-fr.mp3',
            tn: availableLanguages.includes('tn') ? (segment.audio?.tn || '') : '',
          };

          const questionAudio = {
            fr: segment.question?.questionAudio?.fr || '',
            tn: segment.question?.questionAudio?.tn || '',
          };

          const questionData = {
            question: {
              fr: availableLanguages.includes('fr') ? (segment.question.question.fr || `Question ${stageIndex + 1}-${segmentIndex + 1}`) : `Question ${stageIndex + 1}-${segmentIndex + 1}`,
              tn: availableLanguages.includes('tn') ? (segment.question.question.tn || `سؤال ${stageIndex + 1}-${segmentIndex + 1}`) : '',
            },
            questionAudio,
            answers: segment.question.answers.map((answer, answerIndex) => ({
              text: {
                fr: availableLanguages.includes('fr') ? (answer.text.fr || `Réponse ${answerIndex + 1}`) : `Réponse ${answerIndex + 1}`,
                tn: availableLanguages.includes('tn') ? (answer.text.tn || `جواب ${answerIndex + 1}`) : '',
              },
              correct: answer.correct,
            })),
            hint: {
              fr: segment.question.hint?.fr || '',
              tn: segment.question.hint?.tn || '',
            },
          };

          return {
            audio,
            question: questionData,
          };
        }),
      })),
    };

    console.log('💾 Final story data to save:', JSON.stringify(storyData, null, 2));

    const validationErrors = [];
    if (availableLanguages.includes('fr')) {
      if (!storyData.title.fr || !storyData.title.fr.trim()) {
        validationErrors.push('French title is required');
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
    if (availableLanguages.includes('tn')) {
      if (!storyData.title.tn || !storyData.title.tn.trim()) {
        validationErrors.push('Tunisian title is required');
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
      return res.status(400).json({ success: false, message: 'Validation failed: ' + validationErrors.join(', ') });
    }

    const story = new Story(storyData);
    await story.save();

    res.json({ success: true, message: 'Story created successfully!', data: story });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE story by ID
const updateStory = async (req, res) => {
  try {
    console.log('🔄 UPDATE request received');
    console.log('📁 Files:', req.files);
    console.log('📝 Body:', req.body);

    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    let title = story.title;
    let availableLanguages = story.availableLanguages;
    let stagesData = story.stages;

    if (req.body.title) {
      try {
        title = JSON.parse(req.body.title);
      } catch (e) {
        console.log('Title not JSON, using as-is');
        title = req.body.title;
      }
    }

    if (req.body.availableLanguages) {
      try {
        availableLanguages = JSON.parse(req.body.availableLanguages);
      } catch (e) {
        console.log('availableLanguages not JSON, using as-is');
        availableLanguages = req.body.availableLanguages;
      }
    }

    if (req.body.stages) {
      try {
        stagesData = JSON.parse(req.body.stages);
      } catch (e) {
        console.log('Stages not JSON, using as-is');
        stagesData = req.body.stages;
      }
    }

    // If audio files are provided, an `audioMap` JSON must be sent in form-data mapping
    // original file name -> { stage: <index>, segment: <index>, lang: 'fr'|'tn' }
    // Example: { "greeting-fr.mp3": { "stage":0, "segment":0, "lang":"fr" } }
    if (req.files && req.files.audio && req.files.audio.length > 0) {
      let audioMap = {};
      if (req.body.audioMap) {
        try {
          audioMap = JSON.parse(req.body.audioMap);
        } catch (e) {
          console.log('audioMap not JSON, ignoring mapping');
          audioMap = {};
        }
      }

      for (const file of req.files.audio) {
        try {
          const audioB64 = Buffer.from(file.buffer).toString('base64');
          const audioDataURI = 'data:' + file.mimetype + ';base64,' + audioB64;
          const audioResult = await cloudinary.uploader.upload(audioDataURI, {
            resource_type: 'video',
            folder: 'stories/audio',
          });

          const original = file.originalname;
          const mapping = audioMap[original];
          const url = audioResult.secure_url;

          if (mapping && Number.isInteger(mapping.stage) && Number.isInteger(mapping.segment) && mapping.lang) {
            const s = mapping.stage;
            const seg = mapping.segment;
            const lang = mapping.lang;
            // Ensure indexes exist
            if (stagesData && stagesData[s] && stagesData[s].segments && stagesData[s].segments[seg]) {
              if (!stagesData[s].segments[seg].audio) stagesData[s].segments[seg].audio = {};
              stagesData[s].segments[seg].audio[lang] = url;
              console.log(`🔊 Updated audio for stage ${s} segment ${seg} lang ${lang}`);
            } else {
              console.log(`Mapping points to non-existing stage/segment: ${original}`);
            }
          } else {
            console.log(`No valid mapping for uploaded audio ${original}, uploaded but not merged into stages`);
          }
        } catch (e) {
          console.error('Audio upload failed for file', file.originalname, e);
        }
      }
    }

    // Update image if provided
    if (req.files && req.files.image && req.files.image.length > 0) {
      const file = req.files.image[0];
      console.log('☁️ Uploading new image to Cloudinary...');
      const imageB64 = Buffer.from(file.buffer).toString('base64');
      const imageDataURI = 'data:' + file.mimetype + ';base64,' + imageB64;

      const imageResult = await cloudinary.uploader.upload(imageDataURI, {
        folder: 'stories/images',
      });
      story.image = imageResult.secure_url;
      console.log('✅ New image uploaded:', story.image);
    }

    if (title) story.title = title;
    if (availableLanguages) story.availableLanguages = availableLanguages;
    if (stagesData) story.stages = stagesData;

    console.log('💾 Saving updated story:', {
      title: story.title,
      availableLanguages: story.availableLanguages,
      stagesCount: story.stages?.length,
    });

    const updatedStory = await story.save();

    res.json({ success: true, message: 'Story updated successfully!', data: updatedStory });
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Upload audio file
const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file provided' });
    }

    const audioB64 = Buffer.from(req.file.buffer).toString('base64');
    const audioDataURI = 'data:' + req.file.mimetype + ';base64,' + audioB64;

    const audioResult = await cloudinary.uploader.upload(audioDataURI, {
      resource_type: 'video',
      folder: 'stories/audio',
    });

    res.json({ success: true, audioUrl: audioResult.secure_url, message: 'Audio uploaded successfully' });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload audio' });
  }
};

// Upload image file
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const imageB64 = Buffer.from(req.file.buffer).toString('base64');
    const imageDataURI = 'data:' + req.file.mimetype + ';base64,' + imageB64;

    const imageResult = await cloudinary.uploader.upload(imageDataURI, {
      folder: 'stories',
    });

    res.json({ success: true, imageUrl: imageResult.secure_url, message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};

// DELETE story by ID
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    res.json({ success: true, message: 'Story deleted successfully', data: { id: req.params.id } });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ success: false, message: error.message });
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
};
