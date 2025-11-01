import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    if (savedLanguage) {
      // Convert old language values to new format
      if (savedLanguage === 'french') {
        console.log('🔄 Converting old language: french → fr');
        setLanguage('fr');
        localStorage.setItem('preferredLanguage', 'fr');
      } else if (savedLanguage === 'tunisian') {
        console.log('🔄 Converting old language: tunisian → tn');
        setLanguage('tn');
        localStorage.setItem('preferredLanguage', 'tn');
      } else {
        setLanguage(savedLanguage);
      }
    } else {
      // Default to French if no language is set
      setLanguage('fr');
      localStorage.setItem('preferredLanguage', 'fr');
    }
  }, []);

  const switchLanguage = (lang) => {
    console.log(`🔄 Switching language to: ${lang}`);
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const value = {
    language,
    switchLanguage,
    isFrench: language === 'fr',
    isTunisian: language === 'tn'
  };

  console.log('🔧 LanguageContext initialized with:', { language });

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};