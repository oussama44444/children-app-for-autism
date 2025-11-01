const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Story = require("../models/story");
const cloudinary = require("../config/cloudinary");

// Create a new story
router.post("/", async (req, res) => {
  const story = new Story(req.body);
  try {
    const savedStory = await story.save();
    res.status(201).json(savedStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all stories
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single story by ID
router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a story by ID (accepts only raw JSON, does NOT update image)
router.put("/:id", async (req, res) => {
  try {
    // Ensure Content-Type is application/json
    if (!req.is('application/json')) {
      return res.status(415).json({ message: "Content-Type must be application/json", success: false });
    }

    let updateData = {};

    // Only accept fields from raw JSON (no image update)
    if (typeof req.body.title !== "undefined") updateData.title = req.body.title;
    if (typeof req.body.stages !== "undefined") {
      if (typeof req.body.stages === "string") {
        try {
          updateData.stages = JSON.parse(req.body.stages);
        } catch {
          updateData.stages = req.body.stages;
        }
      } else {
        updateData.stages = req.body.stages;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update", success: false });
    }

    // Log for debugging
    console.log("Updating story (raw JSON, no image):", req.params.id, updateData);

    // Find the story first
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found", success: false });
    }

    // Track changes
    let changed = false;
    for (const key in updateData) {
      if (story[key] !== updateData[key]) {
        story[key] = updateData[key];
        changed = true;
      }
    }

    const updatedStory = await story.save();

    res.json({ success: true, story: updatedStory });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(400).json({ message: error.message, success: false });
  }
});

// Delete a story by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);
    if (!deletedStory) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;