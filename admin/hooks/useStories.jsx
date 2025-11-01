import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const useStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all stories
  const fetchStories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/stories`);
      if (response.data.success) {
        setStories(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch stories');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new story
  const createStory = async (storyData) => {
    const formData = new FormData();
    formData.append('title', storyData.title);
    formData.append('image', storyData.image);
    formData.append('stages', JSON.stringify(storyData.stages));

    try {
      const response = await axios.post(`${API_BASE_URL}/stories`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        await fetchStories(); // Refresh the list
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.error('Error creating story:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to create story' };
    }
  };

  // Update story
  // Update story
// Update story
// Update story
// Update story
const updateStory = async (id, storyData) => {
  try {
    console.log('🔄 Updating story:', id);
    console.log('📤 Data type:', storyData instanceof FormData ? 'FormData' : 'JSON');
    
    let response;
    
    if (storyData instanceof FormData) {
      console.log('📦 Sending as FormData');
      
      // Log FormData contents for debugging
      for (let [key, value] of storyData.entries()) {
        if (key === 'image') {
          console.log(`📝 FormData - ${key}:`, value.name, value.type, value.size);
        } else if (key === 'stages') {
          console.log(`📝 FormData - ${key}:`, value.substring(0, 100) + '...');
        } else {
          console.log(`📝 FormData - ${key}:`, value);
        }
      }
      
      response = await axios.put(`${API_BASE_URL}/stories/${id}`, storyData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      console.log('📦 Sending as JSON:', storyData);
      response = await axios.put(`${API_BASE_URL}/stories/${id}`, storyData);
    }
    
    console.log('✅ Update response:', response.data);
    
    if (response.data.success) {
      await fetchStories();
      return { success: true, data: response.data.data };
    } else {
      return { success: false, error: response.data.message };
    }
  } catch (err) {
    console.error('❌ Error updating story:', err);
    
    const backendError = err.response?.data?.message || err.response?.data?.error || err.message;
    console.log('🔍 Backend error message:', backendError);
    console.log('🔍 Full error response:', err.response?.data);
    
    return { 
      success: false, 
      error: backendError
    };
  }
};

  // Delete story
  const deleteStory = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/stories/${id}`);
      if (response.data.success) {
        await fetchStories(); // Refresh the list
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting story:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to delete story' };
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return {
    stories,
    loading,
    error,
    fetchStories,
    createStory,
    updateStory,
    deleteStory
  };
};