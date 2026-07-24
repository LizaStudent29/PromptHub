"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, LogIn } from "lucide-react"
import { useFormValidation } from "@/hooks/useFormValidation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { errors, touched, validate, validateSingle, touchField, isValid } =
    useFormValidation({
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: "Введите корректный email",
      },
      password: {
        required: true,
        minLength: 6,
      },
    })

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value)
    validateSingle("email", value)
  }, [validateSingle])

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value)
    validateSingle("password", value)
  }, [validateSingle])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const isValidForm = validate({ email, password })
    touchField("email")
    touchField("password")

    if (!isValidForm) return

    // Mock authentication — accept any valid credentials
    setError("")
    localStorage.setItem("user", JSON.stringify({
      name: "Иван Петров",
      email: email,
      isLoggedIn: true,
    }))
    router.push("/profile")
  }, [email, password, validate, touchField, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Вход в аккаунт</h1>
          <p className="mt-2 text-gray-600">
            Войдите, чтобы управлять своими промптами
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => touchField("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.email && touched.email
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-200 focus:ring-violet-500"
                  }`}
                  aria-describedby={errors.email && touched.email ? "login-email-error" : undefined}
                  aria-invalid={!!(errors.email && touched.email)}
                />
                {errors.email && touched.email && (
                  <p id="login-email-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль <span className="text-red-500">*</span>
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => touchField("password")}
                  placeholder="Минимум 6 символов"
                  autoComplete="current-password"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.password && touched.password
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-200 focus:ring-violet-500"
                  }`}
                  aria-describedby={errors.password && touched.password ? "login-password-error" : undefined}
                  aria-invalid={!!(errors.password && touched.password)}
                />
                {errors.password && touched.password && (
                  <p id="login-password-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`mt-6 w-full py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2 ${
                isValid
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <LogIn className="h-4 w-4" />
              Войти
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-violet-600 hover:text-violet-700 font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
