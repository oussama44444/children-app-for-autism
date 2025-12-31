import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoriesLocal } from '../services/storyService';
import { useLanguage } from './LanguageContext';

const StoriesContext = createContext();

export const StoriesProvider = ({ children }) => {
  const { language } = useLanguage();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stories from service on mount and when language changes
  useEffect(() => {
    if (language) {
      fetchStories();
    }
  }, [language]);

  // Fetch stories from storyService
  // TODO: Replace getStoriesLocal with getStories(token) when backend is ready
  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStoriesLocal(language);
      setStories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const completedStories = stories.filter(story => story.completed);
  const suggestedStories = stories.filter(story => !story.completed);

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
