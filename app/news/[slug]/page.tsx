import { createClient } from '@/utils/supabase-server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata as NextMetadata } from "next/types"

interface Params {
  slug: string
}

export type Metadata = NextMetadata;

export const revalidate = 60

export default async function NewsPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params
  const supabase = createClient()
  
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!news) {
    notFound()
  }

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
              priority
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
              {news.content.split('\n').map((paragraph: string, index: number) => (
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

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = createClient()
  
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!news) {
    return {
      title: 'Новость не найдена',
    }
  }

  return {
    title: news.title,
    description: news.content.slice(0, 160),
    openGraph: {
      title: news.title,
      description: news.content.slice(0, 160),
      images: [news.cover_image],
    },
  }
}