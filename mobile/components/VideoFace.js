import React, { useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const VideoFace = ({ fadeAnim }) => {
  const videoRef = useRef(null);

  return (
    <Animated.View style={[styles.videoContainer, { opacity: fadeAnim }]}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={require('../assets/images/vids/vecteezy_cartoon-face-with-eyes-nose-mouth-talking-loop-animation_44180722.mp4')}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted={false}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default VideoFace;
