"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Heart, User, Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { label: "Каталог", href: "/catalog" },
  { label: "Редактор", href: "/editor" },
  { label: "База знаний", href: "/knowledge" },
  { label: "Шаблоны", href: "/templates" },
  { label: "Исследования", href: "/research" },
];

const Header: React.FC = React.memo(function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");

  const isActive = useCallback((href: string) =>
    pathname === href || pathname.startsWith(href + "/"),
    [pathname]
  );

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim().length >= 3) {
      router.push(`/search?q=${encodeURIComponent(headerSearch.trim())}`);
      setHeaderSearch("");
      setMobileOpen(false);
    }
  }, [headerSearch, router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="h-6 w-6 text-violet-600 transition-colors group-hover:text-violet-700" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Prompt<span className="text-violet-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Основная навигация" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-violet-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-1 -bottom-[13px] h-0.5 rounded-full bg-violet-600" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 transition-colors focus-within:border-violet-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 sm:flex"
          >
            <Search className="h-4 w-4 text-gray-400" />
            <label htmlFor="header-search" className="sr-only">Поиск промптов</label>
            <input
              id="header-search"
              type="text"
              placeholder="Поиск промптов..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              className="w-40 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 lg:w-56"
            />
          </form>

          {/* Favorites */}
          <Link
            href="/favorites"
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              isActive("/favorites")
                ? "bg-violet-50 text-violet-600"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
            aria-label="Избранное"
          >
            <Heart
              className={`h-5 w-5 ${isActive("/favorites") ? "fill-violet-600" : ""}`}
            />
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              isActive("/profile")
                ? "bg-violet-50 text-violet-600"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
            aria-label="Профиль"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <nav aria-label="Мобильная навигация" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-violet-50 text-violet-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 sm:hidden"
            >
              <Search className="h-4 w-4 text-gray-400" />
              <label htmlFor="header-search-mobile" className="sr-only">Поиск промптов</label>
              <input
                id="header-search-mobile"
                type="text"
                placeholder="Поиск промптов..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </form>
          </nav>
        </div>
      )}
    </header>
  );
});

Header.displayName = "Header";

export default Header;
