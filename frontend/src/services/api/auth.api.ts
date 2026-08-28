// file to call the backend API for authentication-related actions like login and registration

import httpClient from '../httpClient';
import { ApiResponse } from '../../types/api.types';
import { LoginResponseData, RegisterResponseData } from '../../types/auth.types';
import { UserRole } from '../../constants/roles';

export interface LoginParams {
  email: string;
  password?: string; // Standard matching
}

export interface RegisterParams {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export const loginUser = async (params: { email: string; password?: string }): Promise<ApiResponse<LoginResponseData>> => {
  const response = await httpClient.post<ApiResponse<LoginResponseData>>('/auth/login', params);
  return response.data;
};

export const registerUser = async (params: { name: string; email: string; role: UserRole; password?: string }): Promise<ApiResponse<RegisterResponseData>> => {
  const response = await httpClient.post<ApiResponse<RegisterResponseData>>('/auth/register', params);
  return response.data;
};
