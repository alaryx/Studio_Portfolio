'use client'

import { useState, useEffect } from 'react'

interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string | null
  education?: string | null
  experience?: string | null
  skills: string[]
  photoUrl?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  twitterUrl?: string | null
}

interface CompanySettings {
  companyEmail: string
  companyName?: string | null
}

export default function TeamContactSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Contact form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [teamRes, settingsRes] = await Promise.all([
        fetch('/api/team?active=true'),
        fetch('/api/settings'),
      ])
      
      const teamData = await teamRes.json()
      const settingsData = await settingsRes.json()
      
      if (teamData.success) setTeamMembers(teamData.data)
      if (settingsData.success) setSettings(settingsData.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setName('')
        setEmail('')
        setMessage('')
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(data.error || 'Failed to send message')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-neutral-50">
      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-1.5 bg-blue-50 rounded-full">
                <span className="text-xs font-medium text-blue-700 tracking-wide">
                  OUR TEAM
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4">
                Meet the people behind the work
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                A talented group of developers, designers, and problem solvers
              </p>
            </div>

            {/* Team Members */}
            <div className="space-y-16">
              {teamMembers.map((member, index) => {
                const isEven = index % 2 === 0
                
                return (
                  <div
                    key={member.id}
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                  >
                    {/* Photo */}
                    <div className="w-full lg:w-5/12">
                      <div className="relative aspect-square bg-neutral-200 rounded-2xl overflow-hidden group">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-6xl font-light">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <div className="flex gap-3">
                            {member.githubUrl && (
                              <a
                                href={member.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                              </a>
                            )}
                            {member.linkedinUrl && (
                              <a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                              </a>
                            )}
                            {member.twitterUrl && (
                              <a
                                href={member.twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="w-full lg:w-7/12">
                      <div className="space-y-6">
                        {/* Name & Role */}
                        <div>
                          <h3 className="text-3xl font-medium text-neutral-900 mb-2">
                            {member.name}
                          </h3>
                          <p className="text-lg text-blue-600 font-medium">{member.role}</p>
                        </div>

                        {/* Bio */}
                        {member.bio && (
                          <p className="text-neutral-700 leading-relaxed">{member.bio}</p>
                        )}

                        {/* Education */}
                        {member.education && (
                          <div>
                            <h4 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                              Education
                            </h4>
                            <p className="text-neutral-700">{member.education}</p>
                          </div>
                        )}

                        {/* Experience */}
                        {member.experience && (
                          <div>
                            <h4 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                              Experience
                            </h4>
                            <p className="text-neutral-700">{member.experience}</p>
                          </div>
                        )}

                        {/* Skills */}
                        {member.skills.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                              Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {member.skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm rounded-lg"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Info */}
            <div>
              <div className="inline-block mb-4 px-4 py-1.5 bg-blue-50 rounded-full">
                <span className="text-xs font-medium text-blue-700 tracking-wide">
                  GET IN TOUCH
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-6">
                Let's work together
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Have a project in mind? We'd love to hear about it. Drop us a message
                and let's create something remarkable together.
              </p>
              
              {settings?.companyEmail && (
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Email us at</p>
                    <a
                      href={`mailto:${settings.companyEmail}`}
                      className="text-neutral-900 font-medium hover:text-blue-600 transition-colors"
                    >
                      {settings.companyEmail}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Form */}
            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
              <h3 className="text-2xl font-medium text-neutral-900 mb-6">Send us a message</h3>
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}