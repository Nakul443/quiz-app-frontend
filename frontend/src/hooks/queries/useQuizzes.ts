// the hook calls the quiz.api.ts file which is responsible for calling the backend API to fetch the quizzes

import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '../../services/api/quiz.api';

export const useQuizzes = () => {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const response = await getQuizzes();
      return response.data;
    },
  });
};