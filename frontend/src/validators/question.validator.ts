import { z } from 'zod';

export const questionSchema = z.object({
  question_text: z
    .string()
    .min(5, 'Question text must be at least 5 characters long'),
  options: z
    .array(
      z.object({
        option_text: z.string().min(1, 'Option text is required'),
      })
    )
    .min(2, 'At least 2 options are required')
    .max(10, 'At most 10 options are allowed'),
  correct_option_index: z
    .number()
    .min(0, 'Please select the correct option'),
});

export type QuestionFormData = z.infer<typeof questionSchema>;
