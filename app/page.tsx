import { createClient } from '@/utils/supabase-server'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

export default async function Home() {
  const supabase = createClient()
  
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  console.log('Rendering on server at:', new Date().toISOString())

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Daily News
              </h1>
              <p className="text-gray-600 text-sm">Актуальные новости каждый день</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news?.map((item) => (
            <Link href={`/news/${item.slug}`} key={item.id}>
              <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video relative">
                  <Image
                    src={item.cover_image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.content}
                  </p>
                  <div className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">© 2024 Daily News. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
