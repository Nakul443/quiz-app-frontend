// this file contains TypeScript interfaces for the API responses and data structures used in the application
// basically rules describing the shape data must follow when it is sent to or received from the backend API

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Option {
  _id: string;
  question_id: string;
  option_text: string;
  is_correct?: boolean; // only present for admin views / results, hidden from users attempting
  order_index: number;
}

export interface Question {
  _id: string;
  quiz_id: string;
  question_text: string;
  question_type: string;
  order_index: number;
  points: number;
  options: Option[];
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  time_limit: number; // in minutes (or seconds, represented as a number)
  is_active: boolean;
  created_at?: string;
  questions?: Question[];
}

export interface Attempt {
  _id: string;
  user_id: string;
  quiz_id: string;
  status: 'in_progress' | 'submitted' | 'auto_submitted';
  score: number | null;
  total_questions: number;
  started_at: string;
  submitted_at: string | null;
  time_remaining?: number;
  quiz?: {
    _id: string;
    title: string;
    description: string;
    time_limit: number;
    questions?: Question[];
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
  _id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  started_at: string;
  submitted_at: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}
