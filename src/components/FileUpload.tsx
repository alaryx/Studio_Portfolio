'use client'

import { useState, useRef } from 'react'

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  accept?: string
  maxSize?: number
  type?: 'image' | 'video' | 'any'
}

export default function FileUpload({ 
  onUploadComplete, 
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  type = 'image'
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptString = () => {
    if (accept) return accept
    if (type === 'image') return 'image/jpeg,image/jpg,image/png,image/webp,image/gif'
    if (type === 'video') return 'video/mp4,video/webm,video/quicktime'
    return 'image/*,video/*'
  }

  const handleFile = async (file: File) => {
    setError('')
    setUploading(true)
    setProgress(0)

    try {
      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`)
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload with progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      onUploadComplete(data.data.url)
      
      // Reset after success
      setTimeout(() => {
        setProgress(0)
        setUploading(false)
      }, 500)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      setUploading(false)
      setProgress(0)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
        onChange={handleChange}
        className="hidden"
        disabled={uploading}
      />

      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 hover:border-neutral-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {uploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-neutral-600">Uploading... {progress}%</p>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-600">
                <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {type === 'image' && 'JPEG, PNG, WebP, GIF (max 10MB)'}
                {type === 'video' && 'MP4, WebM (max 50MB)'}
                {type === 'any' && 'Images or videos'}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}