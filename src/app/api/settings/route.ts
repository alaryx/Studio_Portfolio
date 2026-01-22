// File 3: src/app/api/settings/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET company settings
export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.companySettings.findFirst()

    // Create default if doesn't exist
    if (!settings) {
      settings = await prisma.companySettings.create({
        data: {
          companyEmail: 'hello@studio.com',
          companyName: 'Studio',
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error: any) {
    console.error('GET /api/settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT update company settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Get or create settings
    let settings = await prisma.companySettings.findFirst()

    if (settings) {
      settings = await prisma.companySettings.update({
        where: { id: settings.id },
        data: {
          companyEmail: body.companyEmail,
          companyName: body.companyName || null,
        },
      })
    } else {
      settings = await prisma.companySettings.create({
        data: {
          companyEmail: body.companyEmail,
          companyName: body.companyName || null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error: any) {
    console.error('PUT /api/settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}