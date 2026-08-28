import React from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminQuizStackParamList } from '../../types/navigation.types';
import { useQuizDetail } from '../../hooks/queries/useQuizDetail';
import { useQuestions } from '../../hooks/queries/useQuestions';
import { useUpdateQuizStatus } from '../../hooks/mutations/useUpdateQuizStatus';
import { useDeleteQuiz } from '../../hooks/mutations/useDeleteQuiz';
import { useDeleteQuestion } from '../../hooks/mutations/useDeleteQuestion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

type Props = NativeStackScreenProps<AdminQuizStackParamList, 'QuizDetailAdmin'>;

export const QuizDetailAdminScreen: React.FC<Props> = ({ route, navigation }) => {
  const { quizId } = route.params;

  const { data: quiz, isLoading: isQuizLoading, error: quizError, refetch: refetchQuiz } = useQuizDetail(quizId);
  const { data: questions, isLoading: isQuestionsLoading, error: questionsError, refetch: refetchQuestions } = useQuestions(quizId);

  const updateStatusMutation = useUpdateQuizStatus();
  const deleteQuizMutation = useDeleteQuiz();
  const deleteQuestionMutation = useDeleteQuestion();

  const handleToggleStatus = () => {
    if (!quiz) return;
    updateStatusMutation.mutate(
      { id: quiz.id, is_published: !quiz.is_published },
      {
        onSuccess: () => {
          Alert.alert('Success', `Quiz ${!quiz.is_published ? 'published' : 'unpublished'} successfully!`);
        },
      }
    );
  };

  const handleDeleteQuiz = () => {
    Alert.alert(
      'Delete Quiz',
      'Are you sure you want to delete this quiz and all its questions? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteQuizMutation.mutate(quizId, {
              onSuccess: () => {
                navigation.goBack();
              },
            });
          },
        },
      ]
    );
  };

  const handleDeleteQuestion = (questionId: string) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to remove this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteQuestionMutation.mutate({ quizId, questionId });
          },
        },
      ]
    );
  };

  if (isQuizLoading || isQuestionsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (quizError || !quiz) {
    return <ErrorMessage message={quizError?.message || 'Quiz not found'} onRetry={refetchQuiz} />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      {/* Quiz Detail Card */}
      <Card className="mb-6">
        <View className="flex-row justify-between items-start mb-3">
          <Text className="text-xl font-extrabold text-text flex-1 mr-2">
            {quiz.title}
          </Text>
          <View
            className={`px-2.5 py-1 rounded-full ${
              quiz.is_published ? 'bg-success-light' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                quiz.is_published ? 'text-success-dark' : 'text-text-secondary'
              }`}
            >
              {quiz.is_published ? 'Published' : 'Draft'}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-text-secondary leading-5 mb-5">
          {quiz.description}
        </Text>

        <View className="flex-row justify-between items-center border-t border-b border-gray-100 py-3 mb-5">
          <View className="flex-row items-center">
            <Text className="text-lg mr-2">⏱️</Text>
            <Text className="text-sm font-semibold text-text">
              {quiz.time_limit} Minutes
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-lg mr-2">❓</Text>
            <Text className="text-sm font-semibold text-text">
              {questions?.length || 0} Questions
            </Text>
          </View>
        </View>

        {/* Quiz Actions */}
        <View className="flex-row space-x-3">
          <Button
            title={quiz.is_published ? 'Unpublish' : 'Publish Quiz'}
            onPress={handleToggleStatus}
            variant={quiz.is_published ? 'outline' : 'primary'}
            isLoading={updateStatusMutation.isPending}
            className="flex-1 py-2.5"
            textClassName="text-sm font-semibold"
          />
          <Button
            title="Submissions"
            onPress={() => navigation.navigate('QuizSubmissions', { quizId })}
            variant="secondary"
            className="flex-1 py-2.5"
            textClassName="text-sm font-semibold text-text"
          />
        </View>
        
        <Button
          title="Delete Quiz"
          onPress={handleDeleteQuiz}
          variant="text"
          isLoading={deleteQuizMutation.isPending}
          className="mt-3 py-2"
          textClassName="text-sm font-semibold text-danger"
        />
      </Card>

      {/* Questions Header */}
      <View className="flex-row justify-between items-center mb-4 mt-2">
        <Text className="text-lg font-bold text-text">Questions List</Text>
        <Button
          title="+ Add Question"
          onPress={() => navigation.navigate('AddQuestion', { quizId })}
          variant="outline"
          size="sm"
          className="border-primary/30"
          textClassName="text-primary text-xs font-semibold"
        />
      </View>

      {questionsError && (
        <View className="mb-4 bg-red-50 p-4 rounded-xl border border-red-100">
          <Text className="text-sm text-danger text-center">
            Failed to load questions. {questionsError.message}
          </Text>
          <TouchableOpacity onPress={() => { refetchQuestions(); }} className="mt-2">
            <Text className="text-xs text-primary font-bold text-center">Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Questions List */}
      {questions && questions.length === 0 ? (
        <Card className="items-center py-8">
          <Text className="text-sm text-text-secondary text-center mb-4">
            No questions added to this quiz yet.
          </Text>
          <Button
            title="Create First Question"
            onPress={() => navigation.navigate('AddQuestion', { quizId })}
            size="sm"
          />
        </Card>
      ) : (
        questions?.map((question, qIdx) => {
          return (
            <Card key={question.id} className="mb-4 bg-white">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-sm font-bold text-primary mr-2">
                  Q{qIdx + 1}
                </Text>
                <View className="flex-row space-x-1">
                  <Button
                    title="Edit"
                    onPress={() => navigation.navigate('EditQuestion', { quizId, questionId: question.id })}
                    variant="text"
                    size="sm"
                    className="p-1 px-2.5"
                    textClassName="text-xs text-primary font-bold"
                  />
                  <Button
                    title="Delete"
                    onPress={() => handleDeleteQuestion(question.id)}
                    variant="text"
                    size="sm"
                    className="p-1 px-2.5"
                    textClassName="text-xs text-danger font-bold"
                  />
                </View>
              </View>

              <Text className="text-base font-semibold text-text mb-4 leading-6">
                {question.text}
              </Text>

              {/* Options list showing the correct answer with a green indicator */}
              <View className="space-y-2">
                {question.options.map((opt, oIdx) => {
                  const isCorrect = question.correct_option_id === opt.id;
                  const letter = String.fromCharCode(65 + oIdx);

                  return (
                    <View
                      key={opt.id}
                      className={`flex-row items-center border rounded-xl p-3 mb-2 ${
                        isCorrect ? 'border-success bg-success-light' : 'border-gray-100 bg-gray-50/50'
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full items-center justify-center mr-2.5 ${
                          isCorrect ? 'bg-success text-white' : 'bg-gray-200 text-text-secondary'
                        }`}
                      >
                        <Text className="text-[10px] font-bold text-center">
                          {letter}
                        </Text>
                      </View>
                      <Text
                        className={`flex-1 text-sm ${
                          isCorrect ? 'text-success-dark font-semibold' : 'text-text-secondary'
                        }`}
                      >
                        {opt.text}
                      </Text>
                      {isCorrect && (
                        <Text className="text-xs font-extrabold text-success mr-1">✓ Correct</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </Card>
          );
        })
      )}
    </ScrollView>
  );
};

export default QuizDetailAdminScreen;
