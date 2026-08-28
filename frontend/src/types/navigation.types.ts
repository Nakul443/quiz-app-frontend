// this file contains TypeScript types for navigation parameters used in the application
// which are used with React Navigation to define the structure of the navigation stacks and tabs

import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AdminQuizStackParamList = {
  AdminQuizList: undefined;
  QuizDetailAdmin: { quizId: string };
  CreateQuiz: undefined;
  AddQuestion: { quizId: string };
  EditQuestion: { quizId: string; questionId: string };
  QuizSubmissions: { quizId: string };
};

export type AdminSubmissionsStackParamList = {
  SubmissionsQuizList: undefined;
  QuizSubmissions: { quizId: string };
};

export type AdminTabParamList = {
  QuizzesTab: NavigatorScreenParams<AdminQuizStackParamList>;
  SubmissionsTab: NavigatorScreenParams<AdminSubmissionsStackParamList>;
};

export type UserQuizStackParamList = {
  UserQuizList: undefined;
  QuizDetailUser: { quizId: string };
  AttemptQuestion: { attemptId: string };
  AttemptResult: { attemptId: string };
};

export type UserHistoryStackParamList = {
  UserAttemptHistory: undefined;
  AttemptResult: { attemptId: string };
};

export type UserTabParamList = {
  QuizzesTab: NavigatorScreenParams<UserQuizStackParamList>;
  HistoryTab: NavigatorScreenParams<UserHistoryStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  AdminApp: NavigatorScreenParams<AdminTabParamList>;
  UserApp: NavigatorScreenParams<UserTabParamList>;
};
