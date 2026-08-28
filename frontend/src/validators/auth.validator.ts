// zod validation schemas for login and registration forms, along with their corresponding TypeScript types.
// schemas to validate user input in the authentication forms,
// ensuring that the data meets the required criteria before submission.

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(30, 'Name must be at most 30 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain alphabetic characters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  role: z.enum(['admin', 'user'], {
    message: 'Please select a role',
  }),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
