"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { useFormValidation } from "@/hooks/useFormValidation"
import { templateCategories } from "@/lib/data"
import PromptEditor from "@/components/PromptEditor"

export default function CreateTemplatePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Структурирование")
  const [tags, setTags] = useState("")
  const [saved, setSaved] = useState(false)

  const { errors, touched, validate, validateSingle, touchField } =
    useFormValidation({
      title: {
        required: true,
        minLength: 3,
        maxLength: 100,
      },
      description: {
        required: true,
        minLength: 10,
        maxLength: 500,
      },
    })

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value)
    validateSingle("title", value)
  }, [validateSingle])

  const handleDescriptionChange = useCallback((value: string) => {
    setDescription(value)
    validateSingle("description", value)
  }, [validateSingle])

  const handleEditorSave = useCallback((_editorTitle: string, _text: string) => {
    const isValidForm = validate({ title, description })
    touchField("title")
    touchField("description")

    if (isValidForm) {
      const templateData = {
        id: `t-custom-${Date.now()}`,
        title,
        description,
        content: _text,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        author: "Иван Петров",
        uses: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }

      const existing = JSON.parse(localStorage.getItem("customTemplates") || "[]")
      existing.push(templateData)
      localStorage.setItem("customTemplates", JSON.stringify(existing))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }, [title, description, category, tags, validate, touchField])

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <Link
          href="/profile/my-templates"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к моим шаблонам
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Создание шаблона</h1>

        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700" role="status" aria-live="polite">
            <CheckCircle className="h-4 w-4" />
            Шаблон сохранён
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Информация о шаблоне</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="tpl-title" className="block text-sm font-medium text-gray-700 mb-1">
                Название <span className="text-red-500">*</span>
              </label>
              <input
                id="tpl-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => touchField("title")}
                placeholder="Название шаблона (минимум 3 символа)..."
                className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 transition-colors ${
                  errors.title && touched.title
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-violet-500"
                }`}
                aria-describedby={errors.title && touched.title ? "tpl-title-error" : undefined}
                aria-invalid={!!(errors.title && touched.title)}
              />
              {errors.title && touched.title && (
                <p id="tpl-title-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="tpl-description" className="block text-sm font-medium text-gray-700 mb-1">
                Описание <span className="text-red-500">*</span>
              </label>
              <textarea
                id="tpl-description"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onBlur={() => touchField("description")}
                placeholder="Опишите для чего этот шаблон (минимум 10 символов)..."
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 transition-colors resize-none ${
                  errors.description && touched.description
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-violet-500"
                }`}
                aria-describedby={errors.description && touched.description ? "tpl-desc-error" : undefined}
                aria-invalid={!!(errors.description && touched.description)}
              />
              {errors.description && touched.description && (
                <p id="tpl-desc-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tpl-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  id="tpl-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors bg-white"
                >
                  {templateCategories.filter((c) => c !== "Все").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tpl-tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Теги
                </label>
                <input
                  id="tpl-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Через запятую: CoT, Рассуждение"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Текст шаблона</h2>
          <PromptEditor
            initialTitle={title}
            initialText=""
            onSave={handleEditorSave}
            saveLabel="Сохранить шаблон"
          />
        </div>
      </div>
    </div>
  )
}
