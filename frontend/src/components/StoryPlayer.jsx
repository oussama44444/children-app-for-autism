import { useParams } from "react-router-dom";
import { useRef, useState, useEffect, useMemo } from "react";
import axios from "axios";
import QuestionBox from "./QuestionBox";
import BlueCharacter from "./FacialExpression";
import { useLanguage } from "../context/LanguageContext";

// Hardcoded feedback audio URLs for each language
const FEEDBACK_AUDIO = {
  fr: {
    correct: "https://res.cloudinary.com/dtf3pgsd0/video/upload/v1761869161/audio_succ%C3%A9e_i7dtvv.mp3",
    wrong: "https://res.cloudinary.com/dtf3pgsd0/video/upload/v1761869168/audio_autre_essai_uzag2d.mp3"
  },
  tn: {
    correct: "https://res.cloudinary.com/dtf3pgsd0/video/upload/v1738092922/success_tn_ocwnqe.mp3", // Add your Tunisian URLs
    wrong: "https://res.cloudinary.com/dtf3pgsd0/video/upload/v1738092922/try_again_tn_qkzqbj.mp3"
  }
};

export default function StoryPlayer() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stageIndex, setStageIndex] = useState(0);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [faceVisible, setFaceVisible] = useState(true);
  const [isStoryComplete, setIsStoryComplete] = useState(false);

  const audioRef = useRef(null);
  const feedbackAudioRef = useRef(null);
  const [pendingNext, setPendingNext] = useState(false);
  const [fadeOutQuestion, setFadeOutQuestion] = useState(false);
  const [canRetry, setCanRetry] = useState(false);

  // Fetch single story from backend
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/stories/${id}`);
        if (response.data.success) {
          console.log("📖 Story loaded:", response.data.data);
          setStory(response.data.data);
        } else {
          setError("Story not found");
        }
      } catch (err) {
        console.error("Error fetching story:", err);
        setError("Could not load story");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id]);

  const stage = story?.stages?.[stageIndex] || null;
  const currentSegment = stage?.segments?.[segmentIndex] || null;

  // Get the correct audio URL for current language
  const getAudioUrl = () => {
    if (!currentSegment?.audio) return null;
    
    if (typeof currentSegment.audio === 'string') {
      return currentSegment.audio;
    } else if (currentSegment.audio && typeof currentSegment.audio === 'object') {
      return currentSegment.audio[language] || currentSegment.audio.fr || null;
    }
    return null;
  };

  // Get the correct question for current language
  const getQuestion = () => {
    if (!currentSegment?.question) return null;
    
    const question = currentSegment.question;
    
    if (question.question && typeof question.question === 'object') {
      return {
        ...question,
        question: question.question[language] || question.question.fr || "Question",
        answers: question.answers.map(answer => ({
          ...answer,
          text: answer.text[language] || answer.text.fr || answer.text || "Answer"
        })),
        hint: question.hint && typeof question.hint === 'object' 
          ? question.hint[language] || question.hint.fr || question.hint
          : question.hint
      };
    }
    
    return question;
  };

  const isLastSegment = useMemo(() => {
    if (!story?.stages) return false;
    return (
      stageIndex === story.stages.length - 1 &&
      segmentIndex === stage.segments.length - 1
    );
  }, [stageIndex, segmentIndex, story, stage]);

  // Play audio when segment changes
  useEffect(() => {
    const audioUrl = getAudioUrl();
    if (!audioUrl) {
      console.error("❌ No audio URL found for segment:", currentSegment);
      return;
    }

    let isCurrentSegment = true;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    console.log("🎵 Playing audio:", audioUrl);

    const playAudio = async () => {
      if (!isCurrentSegment) return;

      try {
        setShowQuestion(false);
        setFadeOutQuestion(false);
        setFaceVisible(true);
        setIsTalking(true);
        await audio.play();
        console.log("✅ Audio started playing");
      } catch (err) {
        console.error("❌ Audio play error:", err, "Path:", audioUrl);
        setIsTalking(false);
        setShowQuestion(true);
      }
    };

    audio.onended = () => {
      if (!isCurrentSegment) return;

      console.log("✅ Audio ended");
      setIsTalking(false);
      if (isLastSegment && !currentSegment.question) {
        setIsStoryComplete(true);
      } else {
        setFaceVisible(false);
        setTimeout(() => {
          setShowQuestion(true);
          setFadeOutQuestion(false);
        }, 500);
      }
    };

    audio.onerror = (err) => {
      console.error("❌ Audio error:", err);
      setIsTalking(false);
      setShowQuestion(true);
    };

    audio.load();
    setTimeout(playAudio, 100);

    return () => {
      isCurrentSegment = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      audio.remove();
    };
  }, [segmentIndex, stageIndex, currentSegment, isLastSegment, language]);

  // Play feedback audio and handle answer
  const handleQuestionAnswer = (isCorrect) => {
    console.log(`🎯 Answer: ${isCorrect ? 'CORRECT' : 'WRONG'}, Language: ${language}`);
    
    // Stop main audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setPendingNext(true);
    
    // Get feedback audio URL based on language and correctness
    const feedbackAudioUrl = isCorrect 
      ? FEEDBACK_AUDIO[language]?.correct 
      : FEEDBACK_AUDIO[language]?.wrong;

    console.log("🔊 Playing feedback audio:", feedbackAudioUrl);

    if (!feedbackAudioUrl) {
      console.warn("❌ No feedback audio URL found");
      handleAfterFeedback(isCorrect);
      return;
    }

    let isCurrent = true;
    const feedbackAudio = new Audio(feedbackAudioUrl);
    feedbackAudioRef.current = feedbackAudio;

    const playFeedback = async () => {
      if (!isCurrent) return;
      
      try {
        await feedbackAudio.play();
        console.log("✅ Feedback audio started playing");
      } catch (err) {
        console.error("❌ Feedback audio play error:", err);
        handleAfterFeedback(isCorrect);
      }
    };

    feedbackAudio.onended = () => {
      if (!isCurrent) return;
      console.log("✅ Feedback audio ended");
      handleAfterFeedback(isCorrect);
    };

    feedbackAudio.onerror = (err) => {
      if (!isCurrent) return;
      console.error("❌ Feedback audio error:", err);
      handleAfterFeedback(isCorrect);
    };

    feedbackAudio.load();
    setTimeout(playFeedback, 100);

    // Cleanup
    return () => {
      isCurrent = false;
      if (feedbackAudio) {
        feedbackAudio.pause();
        feedbackAudio.src = "";
      }
    };
  };

  // Handle what happens after feedback audio plays
  const handleAfterFeedback = (isCorrect) => {
    setPendingNext(false);
    
    if (isCorrect) {
      // Correct answer - proceed to next segment
      setFadeOutQuestion(true);
      
      setTimeout(() => {
        setShowQuestion(false);
        setFadeOutQuestion(false);
        setCanRetry(false);
        
        if (isLastSegment) {
          // Story complete
          setIsStoryComplete(true);
          setFaceVisible(true);
          setIsTalking(false);
        } else if (segmentIndex < stage.segments.length - 1) {
          // Next segment in same stage
          setSegmentIndex((prev) => prev + 1);
          setFaceVisible(true);
        } else if (stageIndex < story.stages.length - 1) {
          // Next stage
          setStageIndex((prev) => prev + 1);
          setSegmentIndex(0);
          setFaceVisible(true);
        }
      }, 500);
    } else {
      // Wrong answer - allow retry
      setCanRetry(true);
    }
  };

  // Debug current segment
  useEffect(() => {
    if (currentSegment) {
      console.log("🔍 Current segment:", {
        audio: currentSegment.audio,
        audioUrl: getAudioUrl(),
        question: getQuestion(),
        language: language
      });
    }
  }, [currentSegment, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-2xl text-sky-700">Loading story... 🎭</div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error || "Story not found"}</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-6 text-center">
      <BlueCharacter
        showOptions={!isStoryComplete && showQuestion}
        isTalking={isTalking}
        isVisible={faceVisible || isStoryComplete}
      />

      {showQuestion && !isStoryComplete && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-[60] transition-opacity duration-500 ${
            fadeOutQuestion ? "opacity-0" : "opacity-100"
          }`}
        >
          <QuestionBox
            question={getQuestion()}
            onNext={handleQuestionAnswer}
            disabled={pendingNext}
            canRetry={canRetry}
          />
        </div>
      )}
    </div>
  );
}