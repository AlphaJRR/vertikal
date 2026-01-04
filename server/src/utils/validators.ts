import { z } from 'zod';

// Auth validators
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  displayName: z.string().min(1, 'Display name is required'),
  handle: z.string().min(1, 'Handle is required').regex(/^[a-zA-Z0-9_-]+$/, 'Handle can only contain letters, numbers, underscores, and hyphens'),
  bio: z.string().optional(),
  tags: z.array(z.string()).optional(),
  verificationCode: z.string().min(1, 'Verification code is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Creator validators
export const createCreatorSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  handle: z.string().min(1),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
});

// Show validators
export const createShowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  series: z.string().optional(),
  creatorId: z.string().min(1, 'Creator ID is required'),
  thumbnail: z.string().url('Invalid thumbnail URL'),
  videoUrl: z.string().url().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  duration: z.number().int().positive().optional(),
  episode: z.number().int().positive().optional(),
  season: z.number().int().positive().optional(),
  publishedAt: z.string().datetime().optional(),
});

export const updateShowSchema = createShowSchema.partial();

// Comment validators
export const createCommentSchema = z.object({
  showId: z.string().min(1, 'Show ID is required'),
  text: z.string().min(1, 'Comment text is required').max(1000, 'Comment is too long'),
});

// Tip validators
export const createTipSchema = z.object({
  showId: z.string().optional(),
  creatorId: z.string().min(1, 'Creator ID is required'),
  amount: z.number().positive('Amount must be positive'),
  message: z.string().max(500, 'Message is too long').optional(),
});

// Analytics validators
export const createAnalyticsSchema = z.object({
  showId: z.string().min(1, 'Show ID is required'),
  eventType: z.enum(['play', 'pause', 'complete', 'scrub', 'quartile']),
  data: z.record(z.any()).optional(),
});


