'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Lead {
  id: string
  name: string
  email: string
  message: string
  status: 'NEW' | 'CONTACTED' | 'CLOSED'
  createdAt: string
  updatedAt: string
  projectId?: string | null
  project?: {
    name: string
  } | null
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchLeads()
    }
  }, [status, router])

  useEffect(() => {
    if (selectedStatus === 'ALL') {
      setFilteredLeads(leads)
    } else {
      setFilteredLeads(leads.filter(l => l.status === selectedStatus))
    }
  }, [selectedStatus, leads])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      if (data.success) {
        setLeads(data.data)
        setFilteredLeads(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(true)
    try {
      console.log('Updating lead:', leadId, 'to status:', newStatus)
      
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      console.log('Response status:', res.status)
      const data = await res.json()
      console.log('Response data:', data)

      if (data.success) {
        // Update local state
        setLeads(leads.map(l => 
          l.id === leadId ? { ...l, status: newStatus as any } : l
        ))
        setSelectedLead(null)
        alert('Lead status updated successfully!')
      } else {
        console.error('Update failed:', data)
        alert(`Failed to update: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
      alert('Error updating lead status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mb-4" />
          <p className="text-neutral-600">Loading leads...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const statusCounts = {
    ALL: leads.length,
    NEW: leads.filter(l => l.status === 'NEW').length,
    CONTACTED: leads.filter(l => l.status === 'CONTACTED').length,
    CLOSED: leads.filter(l => l.status === 'CLOSED').length,
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-neutral-900">Leads Management</h1>
            <p className="text-sm text-neutral-600">{leads.length} total leads</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              ← Dashboard
            </Link>
            <Link
              href="/admin/projects"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Projects
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-600 mb-1">All Leads</p>
            <p className="text-3xl font-light text-neutral-900">{statusCounts.ALL}</p>
          </div>
          <div className="bg-white rounded-xl border border-blue-200 p-4">
            <p className="text-sm text-blue-600 mb-1">New</p>
            <p className="text-3xl font-light text-blue-600">{statusCounts.NEW}</p>
          </div>
          <div className="bg-white rounded-xl border border-green-200 p-4">
            <p className="text-sm text-green-600 mb-1">Contacted</p>
            <p className="text-3xl font-light text-green-600">{statusCounts.CONTACTED}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-600 mb-1">Closed</p>
            <p className="text-3xl font-light text-neutral-600">{statusCounts.CLOSED}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {['ALL', 'NEW', 'CONTACTED', 'CLOSED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedStatus === status
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
            <p className="text-neutral-600">No leads found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Contact</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Project</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Message</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{lead.name}</p>
                          <p className="text-sm text-neutral-600">{lead.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-neutral-600">
                          {lead.project?.name || 'General Inquiry'}
                        </span>
                      </td>
                      <td className="py-4 px-6 max-w-md">
                        <p className="text-sm text-neutral-700 line-clamp-2">
                          {lead.message}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          lead.status === 'NEW' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                          lead.status === 'CONTACTED' ? 'bg-green-50 text-green-600 border border-green-200' :
                          'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-neutral-600">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {new Date(lead.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-neutral-900">Lead Details</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <p className="text-neutral-900 font-medium">{selectedLead.name}</p>
                  <p className="text-neutral-600">{selectedLead.email}</p>
                  <p className="text-sm text-neutral-500">
                    Submitted: {new Date(selectedLead.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Project */}
              {selectedLead.project && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                    Related Project
                  </h3>
                  <p className="text-neutral-900">{selectedLead.project.name}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                  Message
                </h3>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message}
                </p>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                  Update Status
                </h3>
                <div className="flex gap-3">
                  {['NEW', 'CONTACTED', 'CLOSED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateLeadStatus(selectedLead.id, status)}
                      disabled={updatingStatus || selectedLead.status === status}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedLead.status === status
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {updatingStatus && selectedLead.status !== status ? 'Updating...' : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="flex-1 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-center rounded-lg transition-colors"
                >
                  Send Email
                </a>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}