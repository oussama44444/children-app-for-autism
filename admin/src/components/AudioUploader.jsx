import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export default function AudioUploader({ onAudioUploaded, existingAudio = '' }) {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(existingAudio);

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file (MP3, WAV, etc.)');
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('audio', file);

    try {
      console.log('📤 Uploading audio file:', file.name, file.type, file.size);
      
      // Make sure we're calling the correct endpoint
      const response = await axios.post(`${API_BASE_URL}/stories/upload-audio`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout
      });
      
      console.log('✅ Upload response:', response.data);
      
      if (response.data.success) {
        const newAudioUrl = response.data.audioUrl;
        setAudioUrl(newAudioUrl);
        onAudioUploaded(newAudioUrl);
        alert('✅ Audio uploaded successfully!');
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Error uploading audio:', error);
      
      let errorMessage = 'Failed to upload audio';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`❌ ${errorMessage}`);
      
      // Log more details for debugging
      console.log('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
      <label className="block text-sm font-medium text-gray-700">
        Audio File {!existingAudio && '*'}
      </label>
      
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
          onChange={handleAudioUpload}
          disabled={uploading}
          className="block flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        
        {uploading && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Uploading...</span>
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <p className="text-xs text-gray-500 mt-1 truncate">
            URL: {audioUrl}
          </p>
        </div>
      )}

      {existingAudio && !audioUrl && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Current Audio:</p>
          <audio controls className="w-full">
            <source src={existingAudio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <p className="text-xs text-gray-500 mt-1 truncate">
            URL: {existingAudio}
          </p>
        </div>
      )}
    </div>
  );
}