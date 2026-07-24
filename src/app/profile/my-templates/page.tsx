import Link from "next/link"
import { Plus } from "lucide-react"
import { templates } from "@/lib/data"

export default function MyTemplatesPage() {
  const myTemplates = templates.filter((t) => t.author === "Иван Петров")

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Мои шаблоны</h1>
          <Link
            href="/profile/my-templates/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Новый шаблон
          </Link>
        </div>

        {myTemplates.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">У вас пока нет шаблонов</p>
            <Link href="/profile/my-templates/create" className="text-blue-600 hover:underline text-sm">
              Создать первый шаблон
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTemplates.map((t) => (
              <Link
                key={t.id}
                href={`/templates/${t.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{t.description}</p>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                  {t.category}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
