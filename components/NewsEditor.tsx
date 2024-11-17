'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import ImageUploader from './ImageUploader'
import { slugify } from '@/utils/slugify'

interface News {
  id?: string
  title: string
  content: string
  cover_image: string
  created_at?: string
  slug: string
}

interface NewsEditorProps {
  newsId?: string
  onSave?: () => void
  onCancel?: () => void
}

export default function NewsEditor({ newsId, onSave, onCancel }: NewsEditorProps) {
  const [news, setNews] = useState<News>({
    title: '',
    content: '',
    cover_image: '',
    slug: ''
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (newsId) {
      loadNews(newsId)
    }
  }, [newsId])

  async function loadNews(id: string) {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setNews(data)
      }
    } catch (error) {
      console.error('Ошибка при загрузке новости:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    setNews(prev => ({
      ...prev,
      cover_image: imageUrl
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const newsSlug = slugify(news.title)
      
      if (newsId) {
        // Обновление существующей новости
        const { error } = await supabase
          .from('news')
          .update({
            title: news.title,
            content: news.content,
            cover_image: news.cover_image,
            slug: newsSlug
          })
          .eq('id', newsId)

        if (error) throw error
        alert('Новость обновлена!')
      } else {
        // Создание новой новости
        const { error } = await supabase
          .from('news')
          .insert([{
            title: news.title,
            content: news.content,
            cover_image: news.cover_image,
            slug: newsSlug
          }])

        if (error) throw error
        alert('Новость опубликована!')
      }

      setNews({ title: '', content: '', cover_image: '', slug: '' })
      if (onSave) onSave()
    } catch (error) {
      console.error('Ошибка при сохранении:', error)
      alert('Ошибка при сохранении новости')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Обложка новости
        </label>
        <ImageUploader 
          onUploadComplete={handleImageUpload}
          currentImage={news.cover_image}
          onImageRemove={() => setNews(prev => ({ ...prev, cover_image: '' }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Заголовок новости
        </label>
        <input
          type="text"
          placeholder="Введите заголовок"
          value={news.title}
          onChange={(e) => setNews({ ...news, title: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Текст новости
        </label>
        <textarea
          placeholder="Введите текст новости"
          value={news.content}
          onChange={(e) => setNews({ ...news, content: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[200px]"
          required
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving || !news.cover_image}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {saving ? 'Сохранение...' : (newsId ? 'Обновить новость' : 'Опубликовать новость')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  )
} 