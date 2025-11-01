import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { frenchTranslations, tunisianTranslations } from "../locales";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  // FIX: Use 'fr' and 'tn' instead of 'french' and 'tunisian'
  const t = language === 'fr' ? frenchTranslations : tunisianTranslations;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-200 to-purple-200">
      <motion.h1
        className="text-5xl font-bold text-sky-800 mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {t.welcome.title}
      </motion.h1>
      <motion.button
        onClick={() => navigate("/stories")}
        className="px-8 py-4 bg-sky-600 text-white text-xl rounded-2xl shadow-lg hover:bg-sky-700"
        whileHover={{ scale: 1.05 }}
      >
        {t.welcome.startButton}
      </motion.button>
    </div>
  );
}