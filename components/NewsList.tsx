'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import Link from 'next/link'
import { slugify } from '@/utils/slugify'
import Image from 'next/image'

interface News {
  id: string
  title: string
  content: string
  cover_image: string
  created_at: string
  slug: string
}

export default function NewsList() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNews()
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map(item => (
        <Link href={`/news/${slugify(item.title)}`} key={item.id}>
          <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
            <div className="aspect-[16/9] relative">
              <Image
                src={item.cover_image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                {truncateText(item.content, 150)}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <time className="text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
                <span className="text-blue-600 text-sm hover:text-blue-800">
                  Читать далее →
                </span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
} 