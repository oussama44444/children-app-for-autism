import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://192.168.100.23:5000';
const api = axios.create({ baseURL: `${BACKEND_URL}/stories` });

const authHeader = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

// Hardcoded stories data - will be replaced with backend API calls
const HARDCODED_STORIES = [
  {
    id: 1,
    title: 'Space Explorer Journey',
    emoji: '🚀',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
    description: 'Blast off into space and discover new planets with Captain Stella!',
    category: 'Science Fiction',
    difficulty: 'moyen',
    points: 100,
    duration: '5 min',
    completed: true,
    progress: 100,
    isPremium: false,
    language: 'fr',
  },
  {
    id: 2,
    title: 'Jungle Expedition',
    emoji: '🦁',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    description: 'Explore the wild jungle and learn about amazing animals with Dr. Leo!',
    category: 'Nature',
    difficulty: 'difficile',
    points: 150,
    duration: '7 min',
    completed: true,
    progress: 100,
    isPremium: false,
    language: 'fr',
  },
  {
    id: 3,
    title: 'Dinosaur Time Travel',
    emoji: '🦕',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    description: 'Travel back in time to meet the mighty dinosaurs of the prehistoric era!',
    category: 'History',
    difficulty: 'difficile',
    points: 150,
    duration: '10 min',
    completed: false,
    progress: 0,
    isPremium: false,
    language: 'fr',
  },
  {
    id: 4,
    title: 'Ocean Adventure',
    emoji: '🐠',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
    description: 'Dive deep into the ocean and discover colorful sea creatures!',
    category: 'Nature',
    difficulty: 'moyen',
    points: 120,
    duration: '6 min',
    completed: false,
    progress: 0,
    isPremium: false,
    language: 'fr',
  },
  {
    id: 5,
    title: 'Magic Forest',
    emoji: '🌳',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
    description: 'Enter the enchanted forest and meet magical creatures!',
    category: 'Fantasy',
    difficulty: 'moyen',
    points: 110,
    duration: '8 min',
    completed: false,
    progress: 45,
    isPremium: false,
    language: 'fr',
  },
  {
    id: 6,
    title: 'Castle Mystery',
    emoji: '🏰',
    imageUrl: 'https://images.unsplash.com/photo-1583241800698-ede5b5e8dd7f?w=800',
    description: 'Solve puzzles and mysteries in the ancient castle!',
    category: 'Adventure',
    difficulty: 'difficile',
    points: 180,
    duration: '12 min',
    completed: false,
    progress: 0,
    isPremium: false,
    language: 'fr',
  },
  {
    id: 7,
    title: 'Dragon Quest',
    emoji: '🐉',
    imageUrl: 'https://images.unsplash.com/photo-1589253523135-64f7ed9b9f81?w=800',
    description: 'Embark on an epic quest to find the legendary dragon and save the kingdom!',
    category: 'Fantasy',
    difficulty: 'difficile',
    points: 250,
    duration: '15 min',
    completed: false,
    progress: 0,
    isPremium: true,
    language: 'fr',
  },
  {
    id: 8,
    title: 'Pirate Treasure Hunt',
    emoji: '🏴‍☠️',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    description: 'Sail the seven seas and search for hidden treasure with Captain Blackbeard!',
    category: 'Adventure',
    difficulty: 'difficile',
    points: 220,
    duration: '12 min',
    completed: false,
    progress: 0,
    isPremium: true,
    language: 'fr',
  },
  {
    id: 9,
    title: 'Ancient Egypt Secrets',
    emoji: '🏜️',
    imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800',
    description: 'Explore the pyramids and discover the secrets of ancient pharaohs!',
    category: 'History',
    difficulty: 'difficile',
    points: 200,
    duration: '11 min',
    completed: false,
    progress: 0,
    isPremium: true,
    language: 'fr',
  },
  {
    id: 10,
    title: 'Superhero Academy',
    emoji: '🦸',
    imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800',
    description: 'Join the academy and learn to use your superpowers to save the city!',
    category: 'Action',
    difficulty: 'moyen',
    points: 180,
    duration: '9 min',
    completed: false,
    progress: 0,
    isPremium: true,
    language: 'fr',
  },
  // Tunisian stories
  {
    id: 11,
    title: 'مغامرة الفضاء',
    emoji: '🚀',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
    description: 'انطلق للفضاء واكتشف كواكب جديدة مع الكابتن ستيلا!',
    category: 'خيال علمي',
    difficulty: 'متوسط',
    points: 100,
    duration: '5 دقائق',
    completed: true,
    progress: 100,
    isPremium: false,
    language: 'tn',
  },
  {
    id: 12,
    title: 'رحلة الغابة',
    emoji: '🦁',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    description: 'استكشف الغابة البرية وتعلم عن الحيوانات الرائعة مع الدكتور ليو!',
    category: 'طبيعة',
    difficulty: 'صعب',
    points: 150,
    duration: '7 دقائق',
    completed: false,
    progress: 0,
    isPremium: false,
    language: 'tn',
  },
  {
    id: 13,
    title: 'عالم الديناصورات',
    emoji: '🦕',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    description: 'ارجع بالزمن والتقي بالديناصورات العظيمة!',
    category: 'تاريخ',
    difficulty: 'صعب',
    points: 150,
    duration: '10 دقائق',
    completed: false,
    progress: 0,
    isPremium: true,
    language: 'tn',
  },
];

// Local function to get stories (uses hardcoded data for now)
// TODO: Replace with actual API call when backend is ready
export const getStoriesLocal = async (language = 'fr') => {
  // Simulate async behavior like a real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter stories by language
      const filteredStories = HARDCODED_STORIES.filter(story => story.language === language);
      resolve(filteredStories);
    }, 300);
  });
};

// TODO: BACKEND ENDPOINT - GET /api/stories
// Description: Fetch all stories with user progress
// Headers: Authorization Bearer token
// Response: Array of story objects
// Example response:
// [
//   {
//     id: 1,
//     title: "Le Petit Chat Curieux",
//     imageUrl: "https://storage.example.com/stories/cat.jpg", // Set by admin
//     thumbnailUrl: "https://storage.example.com/stories/cat_thumb.jpg",
//     color: "#B4E7CE", // Optional: can be auto-generated or set by admin
//     duration: "5 min",
//     audioUrl: "https://storage.example.com/stories/cat_audio.mp3",
//     completed: true, // Based on user_progress table
//     progress: 100, // Percentage from user_progress
//     createdAt: "2024-01-15T10:00:00Z",
//     createdBy: "admin_id" // Admin who created the story
//   }
// ]
export const getStories = async (language, token) => {
  const res = await api.get('/', {
    params: { language },
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
  getStoriesLocal,
  getStoryById,
  updateStoryProgress,
  getCompletedStories,
  getSuggestedStories,
};
