// This hook starts a new attempt for a specific quiz, and once it succeeds,
// tells React Query "the attempt history you have saved is now out of date — go fetch it again" —
// so every screen showing that data automatically updates itself without you writing manual refresh logic.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startAttempt } from '../../services/api/attempt.api';

export const useStartAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: string) => startAttempt(quizId),
    onSuccess: () => {
      // Invalidate current list of attempts/history
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
    },
  });
};
