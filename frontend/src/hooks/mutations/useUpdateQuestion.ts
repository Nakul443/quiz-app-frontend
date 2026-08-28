import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuestion, UpdateQuestionParams } from '../../services/api/question.api';

interface UpdateQuestionMutationParams {
  quizId: string;
  questionId: string;
  question: UpdateQuestionParams;
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, questionId, question }: UpdateQuestionMutationParams) =>
      updateQuestion(quizId, questionId, question),
    onSuccess: (_, variables) => {
      // Invalidate the questions list for this quiz
      queryClient.invalidateQueries({
        queryKey: ['quizzes', variables.quizId, 'questions'],
      });
    },
  });
};
export default useUpdateQuestion;
