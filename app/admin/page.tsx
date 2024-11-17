'use client'

import NewsEditor from '../../components/NewsEditor'
import NewsManager from '../../components/NewsManager'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) {
      router.push('/login')
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    router.push('/login')
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Панель администратора</h1>
              <p className="text-gray-400 text-sm">Управление новостями</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                На главную
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Создать новость
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'manage'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Управление новостями
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          {activeTab === 'create' ? (
            <>
              <h2 className="text-xl font-semibold mb-6">Добавить новую новость</h2>
              <NewsEditor />
            </>
          ) : (
            <NewsManager />
          )}
        </div>
      </main>
    </div>
  )
} 