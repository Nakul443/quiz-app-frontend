import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useSubmissions } from '../../hooks/queries/useSubmissions';
import { useQuizDetail } from '../../hooks/queries/useQuizDetail';
import { Card } from '../../components/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';

type Props = {
  route: {
    params: {
      quizId: string;
    };
  };
  navigation: any;
};

export const QuizSubmissionsScreen: React.FC<Props> = ({ route }) => {
  const { quizId } = route.params;

  const { data: quiz, isLoading: isQuizLoading } = useQuizDetail(quizId);
  const { data: submissions, isLoading: isSubmissionsLoading, error, refetch, isRefetching } = useSubmissions(quizId);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isSubmissionsLoading || isQuizLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={refetch} />;
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Quiz Detail Summary Section */}
      {quiz && (
        <View className="mb-5 mt-2 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <Text className="text-base font-extrabold text-text mb-1" numberOfLines={1}>
            {quiz.title}
          </Text>
          <Text className="text-xs text-text-secondary">
            Total Submissions: <Text className="font-bold text-primary">{submissions?.length || 0}</Text>
          </Text>
        </View>
      )}

      {/* Submissions List */}
      <FlatList
        data={submissions}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} colors={['#4f46e5']} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Submissions Yet"
            description="Users haven't attempted this assessment yet."
          />
        }
        renderItem={({ item }) => (
          <Card className="mb-3 bg-white">
            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-3">
                <Text className="text-base font-bold text-text mb-0.5">
                  {item.user?.username || 'Anonymous User'}
                </Text>
                <Text className="text-xs text-text-secondary mb-2">
                  {item.user?.email || 'N/A'}
                </Text>
                <Text className="text-[10px] text-text-light">
                  Submitted: {formatDate(item.completed_at)}
                </Text>
              </View>

              {/* Score Circular Badge */}
              <View className="bg-primary-light border border-primary/10 rounded-2xl px-4 py-3 items-center justify-center">
                <Text className="text-lg font-extrabold text-primary">
                  {item.score}%
                </Text>
                <Text className="text-[9px] font-semibold text-primary uppercase tracking-wider">
                  Score
                </Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
};

export default QuizSubmissionsScreen;
