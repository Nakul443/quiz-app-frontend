// This file defines the CreateQuizScreen component, which allows an admin to create a new quiz.
// uses react-hook-form for form management and zod for validation.

import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminQuizStackParamList } from '../../types/navigation.types';
import { quizSchema, QuizFormData } from '../../validators/quiz.validator';
import { useCreateQuiz } from '../../hooks/mutations/useCreateQuiz';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

type Props = NativeStackScreenProps<AdminQuizStackParamList, 'CreateQuiz'>;

export const CreateQuizScreen: React.FC<Props> = ({ navigation }) => {
  const createQuizMutation = useCreateQuiz();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      time_limit: '',
    },
  });

  const onSubmit = (data: QuizFormData) => {
    createQuizMutation.mutate(
      {
        title: data.title,
        description: data.description,
        time_limit: parseInt(data.time_limit, 10),
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-start px-6 py-8">
            <View className="mb-6">
              <Text className="text-xl font-bold text-text mb-1">
                New Quiz
              </Text>
              <Text className="text-sm text-text-secondary">
                Fill in the details to create a new quiz. You can add questions to it afterwards.
              </Text>
            </View>

            {createQuizMutation.isError && (
              <View className="mb-5 bg-red-50 border border-red-100 p-4 rounded-xl">
                <Text className="text-sm font-medium text-danger text-center">
                  {createQuizMutation.error.message}
                </Text>
              </View>
            )}

            <View className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Quiz Title"
                    placeholder="e.g. Introduction to TypeScript"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.title?.message}
                    autoCapitalize="sentences"
                  />
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Description"
                    placeholder="What is this quiz about?"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.description?.message}
                    multiline
                    numberOfLines={3}
                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                    autoCapitalize="sentences"
                  />
                )}
              />

              <Controller
                control={control}
                name="time_limit"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Time Limit (Minutes)"
                    placeholder="e.g. 15"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.time_limit?.message}
                    keyboardType="number-pad"
                  />
                )}
              />

              <Button
                title="Create Quiz"
                onPress={handleSubmit(onSubmit)}
                isLoading={createQuizMutation.isPending}
                className="mt-4"
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateQuizScreen;
