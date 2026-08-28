// holds the info of the currently logged in user and their auth state,
// and provides functions to log in, register, and log out
// remembers who is logged in and shares that with the whole app

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth.types';
import { saveToken, getToken, removeToken } from '../utils/secureStorage';
import { decodeToken, isTokenExpired } from '../utils/jwtDecode';
import { registerUnauthorizedCallback } from '../services/httpClient';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  register: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const handleAuthentication = async (token: string) => {
    const decoded = decodeToken(token);
    if (decoded) {
      const user: User = {
        _id: decoded._id || decoded.id || decoded.user_id || '',
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };

      await saveToken(token);

      setState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      console.error('Invalid token payload');
      await handleLogout();
    }
  };

  const handleLogout = async () => {
    await removeToken();
    setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const login = async (token: string) => {
    await handleAuthentication(token);
  };

  const register = async (token: string) => {
    await handleAuthentication(token);
  };

  const logout = async () => {
    await handleLogout();
  };

  // Boot sequence: check for existing, valid token
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await getToken();
        if (token && !isTokenExpired(token)) {
          const decoded = decodeToken(token);
          if (decoded) {
            const user: User = {
              _id: decoded._id || decoded.id || decoded.user_id || '',
              name: decoded.name,
              email: decoded.email,
              role: decoded.role,
            };
            setState({
              token,
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }
      } catch (e) {
        console.error('Failed to restore token during app boot:', e);
      }
      
      // If no token or expired, reset to authenticated: false
      setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    bootstrapAsync();
  }, []);

  // Register unauthorized (401) global callback
  useEffect(() => {
    registerUnauthorizedCallback(() => {
      handleLogout();
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
