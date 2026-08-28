// this file is responsible for fetching the submissions
// for a specific quiz from the backend API
// and return the data in a format that can be
// used by the frontend components
// this makes it easier to manage the data fetching logic and
// keep the components clean and focused on rendering the UI

import { useQuery } from '@tanstack/react-query';
import { getSubmissions } from '../../services/api/quiz.api';

export const useSubmissions = (quizId: string) => {
  return useQuery({
    queryKey: ['quizzes', quizId, 'submissions'],
    queryFn: async () => {
      const response = await getSubmissions(quizId);
      return response.data;
    },
    enabled: !!quizId,
  });
};