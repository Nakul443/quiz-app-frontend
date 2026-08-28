// this query hook fetches the attempt result data for a given attemptId using React Query and the getResult API function

import { useQuery } from '@tanstack/react-query';
import { getResult } from '../../services/api/attempt.api';

export const useAttemptResult = (attemptId: string) => {
  return useQuery({
    queryKey: ['attempts', attemptId, 'result'],
    queryFn: async () => {
      const response = await getResult(attemptId);
      return response.data;
    },
    enabled: !!attemptId,
  });
};
