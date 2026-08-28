// this query hook fetches the attempt data for a given attemptId using React Query and the getAttempt API function

import { useQuery } from '@tanstack/react-query';
import { getAttempt } from '../../services/api/attempt.api';

export const useAttempt = (attemptId: string) => {
  return useQuery({
    queryKey: ['attempts', attemptId],
    queryFn: async () => {
      const response = await getAttempt(attemptId);
      return response.data;
    },
    enabled: !!attemptId,
  });
};
