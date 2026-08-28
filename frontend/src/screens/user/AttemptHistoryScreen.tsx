import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserHistoryStackParamList } from '../../types/navigation.types';
import { useAttemptHistory } from '../../hooks/queries/useAttemptHistory';
import { Card } from '../../components/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';

type Props = NativeStackScreenProps<UserHistoryStackParamList, 'UserAttemptHistory'>;

export const AttemptHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { data: attempts, isLoading, error, refetch, isRefetching } = useAttemptHistory();

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={() => { refetch(); }} />;
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="mb-5 mt-2">
        <Text className="text-xl font-bold text-text mb-1">My Attempt History</Text>
        <Text className="text-sm text-text-secondary">
          Review your previous submissions, scores, and complete correction details.
        </Text>
      </View>

      <FlatList
        data={attempts}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} colors={['#4f46e5']} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Attempts Yet"
            description="You haven't taken any assessments yet. Jump to the Quizzes tab to start!"
          />
        }
        renderItem={({ item }) => {
          const isCompleted = item.status === 'completed';

          return (
            <Card
              className="mb-4 bg-white"
              onPress={() => {
                if (isCompleted) {
                  navigation.navigate('AttemptResult', { attemptId: item.id });
                } else {
                  // Active / In-progress, return to quiz taking stack or prompt user
                  // We navigate to taking quiz safely
                  navigation.navigate('AttemptResult', { attemptId: item.id });
                }
              }}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-bold text-text mb-1" numberOfLines={1}>
                    {item.quiz?.title || 'Untitled Assessment'}
                  </Text>
                  <Text className="text-xs text-text-secondary mb-3">
                    Taken: {formatDate(item.started_at)}
                  </Text>
                  
                  {/* Status Indicator */}
                  <View className="flex-row">
                    <View
                      className={`px-2 py-0.5 rounded-md border ${
                        isCompleted
                          ? 'bg-success-light border-success/10'
                          : 'bg-amber-50 border-amber-100'
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold ${
                          isCompleted ? 'text-success-dark' : 'text-amber-600'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'In Progress'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Score Circle Badge */}
                {isCompleted && item.score !== undefined ? (
                  <View className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 items-center justify-center">
                    <Text className="text-base font-extrabold text-primary">
                      {item.score}%
                    </Text>
                    <Text className="text-[8px] font-bold text-text-secondary uppercase">
                      Score
                    </Text>
                  </View>
                ) : (
                  <View className="bg-primary/5 rounded-xl px-3 py-2 items-center justify-center border border-primary/10">
                    <Text className="text-xs font-bold text-primary">Resume</Text>
                  </View>
                )}
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
};

export default AttemptHistoryScreen;
