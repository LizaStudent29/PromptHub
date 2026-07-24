"use client";

import { useState, useMemo, useCallback } from "react";
import PromptCard from "@/components/PromptCard";
import { prompts as initialPrompts, promptCategories } from "@/lib/data";

type SortOption = "rating" | "popular" | "date";

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [localPrompts, setLocalPrompts] = useState(initialPrompts);

  const filteredPrompts = useMemo(() => {
    let result = localPrompts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return b.uses - a.uses;
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedCategory, sortBy, localPrompts]);

  const onToggleFavorite = useCallback((id: string) => {
    setLocalPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Каталог промптов</h1>
        <p className="mt-2 text-gray-600">
          Найдите лучшие промпты для ваших задач
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <label htmlFor="catalog-search" className="sr-only">Поиск по названию или описанию</label>
            <input
              id="catalog-search"
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <label htmlFor="catalog-sort" className="sr-only">Сортировка</label>
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="rating">По рейтингу</option>
            <option value="popular">По популярности</option>
            <option value="date">По дате</option>
          </select>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {promptCategories.map((cat) => (
            <button
              key={cat}
              aria-pressed={(cat === "Все" && selectedCategory === null) || selectedCategory === cat}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat || (cat === "Все" && selectedCategory === null)
                    ? null
                    : cat === "Все"
                      ? null
                      : cat
                )
              }
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                (cat === "Все" && selectedCategory === null) || selectedCategory === cat
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Найдено: {filteredPrompts.length}{" "}
          {filteredPrompts.length === 1
            ? "промпт"
            : filteredPrompts.length >= 2 && filteredPrompts.length <= 4
              ? "промпта"
              : "промптов"}
        </p>

        {filteredPrompts.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <svg
              className="h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Ничего не найдено
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить запрос или фильтры
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
