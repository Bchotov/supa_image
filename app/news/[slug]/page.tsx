'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface News {
  id: string
  title: string
  content: string
  cover_image: string
  created_at: string
  slug: string
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function NewsPage({ params }: PageProps) {
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const resolvedParams = use(params)

  const loadNews = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .single()

      if (error) throw error
      if (data) {
        setNews(data)
      } else {
        throw new Error('Новость не найдена')
      }
    } catch (error) {
      console.error('Ошибка при загрузке новости:', error instanceof Error ? error.message : 'Неизвестная ошибка')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [resolvedParams.slug, router])

  useEffect(() => {
    loadNews()
  }, [loadNews])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!news) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Daily News
              </h1>
              <p className="text-gray-600 text-sm">Актуальные новости каждый день</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Назад к новостям
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video relative">
            <Image
              src={news.cover_image}
              alt={news.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
            <div className="text-gray-500 text-sm mb-6">
              {new Date(news.created_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div className="prose max-w-none">
              {news.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}