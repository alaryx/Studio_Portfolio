import { z } from 'zod'

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Project validation
export const projectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  problem: z.string().optional(),
  solution: z.string().optional(),
  targetAudience: z.string().optional(),
  techStack: z.array(z.string()).min(1, 'At least one tech stack item required'),
  features: z.array(z.string()).default([]),
  category: z.enum(['WEB_APP', 'AI_TOOL', 'MOBILE_APP', 'SAAS', 'EXPERIMENT']),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
})

export type ProjectInput = z.infer<typeof projectSchema>

// Lead/Contact form validation
export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  projectId: z.string().uuid().optional(),
})

export type LeadInput = z.infer<typeof leadSchema>

// Analytics event validation
export const analyticsSchema = z.object({
  projectId: z.string().uuid(),
  eventType: z.enum(['VIEW', 'MODAL_OPEN', 'GITHUB_CLICK', 'LIVE_CLICK', 'CONTACT_CLICK']),
})

export type AnalyticsInput = z.infer<typeof analyticsSchema>