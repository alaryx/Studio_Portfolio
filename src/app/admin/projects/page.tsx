'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Project } from '@/types'

export default function AdminProjectsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchProjects()
    }
  }, [status, router])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setProjects(projects.filter(p => p.id !== id))
      } else {
        alert('Failed to delete project')
      }
    } catch (error) {
      alert('Error deleting project')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-neutral-900">Manage Projects</h1>
            <p className="text-sm text-neutral-600">{projects.length} total projects</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/projects/new"
              className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              + New Project
            </Link>
          </div>
        </div>
      </header>

      {/* Projects List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-600 mb-4">No projects yet</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-video bg-neutral-100">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-4xl font-light">
                      {project.name.charAt(0)}
                    </div>
                  )}
                  {project.isFeatured && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {project.tagline}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
                      {project.category.replace('_', ' ')}
                    </span>
                    {project._count && (
                      <span className="text-xs text-neutral-500">
                        {project._count.analytics} views
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="flex-1 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-sm font-medium rounded-lg transition-colors text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}