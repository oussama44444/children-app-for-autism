import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import VideoFace from '../components/VideoFace';
import QuestionScreen from '../components/QuestionScreen';
import CongratulationsScreen from '../components/CongratulationsScreen';

// Mock audio data - replace with real audio files later
const mockAudioData = [
  {
    id: 1,
    text: "Once upon a time, there was a beautiful blue bird...",
    duration: 5000, // milliseconds - temporary until we have real audio
  },
  {
    id: 2,
    text: "The bird flew through the deep forest...",
    duration: 5000,
  },
  {
    id: 3,
    text: "A wise owl helped the bird find its way home...",
    duration: 5000,
  },
];

// Mock questions data - replace with real data later
const mockQuestions = [
  {
    id: 1,
    question: "What color was the bird in the story?",
    options: ["Red", "Blue", "Yellow"],
    correctAnswer: 1,
    hint: "Think about the color of the sky!"
  },
  {
    id: 2,
    question: "Where did the adventure take place?",
    options: ["In the forest", "In the city", "At the beach"],
    correctAnswer: 0,
    hint: "It was a place with lots of trees!"
  },
  {
    id: 3,
    question: "Who helped the main character?",
    options: ["A friendly dog", "A wise owl", "A brave cat"],
    correctAnswer: 1,
    hint: "This animal can fly and is very smart!"
  },
];

const StoryPlayerScreen = ({ route }) => {
  const navigation = useNavigation();
  const { story } = route.params || {};
  const soundRef = useRef(null);
  
  const [currentPhase, setCurrentPhase] = useState('video'); // 'video', 'question', or 'congratulations'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  
  const videoFadeAnim = useRef(new Animated.Value(1)).current;
  const questionFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Play audio when video phase starts
    if (currentPhase === 'video') {
      playAudio();
    }
    
    return () => {
      // Cleanup audio on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [currentPhase, currentQuestionIndex]);

  const playAudio = async () => {
    try {
      // For now, use timer to simulate audio duration
      // TODO: Replace with actual audio file playback
      const audioDuration = mockAudioData[currentQuestionIndex].duration;
      
      const timer = setTimeout(() => {
        fadeOutVideo();
      }, audioDuration);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error playing audio:', error);
      // Fallback to timer
      setTimeout(() => {
        fadeOutVideo();
      }, 5000);
    }
  };

  const fadeOutVideo = () => {
    Animated.parallel([
      Animated.timing(videoFadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start(() => {
      setCurrentPhase('question');
      Animated.timing(questionFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    });
  };

  const fadeInVideo = () => {
    Animated.timing(questionFadeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      setCurrentPhase('video');
      setShowHint(false);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      Animated.timing(videoFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleReplayAudio = () => {
    // TODO: Replay the question audio
    console.log('Replay audio');
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  const handleCloseHint = () => {
    setShowHint(false);
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    const currentQuestion = mockQuestions[currentQuestionIndex];
    const isCorrect = index === currentQuestion.correctAnswer;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      // Wait 1.5 seconds then move to next question or finish
      setTimeout(() => {
        if (currentQuestionIndex < mockQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          fadeInVideo();
        } else {
          // Story completed - show congratulations
          setCurrentPhase('congratulations');
        }
      }, 1500);
    } else {
      // Wait 2 seconds then reset to allow retry
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
      }, 2000);
    }
  };

  const handleBackToHome = () => {
    navigation.navigate('Main', { screen: 'HomeTab' });
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Close Button - only show on video and question phases */}
      {currentPhase !== 'congratulations' && (
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}

      {/* Video Face */}
      {currentPhase === 'video' && (
        <VideoFace fadeAnim={videoFadeAnim} />
      )}

      {/* Question Screen */}
      {currentPhase === 'question' && (
        <QuestionScreen
          fadeAnim={questionFadeAnim}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={mockQuestions.length}
          selectedAnswer={selectedAnswer}
          isAnswerCorrect={isAnswerCorrect}
          showHint={showHint}
          onAnswerSelect={handleAnswerSelect}
          onShowHint={handleShowHint}
          onCloseHint={handleCloseHint}
          onReplayAudio={handleReplayAudio}
        />
      )}

      {/* Congratulations Screen */}
      {currentPhase === 'congratulations' && (
        <CongratulationsScreen onBackToHome={handleBackToHome} points={story?.points || 30} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default StoryPlayerScreen;
