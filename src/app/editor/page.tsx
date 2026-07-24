"use client"

import PromptEditor from "@/components/PromptEditor"

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Редактор промптов</h1>
        <PromptEditor />
      </div>
    </div>
  )
}
