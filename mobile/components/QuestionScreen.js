import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  ScrollView,
  Modal,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { fr } from '../locales/fr';
import { tn } from '../locales/tn';

const QuestionScreen = ({
  fadeAnim,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  isAnswerCorrect,
  showHint,
  onAnswerSelect,
  onShowHint,
  onCloseHint,
  onReplayAudio,
}) => {
  const { language } = useLanguage();
  const t = language === 'fr' ? fr : tn;

  return (
    <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
      <ScrollView 
        contentContainerStyle={styles.questionContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <View style={styles.questionBox}>
          <Text style={styles.questionNumber}>
            {t.question.questionOf
              .replace('{current}', currentQuestionIndex + 1)
              .replace('{total}', totalQuestions)}
          </Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const optionLabel = t.question.optionLabels[index];
            const isRTL = language === 'tn';
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && isAnswerCorrect && styles.correctOption,
                  selectedAnswer === index && !isAnswerCorrect && styles.wrongOption,
                ]}
                onPress={() => onAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <View style={[styles.optionContent, isRTL && styles.optionContentRTL]}>
                  <View style={styles.optionLabel}>
                    <Text style={styles.optionLabelText}>{optionLabel}</Text>
                  </View>
                  <Text style={[styles.optionText, isRTL && styles.optionTextRTL]}>{option}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback */}
        {isAnswerCorrect !== null && (
          <View style={[
            styles.feedbackBox,
            isAnswerCorrect ? styles.correctFeedback : styles.wrongFeedback
          ]}>
            <Text style={styles.feedbackText}>
              {isAnswerCorrect ? '✓ Correct! Great job!' : '✗ Try again!'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={onShowHint}>
          <Text style={styles.actionButtonText}>💡 {t.question.hint}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onReplayAudio}>
          <Text style={styles.actionButtonText}>🔊 {t.question.replay}</Text>
        </TouchableOpacity>
      </View>

      {/* Hint Modal */}
      <Modal
        visible={showHint}
        transparent={true}
        animationType="fade"
        onRequestClose={onCloseHint}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.hintModal}>
            <TouchableOpacity style={styles.hintCloseButton} onPress={onCloseHint}>
              <Text style={styles.hintCloseButtonText}>✕</Text>
            </TouchableOpacity>
            
            <View style={styles.hintHeader}>
              <Text style={styles.hintIcon}>💡</Text>
              <Text style={styles.hintModalTitle}>{t.question.hint}</Text>
            </View>
            
            <Text style={styles.hintModalText}>{currentQuestion.hint}</Text>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    paddingTop: 8,
    justifyContent: 'space-between',
  },
  questionContent: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  questionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 4,
    borderColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  questionNumber: {
    fontSize: 13,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f4952',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 8,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 4,
    borderColor: '#87CEEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  correctOption: {
    backgroundColor: '#C8F7C5',
    borderColor: '#4CAF50',
    borderWidth: 6,
  },
  wrongOption: {
    backgroundColor: '#FFCCCB',
    borderColor: '#F44336',
    borderWidth: 6,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionContentRTL: {
    flexDirection: 'row-reverse',
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2f4952',
    textAlign: 'left',
  },
  optionTextRTL: {
    textAlign: 'right',
  },
  feedbackBox: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 3,
  },
  correctFeedback: {
    backgroundColor: '#C8F7C5',
    borderColor: '#4CAF50',
  },
  wrongFeedback: {
    backgroundColor: '#FFCCCB',
    borderColor: '#F44336',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2f4952',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF9F0',
    gap: 10,
    borderTopWidth: 3,
    borderTopColor: '#FFB6C1',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FF6B9D',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 3,
    borderColor: '#FF1493',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  hintModal: {
    backgroundColor: '#FFF9F0',
    borderRadius: 28,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    borderWidth: 5,
    borderColor: '#FFD54F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  hintCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  hintCloseButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  hintHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  hintIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  hintModalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F57C00',
    textAlign: 'center',
  },
  hintModalText: {
    fontSize: 20,
    color: '#2f4952',
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default QuestionScreen;
