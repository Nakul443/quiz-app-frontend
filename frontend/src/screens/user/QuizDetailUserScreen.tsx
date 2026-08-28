// This file defines the QuizDetailUserScreen component, which displays the details of a specific quiz to the user.
// It fetches the quiz data using the useQuizDetail hook and presents the quiz title, description, time limit, and total number of questions.
// The component also provides a button to start the quiz attempt, which triggers the useStartAttempt mutation and navigates to the AttemptQuestionScreen upon success.

import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserQuizStackParamList } from '../../types/navigation.types';
import { useQuizDetail } from '../../hooks/queries/useQuizDetail';
import { useStartAttempt } from '../../hooks/mutations/useStartAttempt';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

type Props = NativeStackScreenProps<UserQuizStackParamList, 'QuizDetailUser'>;

export const QuizDetailUserScreen: React.FC<Props> = ({ route, navigation }) => {
  const { quizId } = route.params;

  const { data: quiz, isLoading, error, refetch } = useQuizDetail(quizId);
  const startAttemptMutation = useStartAttempt();

  const handleStartQuiz = () => {
    Alert.alert(
      'Start Assessment',
      `Are you ready to start this quiz? You will have ${quiz?.time_limit} minutes to finish it.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            startAttemptMutation.mutate(quizId, {
              onSuccess: (response) => {
                if (response.success && response.data?.id) {
                  navigation.replace('AttemptQuestion', { attemptId: response.data.id });
                }
              },
            });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !quiz) {
    return <ErrorMessage message={error?.message || 'Quiz not found'} onRetry={() => { refetch(); }} />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <Card className="mb-6 bg-white">
        <Text className="text-2xl font-extrabold text-text mb-2">
          {quiz.title}
        </Text>
        
        <Text className="text-sm text-text-secondary leading-5 mb-6">
          {quiz.description}
        </Text>

        {/* Detailed Assessment Parameters */}
        <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4 mb-6">
          <View className="flex-row items-center border-b border-gray-100 pb-3 justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">⏱️</Text>
              <Text className="text-sm font-medium text-text-secondary">Time Allowed</Text>
            </View>
            <Text className="text-sm font-bold text-text">{quiz.time_limit} Minutes</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">❓</Text>
              <Text className="text-sm font-medium text-text-secondary">Total Questions</Text>
            </View>
            <Text className="text-sm font-bold text-text">{quiz.questions?.length || 0} Questions</Text>
          </View>
        </View>

        {/* Start Button */}
        <Button
          title="Start Assessment"
          onPress={handleStartQuiz}
          isLoading={startAttemptMutation.isPending}
          disabled={!quiz.questions || quiz.questions.length === 0}
          className="py-4"
          textClassName="text-base font-bold"
        />

        {(!quiz.questions || quiz.questions.length === 0) && (
          <Text className="text-xs text-danger text-center mt-3 font-semibold">
            This quiz is empty and cannot be started.
          </Text>
        )}
      </Card>

      {/* Rules and Instructions */}
      <View className="px-4">
        <Text className="text-sm font-bold text-text mb-2">Important Instructions:</Text>
        <Text className="text-xs text-text-secondary leading-5 mb-2">
          • Once started, the timer cannot be paused.
        </Text>
        <Text className="text-xs text-text-secondary leading-5 mb-2">
          • Do not exit or refresh the application during the test; doing so could submit your current answers.
        </Text>
        <Text className="text-xs text-text-secondary leading-5">
          • Each answer choice is saved in real-time, allowing recovery if the session is interrupted.
        </Text>
      </View>
    </ScrollView>
  );
};

export default QuizDetailUserScreen;
