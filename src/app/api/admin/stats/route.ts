import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all stats in parallel for performance
    const [
      totalProjects,
      totalViews,
      totalLeads,
      newLeads,
      githubClicks,
      liveClicks,
      contactClicks,
      recentLeads,
      topProjects,
    ] = await Promise.all([
      // Total projects count
      prisma.project.count(),

      // Total views (VIEW events)
      prisma.analytics.count({
        where: { eventType: 'VIEW' },
      }),

      // Total leads
      prisma.lead.count(),

      // New leads in last 30 days
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // GitHub clicks
      prisma.analytics.count({
        where: { eventType: 'GITHUB_CLICK' },
      }),

      // Live demo clicks
      prisma.analytics.count({
        where: { eventType: 'LIVE_CLICK' },
      }),

      // Contact clicks
      prisma.analytics.count({
        where: { eventType: 'CONTACT_CLICK' },
      }),

      // Recent 5 leads
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: { name: true },
          },
        },
      }),

      // Top 5 projects by views
      prisma.project.findMany({
        take: 5,
        orderBy: {
          analytics: {
            _count: 'desc',
          },
        },
        include: {
          _count: {
            select: {
              analytics: {
                where: { eventType: 'VIEW' },
              },
            },
          },
        },
      }),
    ])

    // Format top projects data
    const formattedTopProjects = await Promise.all(
      topProjects.map(async (project) => {
        const clicks = await prisma.analytics.count({
          where: {
            projectId: project.id,
            eventType: {
              in: ['GITHUB_CLICK', 'LIVE_CLICK'],
            },
          },
        })

        return {
          id: project.id,
          name: project.name,
          views: project._count.analytics,
          clicks,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        totalViews,
        totalLeads,
        newLeads,
        githubClicks,
        liveClicks,
        contactClicks,
        recentLeads,
        topProjects: formattedTopProjects,
      },
    })
  } catch (error: any) {
    console.error('GET /api/admin/stats error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stats',
      },
      { status: 500 }
    )
  }
}