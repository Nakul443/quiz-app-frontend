// This file defines the AttemptQuestionScreen component, which allows a user to attempt a quiz by answering questions one at a time.
// It fetches the attempt and questions data using the useAttempt and useQuestions hooks, respectively.
// The component manages the user's selected answers locally and persists them to the backend as they are selected.
// It also handles the countdown timer for the quiz, auto-submitting when time runs out, and navigating to the AttemptResultScreen upon completion.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Alert, AppState, AppStateStatus } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserQuizStackParamList } from '../../types/navigation.types';
import { useAttempt } from '../../hooks/queries/useAttempt';
import { useQuestions } from '../../hooks/queries/useQuestions';
import { useSubmitAnswer } from '../../hooks/mutations/useSubmitAnswer';
import { useSubmitAttempt } from '../../hooks/mutations/useSubmitAttempt';
import { QuestionCard } from '../../components/QuestionCard';
import { Timer } from '../../components/Timer';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

type Props = NativeStackScreenProps<UserQuizStackParamList, 'AttemptQuestion'>;

export const AttemptQuestionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { attemptId } = route.params;

  // 1. Fetch Attempt state and Questions List
  const { data: attempt, isLoading: isAttemptLoading, error: attemptError, refetch: refetchAttempt } = useAttempt(attemptId);
  const quizId = attempt?.quiz_id || '';
  const { data: questions, isLoading: isQuestionsLoading, error: questionsError, refetch: refetchQuestions } = useQuestions(quizId);

  // 2. Mutations for submitting answers and completing attempt
  const submitAnswerMutation = useSubmitAnswer();
  const submitAttemptMutation = useSubmitAttempt();

  // 3. Local progression and timer state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const appStateRef = useRef<AppStateStatus>((AppState.currentState || 'active') as AppStateStatus);

  // Sync initial timer state from server
  useEffect(() => {
    if (attempt && attempt.time_remaining !== undefined) {
      setTimeLeft(attempt.time_remaining);
    }
  }, [attempt]);

  // Check if attempt completed on initial load or re-sync
  useEffect(() => {
    if (attempt && (attempt.status === 'submitted' || attempt.status === 'auto_submitted')) {
      navigation.replace('AttemptResult', { attemptId });
    }
  }, [attempt, attemptId, navigation]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Graceful auto-submit when countdown hits zero
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // AppState Listener to handle backgrounding resyncs
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App backgrounded timer safety: Re-fetch attempt details on return to active
        const updatedAttempt = await refetchAttempt();
        if (updatedAttempt.data && (updatedAttempt.data.status === 'submitted' || updatedAttempt.data.status === 'auto_submitted')) {
          navigation.replace('AttemptResult', { attemptId });
        } else if (updatedAttempt.data?.time_remaining !== undefined) {
          setTimeLeft(updatedAttempt.data.time_remaining);
        }
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [attemptId, refetchAttempt, navigation]);

  const handleSelectOption = (optionId: string) => {
    if (!questions) return;
    const currentQuestion = questions[currentIdx];

    // Save locally for instant UI update
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: optionId,
    }));

    // Persist selected option immediately to the database (patch answers)
    submitAnswerMutation.mutate({
      attemptId,
      answer: {
        question_id: currentQuestion._id,
        selected_option_id: optionId,
      },
    });
  };

  const handleFinishAttempt = () => {
    Alert.alert(
      'Submit Quiz',
      'Are you sure you want to finish and submit your answers?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            submitAttemptMutation.mutate(attemptId, {
              onSuccess: () => {
                navigation.replace('AttemptResult', { attemptId });
              },
            });
          },
        },
      ]
    );
  };

  const handleAutoSubmit = () => {
    submitAttemptMutation.mutate(attemptId, {
      onSuccess: () => {
        Alert.alert('Time Up!', 'Your time has expired and your quiz was submitted automatically.', [
          {
            text: 'View Results',
            onPress: () => {
              navigation.replace('AttemptResult', { attemptId });
            },
          },
        ]);
      },
      onError: () => {
        // Fallback: navigate anyways as the lazy-check finalized it server-side
        navigation.replace('AttemptResult', { attemptId });
      },
    });
  };

  const isFirstQuestion = currentIdx === 0;
  const isLastQuestion = questions ? currentIdx === questions.length - 1 : true;

  if (isAttemptLoading || isQuestionsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (attemptError || questionsError || !questions || !attempt) {
    return (
      <ErrorMessage
        message={attemptError?.message || questionsError?.message || 'Failed to load details'}
        onRetry={() => {
          refetchAttempt();
          refetchQuestions();
        }}
      />
    );
  }

  const currentQuestion = questions[currentIdx];
  
  const currentSelectedOptionId = selectedAnswers[currentQuestion._id] || null;

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Header bar with question progress and Timer */}
      <View className="flex-row justify-between items-center mb-5 mt-2">
        <View>
          <Text className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-0.5">
            Progress
          </Text>
          <Text className="text-base font-bold text-text">
            Question {currentIdx + 1} of {questions.length}
          </Text>
        </View>
        <Timer seconds={timeLeft} />
      </View>

      {/* Question Detail View */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <QuestionCard
          question={currentQuestion}
          selectedOptionId={currentSelectedOptionId} // Controlled locally, selecting an option invokes mutation
          onSelectOption={handleSelectOption}
        />
        
        {submitAnswerMutation.isPending && (
          <Text className="text-xs text-primary font-semibold text-center -mt-2 mb-4 animate-pulse">
            Saving answer...
          </Text>
        )}
      </ScrollView>

      {/* Navigation Buttons Container */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex-row justify-between items-center space-x-3">
        <Button
          title="← Previous"
          onPress={() => setCurrentIdx((p) => p - 1)}
          disabled={isFirstQuestion}
          variant="secondary"
          className="flex-1 py-3"
          textClassName="text-sm font-semibold"
        />

        {isLastQuestion ? (
          <Button
            title="Submit Quiz ✓"
            onPress={handleFinishAttempt}
            isLoading={submitAttemptMutation.isPending}
            className="flex-1 py-3 bg-success"
            textClassName="text-sm font-semibold text-white"
          />
        ) : (
          <Button
            title="Next →"
            onPress={() => setCurrentIdx((p) => p + 1)}
            variant="primary"
            className="flex-1 py-3"
            textClassName="text-sm font-semibold"
          />
        )}
      </View>
    </View>
  );
};

export default AttemptQuestionScreen;
