// This hook logs in a user, and once it succeeds,
// tells React Query "the authentication state you have saved is now out of date — go fetch it again" —
// so every screen showing that data automatically updates itself without you writing manual refresh logic.

import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../services/api/auth.api';
import { useAuth } from '../../context/AuthContext';

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (response) => {
      if (response.success && response.data?.token) {
        await login(response.data.token);
      }
    },
  });
};
