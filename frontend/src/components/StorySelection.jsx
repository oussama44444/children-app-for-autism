import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { frenchTranslations, tunisianTranslations } from "../locales";

export default function StorySelection() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { language } = useLanguage();
  
  // Get translations based on current language
  const t = language === 'fr' ? frenchTranslations : tunisianTranslations;

  // Fetch stories from backend
  useEffect(() => {
    const fetchStories = async () => {
      try {
        console.log("🔄 Fetching stories from API...");
        const response = await axios.get("http://localhost:5000/stories");
        console.log("📡 API Response:", response.data);
        
        if (response.data.success) {
          console.log("📚 Stories received:", response.data.data);
          console.log("🔍 First story details:", response.data.data[0]);
          setStories(response.data.data);
        } else {
          setError(t.stories.error);
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError(t.common.error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [t.stories.error, t.common.error]);

  // Filter stories to only show those available in current language
  const filteredStories = stories.filter(story => {
    // If story has availableLanguages array, check if it includes current language
    if (story.availableLanguages && story.availableLanguages.length > 0) {
      return story.availableLanguages.includes(language);
    }
    // If no availableLanguages field (old stories), show them to all users
    return true;
  });

  // Language display names
  const languageNames = {
    fr: 'Français 🇫🇷',
    tn: 'تونسي 🇹🇳'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-sky-100 flex items-center justify-center p-4">
        <div className="text-xl sm:text-2xl text-sky-700 text-center">
          {t.common.loading} 📖
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-sky-100 flex items-center justify-center p-4">
        <div className="text-lg sm:text-xl text-red-600 text-center max-w-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-sky-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="w-full max-w-6xl text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sky-700 mb-4 sm:mb-6">
          {t.stories.title}
        </h1>
        
        {/* Language info */}
        <div className="text-base sm:text-lg lg:text-xl text-sky-600 mb-2">
          {language === 'fr' ? 'Affichage des histoires disponibles en :' : 'عرض الحكايات المتوفرة بال:'}{' '}
          <strong>{languageNames[language]}</strong>
        </div>
        <div className="text-sm text-gray-500">
          ({filteredStories.length} {language === 'fr' ? 'sur' : 'من'} {stories.length}{' '}
          {language === 'fr' ? 'histoires' : 'حكاية'})
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center max-w-md mx-auto py-8">
          <div>
            <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4">
              {language === 'fr' 
                ? `Aucune histoire disponible en ${languageNames[language]}`
                : `ماكاش حكايات متوفرة بال${languageNames[language]}`
              }
            </p>
            <p className="text-gray-500 text-sm sm:text-base">
              {language === 'fr' 
                ? 'Essayez de changer de langue ou revenez plus tard !'
                : 'جرب تبدّل اللغة أو عاود تّعاود بعد!'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredStories.map((story, index) => (
              <div
                key={story._id || index}
                onClick={() => navigate(`/story/${story._id}`)}
                className="bg-white shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
              >
                {/* Story Image */}
                <div className="mb-3 sm:mb-4">
                  <img 
                    src={story.image} 
                    alt={story.title?.[language] || story.title?.fr || story.title} 
                    className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg sm:rounded-xl" 
                  />
                </div>
                
                {/* Story Title */}
                <h2 className="text-lg sm:text-xl lg:text-2xl text-center text-sky-800 font-semibold mb-2 sm:mb-3 line-clamp-2">
                  {story.title?.[language] || story.title?.fr || story.title}
                </h2>
                
                {/* Available Languages */}
                <div className="flex justify-center space-x-2">
                  {story.availableLanguages?.includes('fr') && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">🇫🇷</span>
                  )}
                  {story.availableLanguages?.includes('tn') && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">🇹🇳</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}