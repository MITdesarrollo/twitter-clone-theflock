import { z } from 'zod';

export const createTweetSchema = z.object({
  content: z
    .string()
    .min(1, 'Tweet content is required')
    .max(280, 'Tweet must be 280 characters or less'),
  parentId: z.string().cuid().optional().nullable(),
});

export type CreateTweetInput = z.infer<typeof createTweetSchema>;
