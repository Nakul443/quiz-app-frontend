// file to call the backend API for questions,
// including creating, updating, deleting, and retrieving questions for a quiz

import httpClient from '../httpClient';
import { ApiResponse, Question } from '../../types/api.types';

export interface CreateQuestionParams {
  text: string;
  options: {
    text: string;
  }[];
  correct_option_index: number; // Index of the correct option
}

export interface UpdateQuestionParams {
  text: string;
  options: {
    text: string;
  }[];
  correct_option_index: number;
}

export const getQuestions = async (quizId: string): Promise<ApiResponse<Question[]>> => {
  const response = await httpClient.get<ApiResponse<Question[]>>(`/quizzes/${quizId}/questions`);
  return response.data;
};

export const createQuestion = async (quizId: string, params: CreateQuestionParams): Promise<ApiResponse<Question>> => {
  const response = await httpClient.post<ApiResponse<Question>>(`/quizzes/${quizId}/questions`, params);
  return response.data;
};

export const updateQuestion = async (
  quizId: string,
  questionId: string,
  params: UpdateQuestionParams
): Promise<ApiResponse<Question>> => {
  const response = await httpClient.patch<ApiResponse<Question>>(`/quizzes/${quizId}/questions/${questionId}`, params);
  return response.data;
};

export const deleteQuestion = async (quizId: string, questionId: string): Promise<ApiResponse<void>> => {
  const response = await httpClient.delete<ApiResponse<void>>(`/quizzes/${quizId}/questions/${questionId}`);
  return response.data;
};
