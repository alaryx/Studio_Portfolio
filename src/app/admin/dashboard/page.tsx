'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DashboardStats {
  totalProjects: number
  totalViews: number
  totalLeads: number
  newLeads: number
  githubClicks: number
  liveClicks: number
  contactClicks: number
  recentLeads: Array<{
    id: string
    name: string
    email: string
    message: string
    status: string
    createdAt: string
    project?: { name: string } | null
  }>
  topProjects: Array<{
    id: string
    name: string
    views: number
    clicks: number
  }>
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mb-4" />
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || !stats) return null

  // Prepare chart data
  const engagementData = [
    { name: 'GitHub', value: stats.githubClicks, color: '#3b82f6' },
    { name: 'Live Demo', value: stats.liveClicks, color: '#10b981' },
    { name: 'Contact', value: stats.contactClicks, color: '#f59e0b' },
  ]

  const projectsData = stats.topProjects.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    views: p.views,
    clicks: p.clicks,
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-neutral-900">Dashboard</h1>
              <p className="text-sm text-neutral-600">Welcome back, {session.user?.name}</p>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/admin/projects" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Projects
              </Link>
              <Link href="/admin/leads" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Leads
              </Link>
              <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                View Site
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <span className="text-xs font-medium text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
                Total
              </span>
            </div>
            <p className="text-sm text-neutral-600 mb-1">Projects</p>
            <p className="text-3xl font-light text-neutral-900">{stats.totalProjects}</p>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <span className="text-xs font-medium text-green-600 px-3 py-1 bg-green-50 rounded-full">
                Engagement
              </span>
            </div>
            <p className="text-sm text-neutral-600 mb-1">Total Views</p>
            <p className="text-3xl font-light text-neutral-900">{stats.totalViews.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <span className="text-xs font-medium text-purple-600 px-3 py-1 bg-purple-50 rounded-full">
                All Time
              </span>
            </div>
            <p className="text-sm text-neutral-600 mb-1">Total Leads</p>
            <p className="text-3xl font-light text-neutral-900">{stats.totalLeads}</p>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🆕</span>
              </div>
              <span className="text-xs font-medium text-orange-600 px-3 py-1 bg-orange-50 rounded-full">
                30 Days
              </span>
            </div>
            <p className="text-sm text-neutral-600 mb-1">New Leads</p>
            <p className="text-3xl font-light text-neutral-900">{stats.newLeads}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Projects Chart */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-6">Top Projects Performance</h2>
            {projectsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <Bar dataKey="views" fill="#3b82f6" name="Views" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="clicks" fill="#10b981" name="Clicks" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-neutral-500">
                No project data yet
              </div>
            )}
          </div>

          {/* Engagement Distribution */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-6">Engagement Distribution</h2>
            {(stats.githubClicks + stats.liveClicks + stats.contactClicks) > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-neutral-500">
                No engagement data yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-neutral-900">Recent Leads</h2>
            <Link 
              href="/admin/leads"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </Link>
          </div>
          
          {stats.recentLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Project</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-3 px-4 text-sm text-neutral-900">{lead.name}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">{lead.email}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {lead.project?.name || 'General'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          lead.status === 'NEW' ? 'bg-blue-50 text-blue-600' :
                          lead.status === 'CONTACTED' ? 'bg-green-50 text-green-600' :
                          'bg-neutral-100 text-neutral-600'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              No leads yet
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-4 p-5 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
                ➕
              </div>
              <div>
                <p className="text-neutral-900 font-medium group-hover:text-blue-600">Add Project</p>
                <p className="text-sm text-neutral-600">Create new showcase</p>
              </div>
            </Link>

            <Link
              href="/admin/projects"
              className="flex items-center gap-4 p-5 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-all group"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-2xl">
                📋
              </div>
              <div>
                <p className="text-neutral-900 font-medium group-hover:text-green-600">Manage Projects</p>
                <p className="text-sm text-neutral-600">Edit existing work</p>
              </div>
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-4 p-5 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
                📧
              </div>
              <div>
                <p className="text-neutral-900 font-medium group-hover:text-purple-600">View Leads</p>
                <p className="text-sm text-neutral-600">Check inquiries</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}