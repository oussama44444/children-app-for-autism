import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/stories";

export default function AdminDashboard() {
  const [stories, setStories] = useState([]);
  const [editingStory, setEditingStory] = useState(null);
  const [form, setForm] = useState({ title: "", stages: "" });

  // Fetch stories
  useEffect(() => {
    axios.get(API_URL).then(res => setStories(res.data.data || res.data));
  }, []);

  // Handle edit button
  const handleEdit = (story) => {
    setEditingStory(story);
    setForm({
      title: story.title,
      stages: JSON.stringify(story.stages, null, 2)
    });
  };

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Update story (PUT) - always send raw JSON
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingStory) return;

    try {
      await axios.put(
        `${API_URL}/${editingStory._id}`,
        {
          title: form.title,
          stages: form.stages
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      // Refresh stories
      const res = await axios.get(API_URL);
      setStories(res.data.data || res.data);
      setEditingStory(null);
      setForm({ title: "", stages: "" });
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to update story. Make sure you are sending valid JSON."
      );
    }
  };

  return (
    <div>
      <h2>Stories Admin</h2>
      <ul>
        {stories.map(story => (
          <li key={story._id}>
            <strong>{story.title}</strong>
            <button onClick={() => handleEdit(story)}>Edit</button>
          </li>
        ))}
      </ul>
      {editingStory && (
        <form onSubmit={handleUpdate}>
          <h3>Edit Story</h3>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
          />
          <textarea
            name="stages"
            value={form.stages}
            onChange={handleChange}
            placeholder="Stages (JSON)"
            rows={8}
          />
          {/* No image upload field */}
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditingStory(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
