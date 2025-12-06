import { z } from 'zod';

export const ContentGenerationSchema = z.object({
  topic: z.string().min(1, "トピックは必須です"),
  targetAudience: z.string().optional(),
  keyPoints: z.string().optional(),
  tone: z.enum(["casual", "polite", "emotional", "professional", "controversial", "storytelling"]).default("casual"),
});

export type ContentGenerationInput = z.infer<typeof ContentGenerationSchema>;

export const GeneratedContentSchema = z.object({
  noteTitle: z.string(),
  noteBody: z.string(),
  xPosts: z.array(z.string()), // Array for thread
});

export type GeneratedContentResponse = z.infer<typeof GeneratedContentSchema>;
