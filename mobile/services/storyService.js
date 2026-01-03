import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://192.168.1.6:5000';
const api = axios.create({ baseURL: `${BACKEND_URL}/stories` });

const authHeader = (token) => (token ? { Authorization: `Bearer ${token}` } : {});



export const getStories = async (language, token, page = 1, limit = 20) => {
  const res = await api.get('/', {
    params: { language, page, limit },
    headers: authHeader(token),
  });
  return res.data;
};


// TODO: BACKEND ENDPOINT - GET /api/stories/:id
// Description: Fetch single story details
// Headers: Authorization Bearer token
// Response: Story object with full details including questions
export const getStoryById = async (storyId, token) => {
  const res = await api.get(`/${storyId}`, { headers: authHeader(token) });
  return res.data;
};

// TODO: BACKEND ENDPOINT - POST /api/stories/:id/progress
// Description: Update user progress for a story
// Headers: Authorization Bearer token
// Body: { progress: number (0-100), completed: boolean }
export const updateStoryProgress = async (storyId, progressData, token) => {
  const res = await api.post(`/${storyId}/progress`, progressData, { 
    headers: authHeader(token) 
  });
  return res.data;
};

// POST /stories/:id/complete - mark story completed and award points server-side
export const completeStory = async (storyId, token) => {
  const res = await api.post(`/${storyId}/complete`, {}, { headers: authHeader(token) });
  return res.data;
};

// TODO: BACKEND ENDPOINT - GET /api/stories/completed
// Description: Fetch only completed stories for current user
// Headers: Authorization Bearer token
export const getCompletedStories = async (token) => {
  const res = await api.get('/completed', { headers: authHeader(token) });
  return res.data;
};

// TODO: BACKEND ENDPOINT - GET /api/stories/suggested
// Description: Fetch suggested stories based on user level/preferences
// Headers: Authorization Bearer token
export const getSuggestedStories = async (token) => {
  const res = await api.get('/suggested', { headers: authHeader(token) });
  return res.data;
};

// ADMIN ENDPOINTS (for reference)
// TODO: BACKEND ENDPOINT - POST /api/admin/stories
// Description: Admin creates new story
// Headers: Authorization Bearer token (admin only)
// Body: FormData with:
//   - title: string
//   - image: file (story cover image)
//   - audio: file (story audio file)
//   - duration: string
//   - color: string (optional)
//   - questions: JSON array of questions
// export const createStory = async (formData, token) => {
//   const res = await api.post('/admin/stories', formData, {
//     headers: { 
//       ...authHeader(token), 
//       'Content-Type': 'multipart/form-data' 
//     }
//   });
//   return res.data;
// };

// TODO: BACKEND ENDPOINT - PUT /api/admin/stories/:id
// Description: Admin updates story
// Headers: Authorization Bearer token (admin only)
// export const updateStory = async (storyId, formData, token) => {
//   const res = await api.put(`/admin/stories/${storyId}`, formData, {
//     headers: { 
//       ...authHeader(token), 
//       'Content-Type': 'multipart/form-data' 
//     }
//   });
//   return res.data;
// };

// TODO: BACKEND ENDPOINT - DELETE /api/admin/stories/:id
// Description: Admin deletes story
// Headers: Authorization Bearer token (admin only)
// export const deleteStory = async (storyId, token) => {
//   const res = await api.delete(`/admin/stories/${storyId}`, { 
//     headers: authHeader(token) 
//   });
//   return res.data;
// };

export default {
  getStories,
  getStoryById,
  updateStoryProgress,
  getCompletedStories,
  getSuggestedStories,
};
