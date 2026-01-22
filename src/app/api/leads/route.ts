import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all leads (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: leads,
    })
  } catch (error: any) {
    console.error('GET /api/leads error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

// POST create new lead (public - from contact form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, projectId } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        projectId: projectId || null,
        status: 'NEW',
      },
    })

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead created successfully',
    })
  } catch (error: any) {
    console.error('POST /api/leads error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}