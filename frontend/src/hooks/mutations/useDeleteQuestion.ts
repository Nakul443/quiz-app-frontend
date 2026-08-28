import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuestion } from '../../services/api/question.api';

interface DeleteQuestionParams {
  quizId: string;
  questionId: string;
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, questionId }: DeleteQuestionParams) =>
      deleteQuestion(quizId, questionId),
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
export default useDeleteQuestion;
