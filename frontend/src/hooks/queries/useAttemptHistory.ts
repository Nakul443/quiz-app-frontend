// this query hook fetches the attempt history data for the current user using React Query and the getHistory API function

import { useQuery } from '@tanstack/react-query';
import { getHistory } from '../../services/api/attempt.api';

export const useAttemptHistory = () => {
  return useQuery({
    queryKey: ['attempts'],
    queryFn: async () => {
      const response = await getHistory();
      return response.data;
    },
  });
};
