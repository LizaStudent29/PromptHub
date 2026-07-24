"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Clock, BookOpen, ChevronRight } from "lucide-react";
import { knowledgeArticles, knowledgeCategories } from "@/lib/data";

export default function KnowledgePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => knowledgeArticles.filter((article) => {
    const matchesCategory = selectedCategory
      ? article.category === selectedCategory
      : true;
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            База знаний по промптам
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Статьи и руководства по созданию эффективных промптов для
            языковых моделей
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск статей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {knowledgeCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === "Все" ? null : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (category === "Все" && selectedCategory === null) || selectedCategory === category
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Link key={article.id} href={`/knowledge/${article.id}`}>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {article.readTime} мин чтения
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm flex-1">{article.summary}</p>
                <div className="flex items-center text-blue-600 text-sm font-medium mt-4">
                  Читать
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Статьи не найдены. Попробуйте изменить фильтры или поисковый
              запрос.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
