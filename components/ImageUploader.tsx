'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import Image from 'next/image'

interface ImageUploaderProps {
  onUploadComplete?: (imageUrl: string) => void;
  currentImage?: string;
  onImageRemove?: () => void;
}

export default function ImageUploader({ onUploadComplete, currentImage, onImageRemove }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [imagePath, setImagePath] = useState<string | null>(currentImage || null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Вы должны выбрать изображение для загрузки')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      setImagePath(publicUrl)
      
      if (onUploadComplete) {
        onUploadComplete(publicUrl)
      }
    } catch (error) {
      alert('Ошибка загрузки изображения!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setImagePath(null)
    if (onImageRemove) {
      onImageRemove()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {imagePath ? (
        <div className="relative">
          <Image
            src={imagePath}
            alt="Изображение"
            width={320}
            height={240}
            className="rounded shadow-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
          {uploading ? 'Загрузка...' : 'Загрузить изображение'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
} 