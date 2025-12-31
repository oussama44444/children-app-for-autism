import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStories } from '../services/storyService';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
const StoriesContext = createContext();

export const StoriesProvider = ({ children }) => {
  const { language } = useLanguage();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  // Fetch stories from service on mount and when language changes
  useEffect(() => {
    // only fetch when we have a language and an auth token
    if (language && token) {
      fetchStories();
    }
  }, [language, token]);

  // Fetch stories from storyService
  // TODO: Replace getStoriesLocal with getStories(token) when backend is ready
  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStories(language, token);
      console.log('Fetched stories (raw):', data);
        // normalize response: backend may return array or { stories: [...] } or { data: [...] }
        const normalized = Array.isArray(data)
          ? data
          : (data && Array.isArray(data.data)
            ? data.data
            : (data && Array.isArray(data.stories) ? data.stories : []));
        console.log('Normalized stories count:', normalized.length);
        // map backend story shape to UI-friendly shape
        const mapped = normalized.map((s) => {
          const titleObj = s.title || {};
          const localizedTitle = typeof titleObj === 'string' ? titleObj : (titleObj[language] || titleObj.fr || titleObj.tn || '');
          return {
            id: s._id || s.id,
            imageUrl: s.image || s.imageUrl || s.cover || null,
            emoji: s.emoji || '📖',
            difficulty: s.difficultyLevel || s.difficulty || null,
            title: localizedTitle,
            description: s.description || '',
            category: s.category || s.genre || '',
            points: s.points || 0,
            isPremium: !!s.isPremium,
            completed: !!s.completed,
            createdAt: s.createdAt || s._id?._timestamp || null,
            // include raw for debugging if needed
            _raw: s,
          };
        });
        console.log('Mapped stories count:', mapped.length);
        setStories(mapped);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError(err.message || String(err));
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const completedStories = (stories || []).filter(story => story && story.completed);
  const suggestedStories = (stories || []).filter(story => story && !story.completed);

  return (
    <StoriesContext.Provider
      value={{
        stories,
        completedStories,
        suggestedStories,
        loading,
        error,
        refreshStories: fetchStories,
      }}
    >
      {children}
    </StoriesContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};
