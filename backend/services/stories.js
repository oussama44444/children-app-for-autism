const cloudinary = require('../config/cloudinary');
const Story = require('../models/story');
const userService = require('./user');

async function getAllStories(language, page = 1, limit = 20, includePremium = true) {
  // ensure numeric values
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, parseInt(limit, 10) || 20);
  const filter = { availableLanguages: language };
  if (!includePremium) {
    filter.isPremium = false;
  }

  // total count for pagination
  const total = await Story.countDocuments(filter);

  const stories = await Story
    .find(filter, "title image availableLanguages difficultyLevel isPremium description createdAt points")
    .sort({ createdAt: -1 })
    .skip((p - 1) * l)
    .limit(l);

  const totalPages = Math.max(1, Math.ceil(total / l));

  return {
    count: stories.length,
    data: stories,
    pagination: {
      page: p,
      limit: l,
      total,
      totalPages,
    },
  };
}


async function getStoryById(id) {
  return await Story.findById(id);
}

async function uploadToCloudinary(file, options = {}) {
  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
  return await cloudinary.uploader.upload(dataURI, options);
}

async function createStory({ file, body }) {
  if (!file) throw new Error('Image file is required');

  const title = JSON.parse(body.title);
  const availableLanguages = JSON.parse(body.availableLanguages);
  const stagesData = JSON.parse(body.stages);
  const difficultyLevel = JSON.parse(body.difficultyLevel) || 'easy';
  const isPremium = JSON.parse(body.isPremium) || false;
  const description = JSON.parse(body.description) || "";

  const imageResult = await uploadToCloudinary(file, { folder: 'stories/images' });

  const storyData = {
    title: {
      fr: availableLanguages.includes('fr') ? (title.fr || 'Titre français') : 'Titre français',
      tn: availableLanguages.includes('tn') ? (title.tn || 'عنوان تونسي') : '',
    },
    image: imageResult.secure_url,
    availableLanguages: availableLanguages,
    isPremium: isPremium,
    difficultyLevel: difficultyLevel,
    description: description,
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

  // Validation similar to controller
  const validationErrors = [];
  if (availableLanguages.includes('fr')) {
    if (!storyData.title.fr || !storyData.title.fr.trim()) validationErrors.push('French title is required');
    storyData.stages.forEach((stage, stageIndex) => {
      stage.segments.forEach((segment, segmentIndex) => {
        if (!segment.audio.fr || !segment.audio.fr.trim()) validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}: French audio is required`);
        if (!segment.question.question.fr || !segment.question.question.fr.trim()) validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}: French question is required`);
        segment.question.answers.forEach((answer, answerIndex) => {
          if (!answer.text.fr || !answer.text.fr.trim()) validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}, Answer ${answerIndex + 1}: French answer text is required`);
        });
      });
    });
  }
  if (availableLanguages.includes('tn')) {
    if (!storyData.title.tn || !storyData.title.tn.trim()) validationErrors.push('Tunisian title is required');
    storyData.stages.forEach((stage, stageIndex) => {
      stage.segments.forEach((segment, segmentIndex) => {
        if (!segment.audio.tn || !segment.audio.tn.trim()) validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}: Tunisian audio is required`);
        if (!segment.question.question.tn || !segment.question.question.tn.trim()) validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}: Tunisian question is required`);
        segment.question.answers.forEach((answer, answerIndex) => {
          if (!answer.text.tn || !answer.text.tn.trim()) validationErrors.push(`Stage ${stageIndex + 1}, Segment ${segmentIndex + 1}, Answer ${answerIndex + 1}: Tunisian answer text is required`);
        });
      });
    });
  }

  if (validationErrors.length > 0) {
    const err = new Error('Validation failed: ' + validationErrors.join(', '));
    err.status = 400;
    throw err;
  }

  const story = new Story(storyData);
  await story.save();
  return story;
}

async function updateStory(id, { files, body }) {
  const story = await Story.findById(id);
  if (!story) {
    const err = new Error('Story not found');
    err.status = 404;
    throw err;
  }

  let title = story.title;
  let availableLanguages = story.availableLanguages;
  let stagesData = story.stages;

  if (body.title) {
    try { title = JSON.parse(body.title); } catch (e) { title = body.title; }
  }
  if (body.availableLanguages) {
    try { availableLanguages = JSON.parse(body.availableLanguages); } catch (e) { availableLanguages = body.availableLanguages; }
  }
  if (body.difficultyLevel) {
    try { story.difficultyLevel = JSON.parse(body.difficultyLevel); } catch (e) { /* keep existing */ }
  }
  if (body.isPremium) {
    try { story.isPremium = JSON.parse(body.isPremium); } catch (e) { /* keep existing */ }
  }
  if (body.stages) {
    try { stagesData = JSON.parse(body.stages); } catch (e) { stagesData = body.stages; }
  }
  if (body.description) {
    try { story.description = JSON.parse(body.description); } catch (e) { /* keep existing */ }
  }

  if (files && files.audio && files.audio.length > 0) {
    let audioMap = {};
    if (body.audioMap) {
      try { audioMap = JSON.parse(body.audioMap); } catch (e) { audioMap = {}; }
    }

    for (const file of files.audio) {
      try {
        const audioResult = await uploadToCloudinary(file, { resource_type: 'video', folder: 'stories/audio' });
        const original = file.originalname;
        const mapping = audioMap[original];
        const url = audioResult.secure_url;

        if (mapping && Number.isInteger(mapping.stage) && Number.isInteger(mapping.segment) && mapping.lang) {
          const s = mapping.stage;
          const seg = mapping.segment;
          const lang = mapping.lang;
          if (stagesData && stagesData[s] && stagesData[s].segments && stagesData[s].segments[seg]) {
            if (!stagesData[s].segments[seg].audio) stagesData[s].segments[seg].audio = {};
            stagesData[s].segments[seg].audio[lang] = url;
          }
        }
      } catch (e) {
        // swallow per-file errors but continue
      }
    }
  }

  if (files && files.image && files.image.length > 0) {
    const file = files.image[0];
    const imageResult = await uploadToCloudinary(file, { folder: 'stories/images' });
    story.image = imageResult.secure_url;
  }

  if (title) story.title = title;
  if (availableLanguages) story.availableLanguages = availableLanguages;
  if (stagesData) story.stages = stagesData;

  const updated = await story.save();
  return updated;
}

async function uploadAudio(file) {
  if (!file) throw new Error('No audio file provided');
  const result = await uploadToCloudinary(file, { resource_type: 'video', folder: 'stories/audio' });
  return result.secure_url;
}

async function uploadImage(file) {
  if (!file) throw new Error('No image file provided');
  const result = await uploadToCloudinary(file, { folder: 'stories' });
  return result.secure_url;
}

async function deleteStory(id) {
  const story = await Story.findByIdAndDelete(id);
  if (!story) {
    const err = new Error('Story not found');
    err.status = 404;
    throw err;
  }
  return { id };
}

// Mark story as completed for a user and award points
async function completeStoryForUser(storyId, userId) {
  const story = await Story.findById(storyId);
  if (!story) {
    const err = new Error('Story not found');
    err.status = 404;
    throw err;
  }

  const points = Number(story.points || 0);
  let pointsAdded = 0;
  if (points > 0) {
    // delegate to user service to increment points
    const res = await userService.addPoints(userId, points, storyId);
    pointsAdded = res?.pointsAdded || 0;
  }

  // Optionally: you might want to track per-user completion here
  return { storyId, userId, pointsAdded };
}

module.exports = {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  uploadAudio,
  uploadImage,
  deleteStory,
  completeStoryForUser,
};
