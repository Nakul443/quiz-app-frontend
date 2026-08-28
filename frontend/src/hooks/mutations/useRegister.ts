// This hook registers a new user, and once it succeeds,
// tells React Query "the authentication state you have saved is now out of date — go fetch it again" —
// so every screen showing that data automatically updates itself without you writing manual refresh logic.

import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../../services/api/auth.api';
import { useAuth } from '../../context/AuthContext';

export const useRegister = () => {
  const { register } = useAuth();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async (response) => {
      if (response.success && response.data?.token) {
        await register(response.data.token);
      }
    },
  });
};
