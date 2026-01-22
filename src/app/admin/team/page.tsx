'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface TeamMember {
  id: string
  name: string
  role: string
  photoUrl?: string | null
  order: number
  isActive: boolean
}

export default function AdminTeamPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchMembers()
    }
  }, [status, router])

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/team')
      const data = await res.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setMembers(members.filter(m => m.id !== id))
      } else {
        alert('Failed to delete team member')
      }
    } catch (error) {
      alert('Error deleting team member')
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
            <h1 className="text-2xl font-light text-neutral-900">Team Management</h1>
            <p className="text-sm text-neutral-600">{members.length} team members</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/settings"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Settings
            </Link>
            <Link
              href="/admin/team/new"
              className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              + Add Member
            </Link>
          </div>
        </div>
      </header>

      {/* Team Members */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-600 mb-4">No team members yet</p>
            <Link
              href="/admin/team/new"
              className="inline-flex px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Add your first team member
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Photo */}
                <div className="relative aspect-square bg-neutral-100">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-5xl font-light">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  {!member.isActive && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-neutral-900 text-white text-xs font-medium rounded-full">
                      Inactive
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">{member.role}</p>
                  
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/team/${member.id}/edit`}
                      className="flex-1 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-sm font-medium rounded-lg transition-colors text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(member.id)}
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