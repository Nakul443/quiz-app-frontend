// this file contains utility functions for decoding JWT tokens and checking their expiration status
// takes the token string and pulls out role and expiration from them

import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types/auth.types';

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      ...decoded,
      _id: decoded._id || decoded.id || decoded.user_id || '', // Normalize user ID field
    };
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return true;
  }
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
