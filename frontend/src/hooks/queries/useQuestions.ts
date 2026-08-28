// this query hook fetches the questions for a given quizId using React Query and the getQuestions API function

import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '../../services/api/question.api';

export const useQuestions = (quizId: string) => {
  return useQuery({
    queryKey: ['quizzes', quizId, 'questions'],
    queryFn: async () => {
      const response = await getQuestions(quizId);
      return response.data;
    },
    enabled: !!quizId,
  });
};
