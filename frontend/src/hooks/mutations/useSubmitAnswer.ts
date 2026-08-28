// This hook submits an answer for a specific question in an attempt, and once it succeeds,
// tells React Query "the attempt details you have saved are now out of date — go fetch them again" —
// so every screen showing that data automatically updates itself without you writing manual refresh logic.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitAnswer, SubmitAnswerParams } from '../../services/api/attempt.api';

interface SubmitAnswerMutationParams {
  attemptId: string;
  questionId: string;
  answer: SubmitAnswerParams;
}

export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ attemptId, questionId, answer }: SubmitAnswerMutationParams) =>
      submitAnswer(attemptId, questionId, answer),
    onSuccess: (_, variables) => {
      // Invalidate the attempt details to reflect the saved answer
      queryClient.invalidateQueries({
        queryKey: ['attempts', variables.attemptId],
      });
    },
  });
};
