"use client"

import { useState, useCallback } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useFormValidation } from "@/hooks/useFormValidation"

export default function SettingsPage() {
  const [name, setName] = useState("Иван Петров")
  const [email, setEmail] = useState("ivan@example.com")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [theme, setTheme] = useState("system")
  const [saved, setSaved] = useState(false)

  const { errors, touched, validate, validateSingle, touchField, isValid } =
    useFormValidation({
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: "Введите корректный email",
      },
    })

  const handleNameChange = (value: string) => {
    setName(value)
    if (touched.name) validateSingle("name", value)
    setSaved(false)
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (touched.email) validateSingle("email", value)
    setSaved(false)
  }

  const handleSave = useCallback(() => {
    const isValidForm = validate({ name, email })
    touchField("name")
    touchField("email")

    if (isValidForm) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }, [name, email, validate, touchField])

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Настройки</h1>

        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            Изменения сохранены
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Профиль</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="settings-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  id="settings-name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => touchField("name")}
                  className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.name && touched.name
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-200 focus:ring-violet-500"
                  }`}
                />
                {errors.name && touched.name && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="settings-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => touchField("email")}
                  className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.email && touched.email
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-200 focus:ring-violet-500"
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Уведомления</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Email-уведомления</p>
                <p className="text-xs text-gray-500">Получать уведомления на почту</p>
              </div>
              <button
                role="switch"
                aria-checked={emailNotifications}
                aria-label="Email-уведомления"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  emailNotifications ? "bg-violet-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    emailNotifications ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Внешний вид</h2>
            <div className="flex gap-3" role="group" aria-label="Выбор темы">
              {[
                { value: "light", label: "Светлая" },
                { value: "dark", label: "Тёмная" },
                { value: "system", label: "Системная" },
              ].map((option) => (
                <button
                  key={option.value}
                  aria-pressed={theme === option.value}
                  onClick={() => setTheme(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === option.value
                      ? "bg-violet-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`mt-8 w-full py-3 rounded-lg font-medium transition-colors ${
            isValid
              ? "bg-violet-600 text-white hover:bg-violet-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  )
}
