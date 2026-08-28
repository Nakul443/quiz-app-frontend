// this file contains TypeScript interfaces for authentication-related data structures used in the application
// schemas for validation and type-checking of authentication data, such as user information, tokens, and authentication state
// writes down rules for what data is allowed/required to pass between screens

import { UserRole } from '../constants/roles';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DecodedToken {
  id: string;
  user_id?: string; // fallback
  username: string;
  email: string;
  role: UserRole;
  exp: number;
}

export interface LoginResponseData {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}

export interface RegisterResponseData {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}
