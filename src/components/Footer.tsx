import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white">PromptHub</h3>
            <p className="mt-2 text-sm text-gray-400">
              Платформа для управления промптами
            </p>
            <p className="mt-4 text-sm text-gray-500">
              &copy; {new Date().getFullYear()} PromptHub. Все права защищены.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Навигация
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/catalog" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/editor" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Редактор
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="text-sm text-gray-400 transition-colors hover:text-white">
                  База знаний
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Шаблоны
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Исследования
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Информация
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-400 transition-colors hover:text-white">
                  О сервисе
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 transition-colors hover:text-white">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
