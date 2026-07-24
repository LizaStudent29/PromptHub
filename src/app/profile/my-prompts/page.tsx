"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import PromptCard from "@/components/PromptCard"
import { prompts } from "@/lib/data"

export default function MyPromptsPage() {
  const myPrompts = prompts.filter((p) => p.author === "Иван Петров")

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Мои промпты</h1>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Новый промпт
          </Link>
        </div>

        {myPrompts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">У вас пока нет промптов</p>
            <Link href="/editor" className="text-blue-600 hover:underline text-sm">
              Создать первый промпт
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
