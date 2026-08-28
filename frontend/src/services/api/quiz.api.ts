// file to call the backend API for quizzes,
// including creating, updating, deleting, and retrieving quizzes and their submissions

import httpClient from '../httpClient';
import { ApiResponse, Quiz, Submission } from '../../types/api.types';

export interface CreateQuizParams {
  title: string;
  description: string;
  time_limit: number; // in minutes/seconds as backend expects
}

export const getQuizzes = async (): Promise<ApiResponse<Quiz[]>> => {
  const response = await httpClient.get<ApiResponse<Quiz[]>>('/quizzes');
  return response.data;
};

export const getQuizById = async (id: string): Promise<ApiResponse<Quiz>> => {
  const response = await httpClient.get<ApiResponse<Quiz>>(`/quizzes/${id}`);
  return response.data;
};

export const createQuiz = async (params: CreateQuizParams): Promise<ApiResponse<Quiz>> => {
  const response = await httpClient.post<ApiResponse<Quiz>>('/quizzes', params);
  return response.data;
};

export const deleteQuiz = async (id: string): Promise<ApiResponse<void>> => {
  const response = await httpClient.delete<ApiResponse<void>>(`/quizzes/${id}`);
  return response.data;
};

export const updateQuizStatus = async (id: string, is_published: boolean): Promise<ApiResponse<Quiz>> => {
  const response = await httpClient.patch<ApiResponse<Quiz>>(`/quizzes/${id}/status`, { is_published });
  return response.data;
};

export const getSubmissions = async (quizId: string): Promise<ApiResponse<Submission[]>> => {
  const response = await httpClient.get<ApiResponse<Submission[]>>(`/quizzes/${quizId}/submissions`);
  return response.data;
};
