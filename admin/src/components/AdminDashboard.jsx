import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStories } from '../../hooks/useStories.jsx';
import StoryList from '../components/StoryList';
import StoryForm from '../components/StoryForm';
import axios from "axios";

const DEFAULT_CORRECT_AUDIO_URL = "https://res.cloudinary.com/dtf3pgsd0/video/upload/v1761869161/audio_succ%C3%A9e_i7dtvv.mp3";
const DEFAULT_WRONG_AUDIO_URL = "https://res.cloudinary.com/dtf3pgsd0/video/upload/v1761869168/audio_autre_essai_uzag2d.mp3";

export default function AdminDashboard({ initialView = 'list' }) {
  const { id } = useParams(); // For edit route
  const { stories, loading, error, createStory, updateStory, deleteStory, fetchStories } = useStories();
  const [currentView, setCurrentView] = useState(initialView);
  const [selectedStory, setSelectedStory] = useState(null);

  // If we have an ID from URL, load that story for editing
  useEffect(() => {
    if (id && stories.length > 0) {
      const storyToEdit = stories.find(story => story._id === id);
      if (storyToEdit) {
        setSelectedStory(storyToEdit);
        setCurrentView('edit');
      }
    }
  }, [id, stories]);

  // Upload audio to backend and get Cloudinary URL
  const handleAudioUpload = async (file) => {
    const fd = new FormData();
    fd.append("audio", file);
    const res = await axios.post("http://localhost:5000/stories/upload-audio", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data.audioUrl;
  };

  // Upload image to backend and get Cloudinary URL
  const handleImageUpload = async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await axios.post("http://localhost:5000/stories/upload-image", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data.imageUrl;
  };

const handleCreateStory = async (storyData) => {
  console.log('📦 Received storyData:', storyData);

  // Always require an image file for creation
  if (!(storyData.image && storyData.image instanceof File)) {
    alert("Please upload an image file.");
    return;
  }

  // Prepare stages data first
  let stagesData = [...storyData.stages];
  
  // Upload audio files for each segment
  for (const stage of stagesData) {
    if (Array.isArray(stage.segments)) {
      for (const segment of stage.segments) {
        // Upload French audio if it's a File object
        if (segment.audio?.fr instanceof File) {
          try {
            const audioUrl = await handleAudioUpload(segment.audio.fr);
            segment.audio.fr = audioUrl;
          } catch (error) {
            console.error('Error uploading French audio:', error);
            alert('Error uploading French audio file');
            return;
          }
        }
        
        // Upload Tunisian audio if it's a File object and exists
        if (segment.audio?.tn instanceof File) {
          try {
            const audioUrl = await handleAudioUpload(segment.audio.tn);
            segment.audio.tn = audioUrl;
          } catch (error) {
            console.error('Error uploading Tunisian audio:', error);
            alert('Error uploading Tunisian audio file');
            return;
          }
        }
      }
    }
  }

  // Create form data - IMPORTANT: Add image first and separately
  const fd = new FormData();
  
  // Add image file - this must be a File object
  fd.append("image", storyData.image);
  
  // Add other data as JSON strings
  fd.append("title", JSON.stringify(storyData.title));
  fd.append("availableLanguages", JSON.stringify(storyData.availableLanguages));
  fd.append("stages", JSON.stringify(stagesData));

  // Debug: Check what's in FormData
  console.log('📤 FormData contents:');
  for (let [key, value] of fd.entries()) {
    if (key === 'image') {
      console.log(`- ${key}:`, value instanceof File ? `File: ${value.name}` : value);
    } else {
      console.log(`- ${key}:`, value);
    }
  }

  try {
    const result = await axios.post("http://localhost:5000/stories", fd, {
      headers: { 
        "Content-Type": "multipart/form-data"
      },
      timeout: 60000
    });
    
    if (result.data.success) {
      setCurrentView('list');
      setSelectedStory(null);
      alert('✅ Story created successfully!');
    } else {
      alert('❌ Creation failed: ' + result.data.message);
    }
  } catch (error) {
    console.error('Create error:', error);
    let errorMessage = 'Failed to create story';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(`❌ ${errorMessage}`);
  }
};
  const handleEditStory = async (storyData) => {
  console.log('📦 Editing story with data:', storyData);

  let payload = {
    title: storyData.title,
    availableLanguages: storyData.availableLanguages,
    stages: storyData.stages
  };

  // Create form data
  const fd = new FormData();
  
  // Add image only if it's a new file
  if (storyData.image && storyData.image instanceof File) {
    console.log('📤 Uploading new image...');
    fd.append("image", storyData.image);
  }
  
  // Add other data as JSON strings
  fd.append("title", JSON.stringify(payload.title));
  fd.append("availableLanguages", JSON.stringify(payload.availableLanguages));
  fd.append("stages", JSON.stringify(payload.stages));

  // Debug: Check what's in FormData
  console.log('📤 FormData contents for update:');
  for (let [key, value] of fd.entries()) {
    if (key === 'image') {
      console.log(`- ${key}:`, value instanceof File ? `File: ${value.name}` : value);
    } else {
      console.log(`- ${key}:`, value);
    }
  }

  try {
    // Use PUT request to the specific story ID
    const result = await axios.put(`http://localhost:5000/stories/${selectedStory._id}`, fd, {
      headers: { 
        "Content-Type": "multipart/form-data"
      },
      timeout: 60000
    });
    
    if (result.data.success) {
      setCurrentView('list');
      setSelectedStory(null);
      alert('✅ Story updated successfully!');
      // Refresh stories list
      fetchStories();
    } else {
      alert('❌ Update failed: ' + result.data.message);
    }
  } catch (error) {
    console.error('Update error:', error);
    let errorMessage = 'Failed to update story';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(`❌ ${errorMessage}`);
  }
};
  const handleDeleteStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      const result = await deleteStory(storyId);
      if (result.success) {
        alert('🗑️ Story deleted successfully!');
      } else {
        alert('❌ ' + result.error);
      }
    }
  };

  const handleCreateNew = () => {
    setSelectedStory(null);
    setCurrentView('create');
    // Update URL without page reload
    window.history.pushState({}, '', '/admin/create');
  };

  const handleEdit = (story) => {
    setSelectedStory(story);
    setCurrentView('edit');
    window.history.pushState({}, '', `/admin/edit/${story._id}`);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedStory(null);
    window.history.pushState({}, '', '/admin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading stories...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {currentView === 'list' && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Stories</h2>
              <p className="text-gray-600">Manage your stories, questions, and audio content</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold flex items-center"
            >
              ➕ Create New Story
            </button>
          </div>
          <StoryList
            stories={stories}
            onEdit={handleEdit}
            onDelete={handleDeleteStory}
            onView={(story) => {
              window.open(`/story/${story._id}`, '_blank');
            }}
          />
        </div>
      )}

      {(currentView === 'create' || currentView === 'edit') && (
        <div>
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              ← Back to Stories
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">
              {currentView === 'create' ? 'Create New Story' : `Edit: ${selectedStory?.title}`}
            </h2>
          </div>
          <StoryForm
            story={selectedStory}
            onSubmit={currentView === 'create' ? handleCreateStory : handleEditStory}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}