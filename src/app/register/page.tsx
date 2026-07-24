"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, UserPlus } from "lucide-react"
import { useFormValidation } from "@/hooks/useFormValidation"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
      password: {
        required: true,
        minLength: 6,
      },
    })

  const handleNameChange = useCallback((value: string) => {
    setName(value)
    validateSingle("name", value)
  }, [validateSingle])

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
    const isValidForm = validate({ name, email, password })
    touchField("name")
    touchField("email")
    touchField("password")

    if (!isValidForm) return

    // Mock registration
    localStorage.setItem("user", JSON.stringify({
      name: name,
      email: email,
      isLoggedIn: true,
    }))
    router.push("/profile")
  }, [name, email, password, validate, touchField, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Регистрация</h1>
          <p className="mt-2 text-gray-600">
            Создайте аккаунт для управления промптами
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => touchField("name")}
                  placeholder="Ваше имя"
                  autoComplete="name"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.name && touched.name
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-200 focus:ring-violet-500"
                  }`}
                  aria-describedby={errors.name && touched.name ? "register-name-error" : undefined}
                  aria-invalid={!!(errors.name && touched.name)}
                />
                {errors.name && touched.name && (
                  <p id="register-name-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-email"
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
                  aria-describedby={errors.email && touched.email ? "register-email-error" : undefined}
                  aria-invalid={!!(errors.email && touched.email)}
                />
                {errors.email && touched.email && (
                  <p id="register-email-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Пароль <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => touchField("password")}
                  placeholder="Минимум 6 символов"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.password && touched.password
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-200 focus:ring-violet-500"
                  }`}
                  aria-describedby={errors.password && touched.password ? "register-password-error" : undefined}
                  aria-invalid={!!(errors.password && touched.password)}
                />
                {errors.password && touched.password && (
                  <p id="register-password-error" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600" role="alert">
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
              <UserPlus className="h-4 w-4" />
              Зарегистрироваться
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
