// this query hook fetches the quiz detail for a given quizId using React Query and the getQuizById API function

import { useQuery } from '@tanstack/react-query';
import { getQuizById } from '../../services/api/quiz.api';

export const useQuizDetail = (quizId: string) => {
  return useQuery({
    queryKey: ['quizzes', quizId],
    queryFn: async () => {
      const response = await getQuizById(quizId);
      return response.data;
    },
    enabled: !!quizId,
  });
};
