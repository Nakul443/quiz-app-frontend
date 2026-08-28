// This file defines the AdminQuizListScreen component, which displays a list of quizzes for the admin to manage.
// The admin can view quiz details, create new quizzes, and toggle the published status of existing quizzes.
// It fetches quizzes and handles mutations for updating quiz status.

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminQuizStackParamList } from '../../types/navigation.types';
import { useQuizzes } from '../../hooks/queries/useQuizzes';
import { useUpdateQuizStatus } from '../../hooks/mutations/useUpdateQuizStatus';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';

type Props = NativeStackScreenProps<AdminQuizStackParamList, 'AdminQuizList'>;

export const AdminQuizListScreen: React.FC<Props> = ({ navigation }) => {
  const { data: quizzes, isLoading, error, refetch, isRefetching } = useQuizzes();
  const updateStatusMutation = useUpdateQuizStatus();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateStatusMutation.mutate({ _id: id, is_active: !currentStatus });
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={() => { refetch(); }} />;
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Top Banner/Action */}
      <View className="flex-row justify-between items-center mb-5 mt-2">
        <Text className="text-xl font-bold text-text">Manage Quizzes</Text>
        <Button
          title="+ Create Quiz"
          onPress={() => navigation.navigate('CreateQuiz')}
          size="sm"
          className="px-4 py-2"
        />
      </View>

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => { refetch(); }} colors={['#4f46e5']} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Quizzes Found"
            description="Create your first quiz to get started."
            actionTitle="Create Quiz"
            onAction={() => navigation.navigate('CreateQuiz')}
          />
        }
        renderItem={({ item }) => (
          <Card
            className="mb-4 bg-white"
            onPress={() => navigation.navigate('QuizDetailAdmin', { quizId: item._id })}
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 pr-2">
                <Text className="text-base font-bold text-text mb-1" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-xs text-text-secondary" numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              {/* Status Badge */}
              <View
                className={`px-2.5 py-1 rounded-full ${
                  item.is_active ? 'bg-success-light' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    item.is_active ? 'text-success-dark' : 'text-text-secondary'
                  }`}
                >
                  {item.is_active ? 'Published' : 'Draft'}
                </Text>
              </View>
            </View>

            {/* Quiz Specs Row */}
            <View className="flex-row items-center border-t border-gray-100 pt-3 mt-2 justify-between">
              <View className="flex-row space-x-4">
                <View className="flex-row items-center mr-4">
                  <Text className="text-sm mr-1">⏱️</Text>
                  <Text className="text-xs font-medium text-text-secondary">
                    {item.time_limit} mins
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-sm mr-1">❓</Text>
                  <Text className="text-xs font-medium text-text-secondary">
                    {item.questions?.length || 0} Questions
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleToggleStatus(item._id, item.is_active)}
                disabled={updateStatusMutation.isPending}
                activeOpacity={0.7}
                className={`px-3 py-1.5 rounded-lg border ${
                  item.is_active
                    ? 'border-gray-200 bg-white'
                    : 'border-primary/20 bg-primary-light'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    item.is_active ? 'text-text-secondary' : 'text-primary'
                  }`}
                >
                  {item.is_active ? 'Unpublish' : 'Publish'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </View>
  );
};

export default AdminQuizListScreen;
