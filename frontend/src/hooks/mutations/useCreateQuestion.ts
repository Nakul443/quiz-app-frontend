// This hook adds a question to a quiz, and once it succeeds,
// tells React Query "the question list and the quiz detail you have saved are now out of date — go fetch them again" —
// so every screen showing that data automatically updates itself without you writing manual refresh logic.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestion, CreateQuestionParams } from '../../services/api/question.api';

interface CreateQuestionMutationParams {
  quizId: string;
  question: CreateQuestionParams;
}

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutation function that calls the createQuestion API with the quizId and question data
    mutationFn: ({ quizId, question }: CreateQuestionMutationParams) =>
      createQuestion(quizId, question),
    onSuccess: (_, variables) => {
      // Invalidate the questions list for this quiz
      queryClient.invalidateQueries({
        queryKey: ['quizzes', variables.quizId, 'questions'],
      });
      // Invalidate the quiz detail to update question count if cached
      queryClient.invalidateQueries({
        queryKey: ['quizzes', variables.quizId],
      });
    },
  });
};