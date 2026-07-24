import Link from "next/link";
import { PenTool, LayoutGrid, BookOpen, Sparkles, ArrowRight, Star } from "lucide-react";

const features = [
  {
    icon: PenTool,
    title: "Редактор промптов",
    description: "Создавайте и редактируйте промпты в удобном интерфейсе с предпросмотром в реальном времени.",
    href: "/editor",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: LayoutGrid,
    title: "Каталог промптов",
    description: "Находите готовые промпты в публичном каталоге с поиском и фильтрацией по категориям.",
    href: "/catalog",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: BookOpen,
    title: "База знаний",
    description: "Изучайте техники промпт-инжиниринга и улучшайте качество работы с языковыми моделями.",
    href: "/knowledge",
    color: "bg-emerald-100 text-emerald-600",
  },
];

const popularPrompts = [
  {
    title: "Генератор постов для соцсетей",
    description: "Создаёт привлекательные посты для Instagram и VK с хэштегами и призывом к действию.",
    category: "Маркетинг",
    rating: 5,
  },
  {
    title: "Ревью кода на Python",
    description: "Проводит детальный разбор Python-кода с рекомендациями по улучшению.",
    category: "Программирование",
    rating: 4,
  },
  {
    title: "Генератор SQL-запросов",
    description: "Преобразует естественный язык в оптимизированные SQL-запросы.",
    category: "Программирование",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700">
              <Sparkles className="h-4 w-4" />
              Платформа для промпт-инжиниринга
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Управляйте промптами{" "}
              <span className="text-violet-600">эффективно</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Создавайте, храните и делитесь промптами для языковых моделей.
              База знаний, шаблоны и публичный каталог — всё в одном месте.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
              >
                Смотреть каталог
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Открыть редактор
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Всё для работы с промптами
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Инструменты, которые упрощают ежедневную работу с языковыми моделями
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-violet-600">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Prompts */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Популярные промпты
            </h2>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              Смотреть все
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularPrompts.map((prompt) => (
              <div
                key={prompt.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-block rounded-md bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                  {prompt.category}
                </span>
                <h3 className="mt-3 text-base font-semibold text-gray-900">
                  {prompt.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {prompt.description}
                </p>
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < prompt.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Начните работать с промптами
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Присоединяйтесь к сообществу и создавайте лучшие промпты для языковых моделей
          </p>
          <div className="mt-8">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
            >
              Перейти в каталог
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
