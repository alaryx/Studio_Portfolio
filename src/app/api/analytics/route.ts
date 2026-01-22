import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyticsSchema } from '@/lib/validations'
import { anonymizeIp } from '@/lib/utils'

/**
 * POST /api/analytics
 * Track analytics event
 * Public endpoint (no auth required)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = analyticsSchema.parse(body)

    // Get visitor info
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create analytics event
    await prisma.analytics.create({
      data: {
        projectId: validatedData.projectId,
        eventType: validatedData.eventType,
        visitorIp: anonymizeIp(ip), // GDPR-compliant IP anonymization
        userAgent: userAgent.substring(0, 255), // Truncate to fit DB
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Event tracked',
    })
  } catch (error: any) {
    console.error('POST /api/analytics error:', error)

    // Don't expose detailed errors for public endpoint
    // Just log and return generic error
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track event',
      },
      { status: 400 }
    )
  }
}