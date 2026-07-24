import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { templates } from "@/lib/data"

export function generateStaticParams() {
  return templates.map((t) => ({ template: t.id }))
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ template: string }>
}) {
  const { template: id } = await params
  const template = templates.find((t) => t.id === id)

  if (!template) notFound()

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к шаблонам
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{template.title}</h1>

          <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full mb-4">
            {template.category}
          </span>

          <p className="text-gray-600 leading-relaxed mb-6">{template.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {template.tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 border-t border-gray-100 pt-6">
            <span>Автор: <span className="text-gray-900 font-medium">{template.author}</span></span>
            <span>Использований: <span className="text-gray-900 font-medium">{template.uses}</span></span>
          </div>

          <Link
            href="/editor"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Использовать шаблон
          </Link>
        </div>
      </div>
    </div>
  )
}
