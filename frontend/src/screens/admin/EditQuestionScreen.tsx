// This file defines the EditQuestionScreen component, which allows an admin to edit an existing multiple-choice question in a quiz.
// uses react-hook-form for form management and zod for validation, prepopulating the form with the current question data.

import React, { useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminQuizStackParamList } from '../../types/navigation.types';
import { questionSchema, QuestionFormData } from '../../validators/question.validator';
import { useQuestions } from '../../hooks/queries/useQuestions';
import { useUpdateQuestion } from '../../hooks/mutations/useUpdateQuestion';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

type Props = NativeStackScreenProps<AdminQuizStackParamList, 'EditQuestion'>;

export const EditQuestionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { quizId, questionId } = route.params;

  const { data: questions, isLoading: isQuestionsLoading, error: questionsError, refetch } = useQuestions(quizId);
  const updateQuestionMutation = useUpdateQuestion();

  const currentQuestion = questions?.find((q) => q._id === questionId);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: '',
      options: [
        { option_text: '' },
        { option_text: '' },
        { option_text: '' },
        { option_text: '' },
      ],
      correct_option_index: -1,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'options',
  });

  const correctOptionIndex = watch('correct_option_index');

  // Prepopulate form when currentQuestion is loaded
  useEffect(() => {
    if (currentQuestion) {
      const initialOptions = currentQuestion.options.map((opt) => ({ option_text: opt.option_text }));
      
      // Pad options array up to 4 if it's less, or take up to 4
      while (initialOptions.length < 4) {
        initialOptions.push({ option_text: '' });
      }

      // Find index of correct option
      const correctIdx = currentQuestion.options.findIndex(
        (opt) => opt.is_correct === true
      );

      reset({
        question_text: currentQuestion.question_text,
        options: initialOptions.slice(0, 4),
        correct_option_index: correctIdx !== -1 ? correctIdx : 0,
      });
    }
  }, [currentQuestion, reset]);

  const onSubmit = (data: QuestionFormData) => {
    const formattedOptions = data.options.map((opt, index) => ({
      option_text: opt.option_text,
      is_correct: index === data.correct_option_index,
      order_index: index,
    }));

    updateQuestionMutation.mutate(
      {
        quizId,
        questionId,
        question: {
          question_text: data.question_text,
          order_index: currentQuestion?.order_index || 0,
          options: formattedOptions,
        },
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      }
    );
  };

  if (isQuestionsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (questionsError || !currentQuestion) {
    return <ErrorMessage message={questionsError?.message || 'Question not found'} onRetry={refetch} />;
  }

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
                Edit Question
              </Text>
              <Text className="text-sm text-text-secondary">
                Modify question fields or update the correct choice selection.
              </Text>
            </View>

            {updateQuestionMutation.isError && (
              <View className="mb-5 bg-red-50 border border-red-100 p-4 rounded-xl">
                <Text className="text-sm font-medium text-danger text-center">
                  {updateQuestionMutation.error.message}
                </Text>
              </View>
            )}

            <View className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              {/* Question Text */}
              <Controller
                control={control}
                name="question_text"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Question Text"
                    placeholder="Enter question text"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.question_text?.message}
                    multiline
                    numberOfLines={3}
                    style={{ minHeight: 80, textAlignVertical: 'top' }}
                    autoCapitalize="sentences"
                  />
                )}
              />

              {/* Options Section */}
              <Text className="text-sm font-semibold text-text mb-3">
                Answer Choices
              </Text>

              {fields.map((field, index) => {
                const isSelected = correctOptionIndex === index;
                const letter = String.fromCharCode(65 + index);

                return (
                  <View key={field.id} className="mb-4">
                    <View className="flex-row items-center space-x-2">
                      <Controller
                        control={control}
                        name={`options.${index}.option_text`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            placeholder={`Option ${letter}`}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={errors.options?.[index]?.option_text?.message}
                            containerClassName="mb-0 flex-1"
                            autoCapitalize="sentences"
                          />
                        )}
                      />

                      {/* Select as Correct */}
                      <TouchableOpacity
                        onPress={() => setValue('correct_option_index', index)}
                        activeOpacity={0.7}
                        className={`w-10 h-10 rounded-xl items-center justify-center border mt-1.5 ${
                          isSelected
                            ? 'border-success bg-success-light'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <Text className={`text-base ${isSelected ? 'opacity-100' : 'opacity-30'}`}>
                          {isSelected ? '✓' : '◯'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {/* Validation error for unselected correct option */}
              {errors.correct_option_index && (
                <Text className="text-xs font-medium text-danger mb-4 mt-1">
                  {errors.correct_option_index.message}
                </Text>
              )}

              <Button
                title="Save Changes"
                onPress={handleSubmit(onSubmit)}
                isLoading={updateQuestionMutation.isPending}
                className="mt-4"
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditQuestionScreen;
