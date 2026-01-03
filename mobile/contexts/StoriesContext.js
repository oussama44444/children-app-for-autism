import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStories, completeStory as apiCompleteStory, getStoryById as fetchStoryById  } from '../services/storyService';
import  {getProfileAllData} from '../services/userService';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
const StoriesContext = createContext();

export const StoriesProvider = ({ children }) => {
  const { language } = useLanguage();
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token,user, updateUser  } = useAuth();
  const [completingSet, setCompletingSet] = useState(new Set());
  // Fetch stories from service on mount and when language changes
  useEffect(() => {
    // only fetch when we have a language and an auth token
    if (language && token) {
      fetchStories();
    }
  }, [language, token]);

  // Fetch stories from storyService
  // TODO: Replace getStoriesLocal with getStories(token) when backend is ready
  const fetchStories = async (requestedPage = 1, requestedLimit = limit) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStories(language, token, requestedPage, requestedLimit);
      console.log('Fetched stories (raw):', res);

      // Support API responses shaped as either: Array | { data: Array, pagination: {...} } | { stories: Array, pagination: {...} }
      let normalized = [];
      let pagination = null;

      if (Array.isArray(res)) {
        normalized = res;
      } else if (res && Array.isArray(res.data)) {
        normalized = res.data;
        pagination = res.pagination || res.meta || null;
      } else if (res && Array.isArray(res.stories)) {
        normalized = res.stories;
        pagination = res.pagination || res.meta || null;
      } else if (res && Array.isArray(res.data?.data)) {
        normalized = res.data.data;
        pagination = res.data.pagination || res.data.meta || null;
      } else {
        // fallback: try to use res.data if it's an array
        if (res && Array.isArray(res.data)) normalized = res.data;
      }

      console.log('Normalized stories count:', normalized.length);
      // build a set of completed story ids from the authenticated user to mark local stories
      const completedIds = new Set((user && (user.completedStories || user.completed_stories) ? (user.completedStories || user.completed_stories) : []).map(id => String(id)));

      const mapped = normalized.map((s) => {
        const titleObj = s.title || {};
        const localizedTitle = typeof titleObj === 'string' ? titleObj : (titleObj[language] || titleObj.fr || titleObj.tn || '');
        const id = s._id || s.id;
        return {
          id,
          imageUrl: s.image || s.imageUrl || s.cover || null,
          emoji: s.emoji || '📖',
          difficulty: s.difficultyLevel || s.difficulty || null,
          title: localizedTitle,
          description: s.description || '',
          category: s.category || s.genre || '',
          points: s.points || 0,
          isPremium: !!s.isPremium,
          // mark completed if backend says so or if user has this story in their completed list
          completed: !!s.completed || completedIds.has(String(id)),
          createdAt: s.createdAt || (s._id?._timestamp) || null,
        };
      });

      setStories(mapped);

      // handle pagination info if provided
      if (pagination) {
        const p = pagination;
        setPage(p.page || requestedPage);
        setLimit(p.limit || requestedLimit);
        setTotalPages(p.totalPages || p.pages || Math.max(1, Math.ceil((p.total || p.totalCount || mapped.length) / (p.limit || requestedLimit))));
        setTotalCount(p.total || p.totalCount || mapped.length);
      } else if (res && res.totalCount) {
        setPage(requestedPage);
        setLimit(requestedLimit);
        setTotalCount(res.totalCount);
        setTotalPages(Math.max(1, Math.ceil(res.totalCount / requestedLimit)));
      } else {
        // unknown total, derive from returned data
        setPage(requestedPage);
        setLimit(requestedLimit);
        setTotalCount(mapped.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError(err.message || String(err));
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  // Get single story by id. If not present in state, fetch from backend and add to state.
  const getStoryById = async (storyId) => {
    if (!storyId) return null;
    console.log('getStoryById called for id:', storyId);
    const found = (stories || []).find(s => String(s.id) === String(storyId));
    if (found) {
      if (found.details) {
        console.log('getStoryById cache hit (with details) for id:', storyId);
        return found;
      }
      console.log('getStoryById cache hit (no details) for id:', storyId, 'will fetch full details');
      // fall through to fetch full details from backend
    }

    try {
      const res = await fetchStoryById(storyId, token);
      console.log('getStoryById raw response:', res);
      if (!res) return null;
      // unwrap API wrapper if present: { success: true, data: {...} }
      const data = res.data || res;
      console.log('getStoryById unwrapped data:', data);
      if (!data) return null;
      // map backend story to same UI-friendly shape used earlier
      const titleObj = data.title || {};
      const localizedTitle = typeof titleObj === 'string' ? titleObj : (titleObj[language] || titleObj.fr || titleObj.tn || '');
      const mapped = {
        id: data._id || data.id,
        imageUrl: data.image || data.imageUrl || data.cover || null,
        emoji: data.emoji || '📖',
        difficulty: data.difficultyLevel || data.difficulty || null,
        title: localizedTitle,
        description: data.description || '',
        category: data.category || data.genre || '',
        points: data.points || 0,
        isPremium: !!data.isPremium,
        completed: !!data.completed,
        createdAt: data.createdAt || null,
        // include full backend details for player (questions, audio urls, etc.) under `details`
        details: data,
      };

      // append to stories list so UI can reuse it
      setStories(prev => {
        const existing = prev || [];
        const filtered = existing.filter(s => String(s.id) !== String(mapped.id));
        return [...filtered, mapped];
      });
      return mapped;
    } catch (err) {
      console.error('Error fetching story by id:', err);
      return null;
    }
  };

  // Mark story as completed both server-side and locally; award points to user
  const completeStory = async (storyId) => {
    if (!storyId) return null;

    // prevent duplicate in-flight completions
    if (completingSet.has(String(storyId))) {
      return { success: false, error: 'Completion in progress' };
    }

    // check local completed state to avoid calling server again
    const localCompleted = (user && (user.completedStories || user.completed_stories) &&
      ((user.completedStories || user.completed_stories).map(String).includes(String(storyId))))
      || (stories || []).some(s => String(s.id) === String(storyId) && !!s.completed);
    if (localCompleted) {
      // ensure UI shows it completed
      setStories(prev => prev.map(s => (String(s.id) === String(storyId) ? { ...s, completed: true } : s)));
      return { success: true, pointsAdded: 0, alreadyCompleted: true };
    }

    // mark as in-progress
    setCompletingSet(prev => {
      const next = new Set(prev);
      next.add(String(storyId));
      return next;
    });

    try {
      const res = await apiCompleteStory(storyId, token);
      // res expected: { success: true, pointsAdded, userPoints }
      if (res && res.success) {
        const pointsAdded = res.pointsAdded || (res.data && res.data.pointsAdded) || 0;
        const userPoints = res.userPoints || (res.data && res.data.userPoints) || null;

        // update local auth user points if available
        if (user && updateUser) {
          if (userPoints !== null && userPoints !== undefined) {
            await updateUser({ points: userPoints });
          } else {
            const newPoints = (user.points || 0) + pointsAdded;
            await updateUser({ points: newPoints });
          }
        }

        // mark story as completed in local stories list
        setStories(prev => prev.map(s => (String(s.id) === String(storyId) ? { ...s, completed: true } : s)));

        // append storyId to user's completedStories (or completed_stories) locally to keep state consistent
        try {
          if (user && updateUser) {
            const existing = (user.completedStories && Array.isArray(user.completedStories))
              ? user.completedStories
              : (user.completed_stories && Array.isArray(user.completed_stories))
                ? user.completed_stories
                : [];
            const exists = existing.map(id => String(id)).includes(String(storyId));
            if (!exists) {
              const newCompleted = [...existing, storyId];
              // update both shapes to be safe across the app
              await updateUser({ completedStories: newCompleted, completed_stories: newCompleted });

              // fetch the authoritative full profile from server and update local user state
              try {
                const fullProfile = await getProfileAllData(token);
                if (fullProfile) {
                  await updateUser(fullProfile);
                }
              } catch (profileErr) {
                console.error('Error fetching full profile data after completing story:', profileErr);
              }
            }
          }
        } catch (updateErr) {
          console.warn('Failed to update user completedStories locally:', updateErr);
        }

        return { success: true, pointsAdded, userPoints };
      }
      return { success: false, error: res?.message || 'Failed to complete story' };
    } catch (err) {
      console.error('completeStory error:', err);
      return { success: false, error: err.message };
    } finally {
      // remove in-progress mark
      setCompletingSet(prev => {
        const next = new Set(prev);
        next.delete(String(storyId));
        return next;
      });
    }
  };

  const completedStories = (stories || []).filter(story => story && story.completed);
  const suggestedStories = (stories || []).filter(story => story && !story.completed);

  const nextPage = () => {
    if (page < totalPages) {
      fetchStories(page + 1, limit);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      fetchStories(page - 1, limit);
    }
  };

  return (
    <StoriesContext.Provider
      value={{
        stories,
        completedStories,
        suggestedStories,
        loading,
        error,
        refreshStories: fetchStories,
        getStoryById,
        completeStory,
        // pagination
        page,
        limit,
        totalPages,
        totalCount,
        nextPage,
        prevPage,
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
