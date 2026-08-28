// this file contains TypeScript interfaces for the API responses and data structures used in the application
// basically rules describing the shape data must follow when it is sent to or received from the backend API

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Option {
  id: string;
  question_id: string;
  text: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  text: string;
  options: Option[];
  correct_option_id?: string; // Optional because only admins can see this, or returned in results
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  time_limit: number; // in minutes (or seconds, represented as a number)
  is_published: boolean;
  created_at?: string;
  questions?: Question[];
}

export interface Attempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score?: number;
  started_at: string;
  completed_at?: string | null;
  time_remaining?: number; // in seconds
  status: 'active' | 'completed';
  quiz?: {
    id: string;
    title: string;
    description: string;
    time_limit: number;
  };
}

export interface UserAnswer {
  question_id: string;
  selected_option_id: string | null;
  is_correct?: boolean;
}

export interface AttemptResultDetail {
  attempt: Attempt;
  answers: UserAnswer[];
  total_questions: number;
  correct_answers_count: number;
  score: number;
}

export interface Submission {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  started_at: string;
  completed_at: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}
