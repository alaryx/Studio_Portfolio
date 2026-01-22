import { Category, EventType, LeadStatus, Project as PrismaProject } from '@prisma/client'

// Re-export Prisma enums
export { Category, EventType, LeadStatus }

// Admin type
export interface Admin {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// Project type (with relations)
export interface Project {
  id: string
  name: string
  tagline: string
  description: string
  problem?: string | null
  solution?: string | null
  targetAudience?: string | null
  techStack: string[]
  features: string[]
  category: Category
  githubUrl?: string | null
  liveUrl?: string | null
  images: string[]
  videoUrl?: string | null
  isFeatured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
  _count?: {
    analytics: number
    leads: number
  }
}

// Analytics type
export interface Analytics {
  id: string
  projectId: string
  eventType: EventType
  visitorIp?: string | null
  userAgent?: string | null
  createdAt: Date
}

// Lead type
export interface Lead {
  id: string
  projectId?: string | null
  name: string
  email: string
  message: string
  status: LeadStatus
  createdAt: Date
  updatedAt: Date
  project?: {
    name: string
  } | null
}

// Dashboard stats
export interface DashboardStats {
  totalProjects: number
  totalViews: number
  totalLeads: number
  newLeads: number
  githubClicks: number
  liveClicks: number
  contactClicks: number
  recentLeads: Lead[]
  topProjects: Array<{
    id: string
    name: string
    views: number
    clicks: number
  }>
}