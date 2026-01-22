import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations'
import { Category } from '@prisma/client'

/**
 * GET /api/projects
 * Fetch all projects with optional filtering
 * Public endpoint (no auth required)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') as Category | null
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    // Build query filters
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch projects
    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        _count: {
          select: {
            analytics: {
              where: { eventType: 'VIEW' },
            },
            leads: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: projects,
    })
  } catch (error: any) {
    console.error('GET /api/projects error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
      },
      { status: 500 }
    )
  }
}




/**
 * POST /api/projects
 * Create a new project
 * Protected endpoint (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = projectSchema.parse(body)

    // Create project
    const project = await prisma.project.create({
      data: validatedData,
    })

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: 'Project created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('POST /api/projects error:', error)

    // Validation error
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create project',
      },
      { status: 500 }
    )
  }
}


