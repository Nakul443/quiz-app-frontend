// This hook creates a new quiz, and once it succeeds,
// tells React Query "the quiz list you have saved is now out of date — go fetch it again" —
// so every screen showing that data automatically updates itself without writing manual refresh logic

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuiz, CreateQuizParams } from '../../services/api/quiz.api';

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateQuizParams) => createQuiz(params),
    onSuccess: () => {
      // Invalidate quizzes cache to refetch on return to list
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};