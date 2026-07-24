"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  catalog: "Каталог промптов",
  editor: "Редактор",
  knowledge: "База знаний",
  research: "Исследования",
  templates: "Шаблоны",
  favorites: "Избранное",
  profile: "Профиль",
  search: "Поиск",
  "my-prompts": "Мои промпты",
  "my-templates": "Мои шаблоны",
  settings: "Настройки",
};

function isDynamicSegment(segment: string): boolean {
  return /^\d+$/.test(segment) || /^[0-9a-f]{8,}$/i.test(segment);
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = LABELS[segment] ?? (isDynamicSegment(segment) ? "Просмотр" : segment);
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-500">
      <Link
        href="/"
        className="flex items-center gap-1 text-violet-600 hover:text-violet-800 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Главная</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={item.href} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-gray-400" />
            {isLast ? (
              <span className="text-gray-700">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-violet-600 hover:text-violet-800 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
