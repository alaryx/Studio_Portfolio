import { createClient } from '@supabase/supabase-js'

// Supabase client for file storage (images/videos)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Storage bucket name for project files
export const STORAGE_BUCKET = 'projects'

/**
 * Upload file to Supabase Storage
 * @param file - File to upload
 * @param path - Storage path (e.g., 'project-id/image.jpg')
 * @returns Public URL of uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path)

  return publicUrl
}

/**
 * Delete file from Supabase Storage
 * @param path - Storage path to delete
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

/**
 * Delete multiple files from Supabase Storage
 * @param paths - Array of storage paths to delete
 */
export async function deleteFiles(paths: string[]): Promise<void> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(paths)

  if (error) {
    throw new Error(`Batch delete failed: ${error.message}`)
  }
}