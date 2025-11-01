import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, switchLanguage } = useLanguage();

  console.log('🔧 LanguageSwitcher - current language:', language);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-full shadow-lg p-1 flex">
        <button
          onClick={() => {
            console.log('🔄 Switching to French (fr)');
            switchLanguage('fr');
          }}
          className={`px-4 py-2 rounded-full transition-all ${
            language === 'fr' 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          FR
        </button>
        <button
          onClick={() => {
            console.log('🔄 Switching to Tunisian (tn)');
            switchLanguage('tn');
          }}
          className={`px-4 py-2 rounded-full transition-all ${
            language === 'tn' 
              ? 'bg-red-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          TN
        </button>
      </div>
      {/* Debug display */}
      <div className="text-xs text-center mt-1 bg-gray-100 px-2 py-1 rounded">
        Current: {language}
      </div>
    </div>
  );
}