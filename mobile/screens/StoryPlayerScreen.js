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
import { useStories } from '../contexts/StoriesContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Audio } from 'expo-av';
import VideoFace from '../components/VideoFace';
import QuestionScreen from '../components/QuestionScreen';
import CongratulationsScreen from '../components/CongratulationsScreen';


const StoryPlayerScreen = ({ route }) => {
  const navigation = useNavigation();
  const { stories, getStoryById, completeStory } = useStories();
  const { language } = useLanguage();
  const { story: routeStory, storyId } = route.params || {};
  // local resolved story state (may be loaded from context or fetched)
  const [resolvedStory, setResolvedStory] = useState(routeStory || null);
  const [segments, setSegments] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      console.log('StoryPlayer load effect: routeStory?', !!routeStory, 'storyId:', storyId);
      if (routeStory) {
        setResolvedStory(routeStory);
        console.log('StoryPlayer using routeStory:', routeStory?.id || routeStory?._id || '(no id)');
        return;
      }
      const id = storyId;
      if (!id) return;
      // try to get from context (will fetch from backend if missing)
      try {
        const s = await getStoryById(id);
        console.log('getStoryById returned:', s);
        if (mounted && s) {
          setResolvedStory(s);
          console.log('resolvedStory set in player:', s.id || s._id);
        }
      } catch (e) {
        console.warn('Failed to load story by id in player', e);
      }
    };
    load();
    return () => { mounted = false; };
  }, [routeStory, storyId]);
    // When resolvedStory loads, extract segments (stages[0].segments)
    useEffect(() => {
      if (resolvedStory && resolvedStory.details && Array.isArray(resolvedStory.details.stages)) {
        const s = resolvedStory.details.stages[0]?.segments || [];
        console.log('StoryPlayer extracted segments count:', s.length);
        setSegments(s);
        // reset indices/state for new story
        setCurrentQuestionIndex(0);
        setCurrentPhase('video');
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
      }
    }, [resolvedStory]);
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
      if (!segments || segments.length === 0) {
        console.log('StoryPlayer: segments not ready, delaying playAudio');
      } else {
        playAudio();
      }
    }

    return () => {
      // Cleanup audio on unmount
      (async () => {
        try {
          if (soundRef.current) {
            await soundRef.current.unloadAsync();
            soundRef.current = null;
          }
        } catch (e) {
          console.warn('Error unloading sound on cleanup', e);
        }
      })();
    };
  }, [currentPhase, currentQuestionIndex, segments]);

  // When the player reaches the congratulations phase, mark story completed and award points
  useEffect(() => {
    if (currentPhase === 'congratulations') {
      (async () => {
        try {
          const sid = resolvedStory?.id || resolvedStory?._id;
          if (!sid) return;
          // prevent duplicate completion when story already marked completed locally
          if (resolvedStory && resolvedStory.completed) {
            console.log('StoryPlayerScreen: story already completed locally, skipping completeStory call', sid);
            return;
          }
          if (sid && completeStory) {
            console.log('StoryPlayerScreen: completing story', sid);
            const result = await completeStory(sid);
            console.log('Story completion result:', result);
          }
        } catch (e) {
          console.warn('Error while completing story:', e);
        }
      })();
    }
  }, [currentPhase, resolvedStory]);

  const playAudio = async () => {
    try {
      // Ensure audio plays even if device is in silent mode on iOS
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });

      // Unload previous sound if any
      if (soundRef.current) {
        try {
          await soundRef.current.unloadAsync();
        } catch (e) {
          console.warn('Previous sound unload failed', e);
        }
        soundRef.current = null;
      }

      // Select audio source from story details by language: stages -> segments -> audio
      let source = null;
      try {
        const segment = segments?.[currentQuestionIndex] || null;
        console.log('Selecting audio for segment index:', currentQuestionIndex, 'segment:', segment ? 'present' : 'missing');
        const audioUrl = segment?.audio?.[language] || segment?.audio?.fr || segment?.audio?.tn || null;
        if (audioUrl) {
          source = { uri: audioUrl };
        }
      } catch (e) {
        console.warn('Error resolving story audio from details', e);
      }

      // fallback: use a bundled sample if available in assets/audios
      if (!source) {
        try {
          source = require('../assets/audios/sample.mp3');
          } catch (e) {
            console.warn('No bundled sample audio found', e);
            console.warn('No audio available for this segment — advancing to question');
            // advance to question immediately when no audio is available
            fadeOutVideo();
            return;
          }
        }

      const sound = new Audio.Sound();
      soundRef.current = sound;

      console.log('Loading audio source for playback', source);
      await sound.loadAsync(source, { shouldPlay: true, isLooping: false });
      try {
        await sound.setStatusAsync({ volume: 1.0 });
      } catch (e) {
        // some platforms may not support setStatusAsync immediately
      }
      console.log('Audio playback started');

      // Detect when playback finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status) return;
        if (status.didJustFinish) {
          try {
            fadeOutVideo();
          } catch (e) {
            console.warn('fadeOutVideo error after audio finish', e);
          }
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      // On any audio error advance to question to avoid blocking the story
      try {
        fadeOutVideo();
      } catch (e) {
        console.warn('Error advancing after audio failure', e);
        setCurrentPhase('question');
      }
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
    // Replay current segment audio
    console.log('Replay audio for segment', currentQuestionIndex);
    // restart playback for the current segment
    playAudio();
  };

  const handleShowHint = () => {
    const hint = currentQuestion?.hint;
    console.log('handleShowHint called, hint present?', !!hint);
    if (!hint) {
      console.warn('No hint available for this question');
      return;
    }
    setShowHint(true);
  };

  const handleCloseHint = () => {
    setShowHint(false);
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    // derive correct index from current segment answers
    const segment = segments?.[currentQuestionIndex] || null;
    const answers = segment?.question?.answers || [];
    const correctIndex = answers.findIndex(a => !!a.correct);
    const isCorrect = index === correctIndex;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      // Wait 1.5 seconds then move to next segment/question or finish
      setTimeout(() => {
        if (currentQuestionIndex < (segments.length - 1)) {
          // first fade the question out, then update the question index and switch back to video
          Animated.timing(questionFadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }).start(() => {
            // advance to next question index only after fade completes
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentPhase('video');
            Animated.timing(videoFadeAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }).start();
          });
        } else {
          // Story completed - show congratulations
          setCurrentPhase('congratulations');
        }
        // reset selection for next question
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
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

  const currentSegment = segments?.[currentQuestionIndex] || null;
  const currentQuestion = currentSegment
    ? {
        question: currentSegment.question?.question?.[language] || currentSegment.question?.question?.fr || currentSegment.question?.question?.tn || '',
        options: (currentSegment.question?.answers || []).map(a => a.text?.[language] || a.text?.fr || a.text?.tn || ''),
        hint: currentSegment.question?.hint?.[language] || currentSegment.question?.hint?.fr || currentSegment.question?.hint?.tn || '',
      }
    : { question: '', options: [], hint: '' };

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
          totalQuestions={segments.length}
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
        <CongratulationsScreen onBackToHome={handleBackToHome} points={resolvedStory?.points || 30} />
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
