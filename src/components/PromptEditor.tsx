"use client"

import { useState, useCallback, useEffect } from "react"
import { Save, Copy, RotateCcw, Wand2, Eye, AlertCircle, CheckCircle } from "lucide-react"
import { useFormValidation } from "@/hooks/useFormValidation"
import { PromptHighlight } from "@/components/PromptHighlight"

interface PromptEditorProps {
  initialTitle?: string
  initialText?: string
  onSave?: (title: string, text: string) => void
  saveLabel?: string
}

export default function PromptEditor({
  initialTitle = "",
  initialText = "",
  onSave,
  saveLabel = "Сохранить",
}: PromptEditorProps) {
  const [promptTitle, setPromptTitle] = useState(initialTitle)
  const [promptText, setPromptText] = useState(initialText)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPromptTitle(initialTitle)
    setPromptText(initialText)
  }, [initialTitle, initialText])

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

  useEffect(() => {
    validate({ title: promptTitle, text: promptText })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTitleChange = useCallback((value: string) => {
    setPromptTitle(value)
    validateSingle("title", value)
    setSaved(false)
  }, [validateSingle])

  const handleTextChange = useCallback((value: string) => {
    setPromptText(value)
    validateSingle("text", value)
    setSaved(false)
  }, [validateSingle])

  const handleSave = useCallback(() => {
    const isValidForm = validate({ title: promptTitle, text: promptText })
    touchField("title")
    touchField("text")

    if (isValidForm) {
      if (onSave) {
        onSave(promptTitle, promptText)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }, [promptTitle, promptText, validate, touchField, onSave])

  const handleNew = useCallback(() => {
    setPromptTitle("")
    setPromptText("")
    setSaved(false)
  }, [])

  const handleCopy = useCallback(() => {
    if (promptText) navigator.clipboard.writeText(promptText)
  }, [promptText])

  const handleFormat = useCallback(() => {
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
  }, [promptText])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="editor-title" className="sr-only">Название промпта</label>
        <input
          id="editor-title"
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
          aria-describedby={errors.title && touched.title ? "title-error" : undefined}
          aria-invalid={!!(errors.title && touched.title)}
        />
        {errors.title && touched.title && (
          <p id="title-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
            <AlertCircle className="h-4 w-4" />
            {errors.title}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
          {saveLabel}
        </button>
        <button onClick={handleCopy} disabled={!promptText} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
          <Copy className="w-4 h-4" />
          Копировать
        </button>
        <button onClick={handleFormat} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Wand2 className="w-4 h-4" />
          Форматировать
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700" role="status" aria-live="polite">
          <CheckCircle className="h-4 w-4" />
          Промпт сохранён
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-green-400" aria-hidden="true"></span>
            Редактор
          </div>
          <label htmlFor="editor-text" className="sr-only">Текст промпта</label>
          <textarea
            id="editor-text"
            placeholder="Введите текст промпта (минимум 10 символов)..."
            value={promptText}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => touchField("text")}
            className={`w-full h-96 p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none ${
              errors.text && touched.text ? "bg-red-50" : ""
            }`}
            aria-describedby={errors.text && touched.text ? "text-error" : undefined}
            aria-invalid={!!(errors.text && touched.text)}
          />
          {errors.text && touched.text && (
            <div className="border-t border-red-200 bg-red-50 px-4 py-2">
              <p id="text-error" className="flex items-center gap-1.5 text-sm text-red-600" role="alert">
                <AlertCircle className="h-4 w-4" />
                {errors.text}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <Eye className="w-3 h-3" aria-hidden="true" />
            Предпросмотр
          </div>
          <div className="h-96 p-4 overflow-auto">
            {promptText ? (
              <PromptHighlight text={promptText} className="text-sm leading-relaxed" />
            ) : (
              <p className="text-sm text-gray-400 italic">
                Начните вводить текст промпта слева...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
