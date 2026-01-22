'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Project, Category } from '@/types'
import ProjectModal from '@/components/ProjectModal'

const categories: { value: Category | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Projects' },
  { value: 'WEB_APP', label: 'Web Apps' },
  { value: 'AI_TOOL', label: 'AI Tools' },
  { value: 'MOBILE_APP', label: 'Mobile Apps' },
  { value: 'SAAS', label: 'SaaS' },
  { value: 'EXPERIMENT', label: 'Experiments' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => p.category === selectedCategory))
    }
  }, [selectedCategory, projects])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (data.success) {
        setProjects(data.data)
        setFilteredProjects(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
    
    // Track analytics
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          eventType: 'MODAL_OPEN',
        }),
      })
    } catch (error) {
      console.error('Failed to track analytics:', error)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-50">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-light tracking-tight">
              Studio<span className="text-blue-600">.</span>
            </Link>
            <Link 
              href="/" 
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </nav>

        {/* Content */}
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-5xl font-light text-neutral-900 mb-4">Our Work</h1>
              <p className="text-lg text-neutral-600 max-w-2xl">
                Explore our portfolio of production-ready applications and tools.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900" />
                <p className="text-neutral-600 mt-4">Loading projects...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <p className="text-neutral-600">No projects found in this category.</p>
              </div>
            )}

            {/* Projects Grid */}
            {!loading && filteredProjects.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className="group cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden mb-4">
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={project.images[0]}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-5xl font-light">
                          {project.name.charAt(0)}
                        </div>
                      )}
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-300" />
                      
                      {/* Featured Badge */}
                      {project.isFeatured && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                        {project.tagline}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.techStack.slice(0, 3).map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-xs px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}