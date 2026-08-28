import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminSubmissionsStackParamList } from '../../types/navigation.types';
import { useQuizzes } from '../../hooks/queries/useQuizzes';
import { Card } from '../../components/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';

type Props = NativeStackScreenProps<AdminSubmissionsStackParamList, 'SubmissionsQuizList'>;

export const SubmissionsQuizListScreen: React.FC<Props> = ({ navigation }) => {
  const { data: quizzes, isLoading, error, refetch, isRefetching } = useQuizzes();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={() => { refetch(); }} />;
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="mb-5 mt-2">
        <Text className="text-xl font-bold text-text mb-1">Submissions By Quiz</Text>
        <Text className="text-sm text-text-secondary">
          Select a quiz to review user results and overall performance metrics.
        </Text>
      </View>

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} colors={['#4f46e5']} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Quizzes Active"
            description="Create a quiz first before viewing submissions."
          />
        }
        renderItem={({ item }) => (
          <Card
            className="mb-4 bg-white"
            onPress={() => navigation.navigate('QuizSubmissions', { quizId: item._id })}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <Text className="text-base font-bold text-text mb-1" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-xs text-text-secondary" numberOfLines={1}>
                  ⏱️ {item.time_limit} mins • ❓ {item.questions?.length || 0} Questions
                </Text>
              </View>

              {/* Action Chevron Indicator */}
              <View className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <Text className="text-xs text-primary font-bold">View →</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
};

export default SubmissionsQuizListScreen;
