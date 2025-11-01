import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { frenchTranslations, tunisianTranslations } from "../locales";

export default function QuestionBox({ question, onNext, disabled = false, canRetry = false }) {
  if (!question?.question || !question?.answers) {
    console.error('Invalid question object:', question);
    return null;
  }

  const [feedback, setFeedback] = useState("");
  const [disabledAnswers, setDisabledAnswers] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const { language } = useLanguage();
  
  const t = language === 'fr' ? frenchTranslations : tunisianTranslations;

  const colors = [
    "bg-blue-500",
    "bg-red-600",
    "bg-green-500",
    "bg-yellow-500"
  ];

  const handleAnswer = (ans, i) => {
    console.log('Answer clicked:', ans, 'index:', i);
    
    if (ans.correct) {
      setFeedback(t.questions.correct);
      setDisabledAnswers(question.answers.map((_, index) => index));
      setShowHint(false); // Hide hint when answer is correct
      setTimeout(() => {
        onNext?.(true);
      }, 1500);
    } else {
      console.log('Wrong answer, disabling index:', i);
      setFeedback(`${t.questions.incorrect}`);
      setDisabledAnswers(prev => [...prev, i]);
      setShowHint(true); // Show hint only when answer is wrong
      setTimeout(() => {
        onNext?.(false);
      }, 1500);
    }
  };

  const handleRetry = () => {
    setFeedback("");
    setDisabledAnswers([]);
    setShowHint(false); // Hide hint when retrying
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 z-20 relative">
      {/* Question */}
      <h2 className="bg-purple-200 text-purple-800 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-center w-full text-lg sm:text-xl lg:text-2xl">
        {question.question}
      </h2>

      {/* Answers */}
      <div className="w-full space-y-3 sm:space-y-4">
        {question.answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => {
              console.log('Button clicked, disabled state:', disabledAnswers.includes(i));
              if (!disabledAnswers.includes(i) && !disabled) {
                handleAnswer(ans, i);
              }
            }}
            disabled={disabledAnswers.includes(i) || disabled}
            className={`relative w-full flex group transition-all duration-200 ${
              disabledAnswers.includes(i) || disabled 
                ? 'cursor-not-allowed opacity-60' 
                : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {/* Letter indicator - responsive sizing */}
            <div
              className={`flex-shrink-0 ${colors[i]} text-white font-bold w-10 sm:w-12 lg:w-16 h-12 sm:h-14 lg:h-16 flex items-center justify-center rounded-l-lg text-base sm:text-lg lg:text-xl`}
            >
              {String.fromCharCode(65 + i)}
            </div>
            
            {/* Answer text - responsive sizing */}
            <div
              className={`${colors[i]} text-white font-bold flex-1 px-3 sm:px-4 lg:px-6 rounded-r-lg relative min-h-[3rem] sm:min-h-[3.5rem] lg:min-h-[4rem] flex items-center`}
            >
              <p className="text-sm sm:text-base lg:text-lg pr-2 sm:pr-4 text-left w-full">
                {ans.text}
              </p>
              
              {/* Arrow shape */}
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 
                border-t-[0.75rem] border-b-[0.75rem] border-l-[0.75rem] 
                sm:border-t-[1rem] sm:border-b-[1rem] sm:border-l-[1rem]
                lg:border-t-[1.25rem] lg:border-b-[1.25rem] lg:border-l-[1.25rem]
                border-t-transparent border-b-transparent ${colors[i]}`}
              ></div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Feedback message */}
      <p className="mt-2 sm:mt-4 text-center text-sm sm:text-base lg:text-lg px-4 min-h-[1.5rem]">
        {feedback}
      </p>

      {/* Hint (only show after wrong answer) */}
      {showHint && question.hint && (
        <div className="text-xs sm:text-sm text-gray-600 text-center italic px-4 bg-yellow-50 py-2 rounded-lg border border-yellow-200">
          💡 {question.hint}
        </div>
      )}

      {/* Retry button */}
      {canRetry && (
        <button
          onClick={handleRetry}
          className="w-full max-w-xs bg-blue-500 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-600 font-semibold text-sm sm:text-base lg:text-lg transition-colors duration-200"
        >
          {language === 'fr' ? 'Réessayer' : 'جرب مرّة أخرى'}
        </button>
      )}

      {/* Loading state */}
      {disabled && (
        <div className="text-center text-gray-500 text-sm sm:text-base">
          {language === 'fr' ? 'Chargement...' : 'يتحمّل...'}
        </div>
      )}
    </div>
  );
}