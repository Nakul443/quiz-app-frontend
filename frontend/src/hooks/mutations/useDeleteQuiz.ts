// This hook deletes a quiz, and once it succeeds,
// tells React Query "the quiz list and the quiz detail you have saved are now out of date — go fetch them again" —
// so every screen showing that data automatically updates itself without you writing manual refresh logic.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuiz } from '../../services/api/quiz.api';

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuiz(id),
    onSuccess: (_, id) => {
      // Invalidate both lists and detail query caches
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quizzes', id] });
    },
  });
};
