import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserQuizStackParamList } from '../../types/navigation.types';
import { useQuizzes } from '../../hooks/queries/useQuizzes';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';

type Props = NativeStackScreenProps<UserQuizStackParamList, 'UserQuizList'>;

export const QuizListScreen: React.FC<Props> = ({ navigation }) => {
  const { data: quizzes, isLoading, error, refetch, isRefetching } = useQuizzes();

  // Filter only active (published) quizzes for user view
  const activeQuizzes = quizzes?.filter((quiz) => quiz.is_published) || [];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={() => { refetch(); }} />;
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="mb-5 mt-2">
        <Text className="text-xl font-bold text-text mb-1">Available Assessments</Text>
        <Text className="text-sm text-text-secondary">
          Choose a quiz below to test your skills. Work is saved dynamically.
        </Text>
      </View>

      <FlatList
        data={activeQuizzes}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} colors={['#4f46e5']} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Active Quizzes"
            description="There are no published quizzes available at the moment. Please check back later!"
          />
        }
        renderItem={({ item }) => (
          <Card
            className="mb-4 bg-white"
            onPress={() => navigation.navigate('QuizDetailUser', { quizId: item.id })}
          >
            <Text className="text-base font-bold text-text mb-1.5" numberOfLines={1}>
              {item.title}
            </Text>
            <Text className="text-xs text-text-secondary mb-4" numberOfLines={2}>
              {item.description}
            </Text>

            {/* Quiz Info Row */}
            <View className="flex-row items-center border-t border-gray-100 pt-3 justify-between">
              <View className="flex-row space-x-4">
                <View className="flex-row items-center mr-4">
                  <Text className="text-sm mr-1">⏱️</Text>
                  <Text className="text-xs font-semibold text-text-secondary">
                    {item.time_limit} mins
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-sm mr-1">❓</Text>
                  <Text className="text-xs font-semibold text-text-secondary">
                    {item.questions?.length || 0} Questions
                  </Text>
                </View>
              </View>

              <Text className="text-xs font-bold text-primary">Start Quiz →</Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
};

export default QuizListScreen;
