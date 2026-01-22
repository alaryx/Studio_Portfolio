// File 2: src/app/api/team/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single team member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id: params.id },
    })

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: member,
    })
  } catch (error: any) {
    console.error('GET /api/team/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team member' },
      { status: 500 }
    )
  }
}

// PUT update team member (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const member = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        name: body.name,
        role: body.role,
        bio: body.bio || null,
        education: body.education || null,
        experience: body.experience || null,
        skills: body.skills || [],
        photoUrl: body.photoUrl || null,
        githubUrl: body.githubUrl || null,
        linkedinUrl: body.linkedinUrl || null,
        twitterUrl: body.twitterUrl || null,
        order: body.order,
        isActive: body.isActive,
      },
    })

    return NextResponse.json({
      success: true,
      data: member,
    })
  } catch (error: any) {
    console.error('PUT /api/team/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE team member (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.teamMember.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Team member deleted',
    })
  } catch (error: any) {
    console.error('DELETE /api/team/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}