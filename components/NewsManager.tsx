'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import NewsEditor from './NewsEditor'
import { slugify } from '@/utils/slugify'
import Image from 'next/image'

interface News {
  id: string
  title: string
  content: string
  cover_image: string
  created_at: string
}

export default function NewsManager() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadNews()
    updateSlugsForExistingNews()
  }, [])

  async function loadNews() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNews(data || [])
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteNews(id: string, imageUrl: string) {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) return

    try {
      // Удаляем изображение из storage
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop() // Получаем имя файла из URL
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('images')
            .remove([fileName])

          if (storageError) {
            console.error('Ошибка при удалении изображения:', storageError)
          }
        }
      }

      // Удаляем запись из базы данных
      const { error: dbError } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      setNews(news.filter(item => item.id !== id))
      alert('Новость успешно удалена')
    } catch (error) {
      console.error('Ошибка при удалении новости:', error)
      alert('Ошибка при удалении новости')
    }
  }

  async function updateSlugsForExistingNews() {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .is('slug', null)

      if (error) throw error
      
      if (data) {
        for (const item of data) {
          const { error: updateError } = await supabase
            .from('news')
            .update({ slug: slugify(item.title) })
            .eq('id', item.id)

          if (updateError) {
            console.error('Ошибка при обновлении slug:', updateError)
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при обновлении slugs:', error)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  if (editingId) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">Редактирование новости</h2>
        <NewsEditor 
          newsId={editingId}
          onSave={() => {
            setEditingId(null)
            loadNews()
          }}
          onCancel={() => setEditingId(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Управление новостями</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Заголовок
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Image
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                      src={item.cover_image}
                      alt=""
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => deleteNews(item.id, item.cover_image)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 