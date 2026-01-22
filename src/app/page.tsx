'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Project } from '@/types'
import ProjectModal from '@/components/ProjectModal'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import TeamContactSection from '@/components/TeamContactSection'

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchFeaturedProjects()
  }, [])

  const fetchFeaturedProjects = async () => {
    try {
      const res = await fetch('/api/projects?featured=true')
      const data = await res.json()
      if (data.success) {
        setFeaturedProjects(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch featured projects:', error)
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
            <div className="flex items-center gap-8">
              <Link href="/projects" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Work
              </Link>
              <a href="#contact" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl">
              <div className="inline-block mb-4 px-4 py-1.5 bg-blue-50 rounded-full">
                <span className="text-xs font-medium text-blue-700 tracking-wide">
                  SOFTWARE DEVELOPMENT
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-light leading-[1.1] mb-6 text-neutral-900">
                We build software<br />
                that <span className="italic font-serif">actually works</span>
              </h1>
              <p className="text-xl text-neutral-600 leading-relaxed mb-8 max-w-2xl">
                Production-ready web applications, AI tools, and SaaS platforms.
                Built with precision, shipped with confidence.
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors group"
              >
                <span>View our work</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Projects Slider */}
        {featuredProjects.length > 0 && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto mb-12">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-12 bg-neutral-300" />
                <span className="text-xs font-medium text-neutral-500 tracking-wider uppercase">
                  Featured Work
                </span>
              </div>
              <h2 className="text-4xl font-light text-neutral-900">
                Projects we're proud of
              </h2>
            </div>

            <div className="max-w-7xl mx-auto">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="featured-slider"
              >
                {featuredProjects.map((project) => (
                  <SwiperSlide key={project.id}>
                    <div
                      onClick={() => handleProjectClick(project)}
                      className="group cursor-pointer"
                    >
                      {/* Project Image/Video */}
                      <div className="relative aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden mb-4">
                        {project.videoUrl ? (
                          <video
                            src={project.videoUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : project.images && project.images.length > 0 ? (
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
                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                          Featured
                        </div>
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
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        )}

        {/* All Projects Preview */}
        <section id="projects" className="py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-light text-neutral-900 mb-4">
              More projects
            </h2>
            <p className="text-neutral-600 mb-8">
              Explore our complete portfolio of work
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <span>View all projects</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <TeamContactSection/>

        {/* Footer with Hidden Admin Access */}
        <footer className="bg-neutral-900 border-t border-neutral-800 py-8 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-neutral-500">
            <p>© 2026 Studio. All rights reserved.</p>
            {/* Hidden Admin Access - Click 3 times on copyright to reveal */}
            <div className="relative group">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Link 
                  href="/login" 
                  className="text-neutral-700 hover:text-neutral-400 transition-colors text-xs"
                >
                  •
                </Link>
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Slider Styles */}
      <style jsx global>{`
        .featured-slider .swiper-button-next,
        .featured-slider .swiper-button-prev {
          color: #171717;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .featured-slider .swiper-button-next:after,
        .featured-slider .swiper-button-prev:after {
          font-size: 16px;
        }
        .featured-slider .swiper-pagination-bullet {
          background: #a3a3a3;
        }
        .featured-slider .swiper-pagination-bullet-active {
          background: #171717;
        }
      `}</style>
    </>
  )
}