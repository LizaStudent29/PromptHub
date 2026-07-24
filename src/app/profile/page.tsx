import Link from "next/link"
import { FileText, Layout, Settings } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Личный кабинет</h1>

        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              ИП
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Иван Петров</h2>
              <p className="text-gray-500">ivan@example.com</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-500 mt-1">промптов</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-500 mt-1">шаблонов</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-sm text-gray-500 mt-1">избранных</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <Link
            href="/profile/my-prompts"
            className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900 font-medium">Мои промпты</span>
          </Link>
          <Link
            href="/profile/my-templates"
            className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
          >
            <Layout className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900 font-medium">Мои шаблоны</span>
          </Link>
          <Link
            href="/profile/settings"
            className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900 font-medium">Настройки</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
