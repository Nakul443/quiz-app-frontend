// This hook submits an attempt, and once it succeeds,
// tells React Query "the attempt details, result, and history you have saved are now out of date — go fetch them again" —
// so every screen showing that data automatically updates itself without you writing manual refresh logic.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitAttempt } from '../../services/api/attempt.api';

export const useSubmitAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: string) => submitAttempt(attemptId),
    onSuccess: (_, attemptId) => {
      // Invalidate the specific attempt details
      queryClient.invalidateQueries({ queryKey: ['attempts', attemptId] });
      // Invalidate attempt result to let it fetch cleanly
      queryClient.invalidateQueries({ queryKey: ['attempts', attemptId, 'result'] });
      // Invalidate attempt history list
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
    },
  });
};