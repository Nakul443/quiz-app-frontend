// This file defines the AttemptResultScreen component, which displays the results of a user's quiz attempt.
// It fetches the attempt result data using the useAttemptResult hook and presents a summary of the user's performance,
// including score, correct answers, and detailed feedback for each question.

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAttemptResult } from '../../hooks/queries/useAttemptResult';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { QuestionCard } from '../../components/QuestionCard';

type Props = {
  route: {
    params: {
      attemptId: string;
    };
  };
  navigation: any;
};

export const AttemptResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { attemptId } = route.params;

  const { data: result, isLoading, error, refetch } = useAttemptResult(attemptId);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !result) {
    return (
      <ErrorMessage
        message={error?.message || 'Failed to retrieve assessment results.'}
        onRetry={() => { refetch(); }}
      />
    );
  }

  const { attempt, answers, total_questions, correct_answers_count, score } = result;

  // Find the selected option id for a specific question from the answered array
  const getSelectedOptionId = (questionId: string): string | null => {
    const answer = answers.find((ans) => ans.question_id === questionId);
    return answer ? answer.selected_option_id : null;
  };

  const isPassed = score !== null && score >= 50; // Simple threshold indicator

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-grow p-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Performance Score Overview Card */}
        <Card className="mb-6 bg-white border-2 border-primary-light">
          <View className="items-center py-4">
            <Text className="text-sm text-text-secondary font-bold uppercase tracking-widest mb-1">
              Final Score
            </Text>
            <Text className="text-5xl font-extrabold text-primary mb-3">
              {score}%
            </Text>
            
            <View className={`px-4 py-1.5 rounded-full mb-5 ${isPassed ? 'bg-success-light' : 'bg-red-50'}`}>
              <Text className={`text-xs font-bold ${isPassed ? 'text-success-dark' : 'text-danger'}`}>
                {isPassed ? '✓ PASSED' : '✕ REVIEW REQUIRED'}
              </Text>
            </View>

            {/* Statistics Matrix */}
            <View className="flex-row border-t border-gray-100 pt-4 w-full justify-around">
              <View className="items-center">
                <Text className="text-lg font-bold text-text">
                  {correct_answers_count} / {total_questions}
                </Text>
                <Text className="text-[10px] text-text-secondary uppercase font-semibold">
                  Correct
                </Text>
              </View>

              <View className="items-center">
                <Text className="text-lg font-bold text-text">
                  {attempt.quiz?.time_limit || 0}m
                </Text>
                <Text className="text-[10px] text-text-secondary uppercase font-semibold">
                  Limit
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Question-by-Question Feedback review */}
        <Text className="text-lg font-bold text-text mb-4 mt-2">
          Assessment Review
        </Text>

        {attempt.quiz?.questions?.map((question, index) => {
          const selectedOptionId = getSelectedOptionId(question._id);

          // Find correct option from options array since backend stores is_correct flag per option
          const correctOption = question.options.find((opt) => opt.is_correct === true);
          const correctOptionId = correctOption?._id;

          return (
            <View key={question._id} className="mb-2">
              <View className="flex-row items-center mb-1">
                <Text className="text-xs font-bold text-primary mr-2 uppercase">
                  Question {index + 1}
                </Text>
                {selectedOptionId === null ? (
                  <Text className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-100">
                    ⚠ Skipped
                  </Text>
                ) : selectedOptionId === correctOptionId ? (
                  <Text className="text-[10px] text-success bg-success-light px-2 py-0.5 rounded-full font-semibold border border-success/10">
                    ✓ Correct
                  </Text>
                ) : (
                  <Text className="text-[10px] text-danger bg-red-50 px-2 py-0.5 rounded-full font-semibold border border-red-100">
                    ✕ Incorrect
                  </Text>
                )}
              </View>

              <QuestionCard
                question={question}
                selectedOptionId={selectedOptionId}
                correctOptionId={correctOptionId}
                showFeedback // highlights correct/incorrect answers instantly
              />
            </View>
          );
        })}
      </ScrollView>

      {/* Persistent Bottom Bar Action */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <Button
          title="Return to Quizzes"
          onPress={() => {
            // Check if root stack navigator allows popping or needs explicit tab change
            // Reset to UserQuizList safely
            navigation.navigate('UserQuizList');
          }}
          variant="primary"
          className="py-4"
          textClassName="text-base font-bold"
        />
      </View>
    </View>
  );
};

export default AttemptResultScreen;
