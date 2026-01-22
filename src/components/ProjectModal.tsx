'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project } from '@/types'

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden"
          >
            <div className="h-full bg-white rounded-2xl shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-200">
                <div>
                  <h2 className="text-2xl font-light text-neutral-900">{project.name}</h2>
                  <p className="text-sm text-neutral-600 mt-1">{project.tagline}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-neutral-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid lg:grid-cols-2 gap-8 p-8">
                  <div className="space-y-6">
                    {project.images && project.images.length > 0 ? (
                      <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                        <img
                          src={project.images[0]}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-4xl font-light">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {project.images && project.images.length > 1 && (
                      <div className="grid grid-cols-3 gap-4">
                        {project.images.slice(1, 4).map((img: string, i: number) => (
                          <div key={i} className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                            <img src={img} alt={`Screenshot ${i + 2}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {project.videoUrl && (
                      <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                        <video src={project.videoUrl} controls className="w-full h-full" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                        About
                      </h3>
                      <p className="text-neutral-700 leading-relaxed">{project.description}</p>
                    </div>

                    {project.problem && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                          Problem
                        </h3>
                        <p className="text-neutral-700 leading-relaxed">{project.problem}</p>
                      </div>
                    )}

                    {project.solution && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                          Solution
                        </h3>
                        <p className="text-neutral-700 leading-relaxed">{project.solution}</p>
                      </div>
                    )}

                    {project.targetAudience && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                          Who it is for
                        </h3>
                        <p className="text-neutral-700 leading-relaxed">{project.targetAudience}</p>
                      </div>
                    )}

                    {project.features && project.features.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                          Key Features
                        </h3>
                        <ul className="space-y-2">
                          {project.features.map((feature: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-neutral-700">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-3">
                        Technology Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-sm rounded-lg"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-center rounded-lg transition-colors"
                        >
                          View Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 border border-neutral-300 hover:border-neutral-400 text-neutral-900 rounded-lg transition-colors"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}