import { z } from 'zod';

export const quizSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title must be at most 100 characters long'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters long'),
  time_limit: z
    .string()
    .min(1, 'Time limit is required')
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num > 0;
    }, 'Time limit must be a positive integer'),
});

export type QuizFormData = z.infer<typeof quizSchema>;
