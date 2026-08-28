// This hook updates the status of a quiz (published/unpublished), and once it succeeds,
// tells React Query "the quiz list and the quiz detail you have saved are now out of date — go fetch them again" —
// so every screen showing that data automatically updates itself without you writing manual refresh logic.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuizStatus } from '../../services/api/quiz.api';

interface UpdateStatusParams {
  id: string;
  is_published: boolean;
}

export const useUpdateQuizStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_published }: UpdateStatusParams) =>
      updateQuizStatus(id, is_published),
    onSuccess: (_, variables) => {
      // Invalidate the quizzes list cache
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      // Invalidate the specific quiz detail cache
      queryClient.invalidateQueries({ queryKey: ['quizzes', variables.id] });
    },
  });
};
