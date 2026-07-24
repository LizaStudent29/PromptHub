"use client"

import { useState, useCallback } from "react"
import { Save, Copy, RotateCcw, Wand2, Eye, AlertCircle, CheckCircle } from "lucide-react"
import { useFormValidation } from "@/hooks/useFormValidation"

export default function EditorPage() {
  const [promptTitle, setPromptTitle] = useState("")
  const [promptText, setPromptText] = useState("")
  const [saved, setSaved] = useState(false)

  const { errors, touched, validate, validateSingle, touchField, isValid } =
    useFormValidation({
      title: {
        required: true,
        minLength: 3,
        maxLength: 100,
      },
      text: {
        required: true,
        minLength: 10,
      },
    })

  const handleTitleChange = (value: string) => {
    setPromptTitle(value)
    if (touched.title) validateSingle("title", value)
    setSaved(false)
  }

  const handleTextChange = (value: string) => {
    setPromptText(value)
    if (touched.text) validateSingle("text", value)
    setSaved(false)
  }

  const handleSave = useCallback(() => {
    const isValidForm = validate({ title: promptTitle, text: promptText })
    touchField("title")
    touchField("text")

    if (isValidForm) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }, [promptTitle, promptText, validate, touchField])

  const handleNew = () => {
    setPromptTitle("")
    setPromptText("")
    setSaved(false)
  }

  const handleCopy = () => {
    if (promptText) navigator.clipboard.writeText(promptText)
  }

  const handleFormat = () => {
    const lines = promptText.split("\n")
    const formatted = lines
      .map((line) => {
        if (line.trim() === "") return line
        if (/^\d+\./.test(line)) return line
        if (line.startsWith("#")) return line
        if (line.startsWith("-") || line.startsWith("*")) return line
        return line
      })
      .join("\n")
    setPromptText(formatted)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Редактор промптов</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Название промпта (минимум 3 символа)..."
            value={promptTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={() => touchField("title")}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-lg font-medium focus:outline-none focus:ring-2 transition-colors ${
              errors.title && touched.title
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-200 focus:ring-violet-500"
            }`}
          />
          {errors.title && touched.title && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.title}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button onClick={handleNew} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Новый
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isValid
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
          <button onClick={handleCopy} disabled={!promptText} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
            <Copy className="w-4 h-4" />
            Копировать
          </button>
          <button onClick={handleNew} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Сбросить
          </button>
          <button onClick={handleFormat} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Wand2 className="w-4 h-4" />
            Форматировать
          </button>
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            Промпт сохранён
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Редактор
            </div>
            <textarea
              placeholder="Введите текст промпта (минимум 10 символов)..."
              value={promptText}
              onChange={(e) => handleTextChange(e.target.value)}
              onBlur={() => touchField("text")}
              className={`w-full h-96 p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none ${
                errors.text && touched.text ? "bg-red-50" : ""
              }`}
            />
            {errors.text && touched.text && (
              <div className="border-t border-red-200 bg-red-50 px-4 py-2">
                <p className="flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.text}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <Eye className="w-3 h-3" />
              Предпросмотр
            </div>
            <div className="h-96 p-4 overflow-auto">
              {promptText ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700 font-mono">
                  {promptText}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Начните вводить текст промпта слева...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
