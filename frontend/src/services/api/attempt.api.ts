// file to call the backend API for quiz attempts,
// including starting an attempt, submitting answers, and retrieving results

import httpClient from '../httpClient';
import { ApiResponse, Attempt, AttemptResultDetail } from '../../types/api.types';

export interface SubmitAnswerParams {
  question_id: string;
  selected_option_id: string | null;
}

export const startAttempt = async (quizId: string): Promise<ApiResponse<Attempt>> => {
  const response = await httpClient.post<ApiResponse<Attempt>>(`/quizzes/${quizId}/attempts`);
  return response.data;
};

export const getAttempt = async (attemptId: string): Promise<ApiResponse<Attempt>> => {
  const response = await httpClient.get<ApiResponse<Attempt>>(`/attempts/${attemptId}`);
  return response.data;
};

export const submitAnswer = async (
  attemptId: string,
  params: SubmitAnswerParams
): Promise<ApiResponse<any>> => {
  const response = await httpClient.patch<ApiResponse<any>>(`/attempts/${attemptId}/answers`, params);
  return response.data;
};

export const submitAttempt = async (attemptId: string): Promise<ApiResponse<Attempt>> => {
  const response = await httpClient.post<ApiResponse<Attempt>>(`/attempts/${attemptId}/submit`);
  return response.data;
};

export const getHistory = async (): Promise<ApiResponse<Attempt[]>> => {
  const response = await httpClient.get<ApiResponse<Attempt[]>>('/attempts');
  return response.data;
};

export const getResult = async (attemptId: string): Promise<ApiResponse<AttemptResultDetail>> => {
  const response = await httpClient.get<ApiResponse<AttemptResultDetail>>(`/attempts/${attemptId}/result`);
  return response.data;
};
