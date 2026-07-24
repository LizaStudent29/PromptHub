"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2, AlertCircle } from "lucide-react";
import PromptCard from "@/components/PromptCard";
import { prompts, promptCategories } from "@/lib/data";

type SortOption = "rating" | "popular" | "date";

interface Suggestion {
  id: string;
  title: string;
  category: string;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [results, setResults] = useState<typeof prompts>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [searchExecuted, setSearchExecuted] = useState(false);

  const MIN_CHARS = 3;
  const DEBOUNCE_MS = 300;

  // Debounce query
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Update URL
  useEffect(() => {
    if (debouncedQuery.length >= MIN_CHARS) {
      const params = new URLSearchParams();
      params.set("q", debouncedQuery);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    } else {
      router.replace("/search", { scroll: false });
    }
  }, [debouncedQuery, router]);

  // Run search
  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (debouncedQuery.length < MIN_CHARS) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const delay = 300 + Math.random() * 500;
    const timer = setTimeout(() => {
      if (controller.signal.aborted) return;

      try {
        const q = debouncedQuery.toLowerCase();
        const matched = prompts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );

        setSuggestions(matched.slice(0, 5));
        setResults(matched);
        setIsLoading(false);
        setSearchExecuted(true);
      } catch {
        if (!controller.signal.aborted) {
          setError("Произошла ошибка при поиске. Попробуйте ещё раз.");
          setIsLoading(false);
        }
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [debouncedQuery]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setHighlightIndex(-1);
    if (value.length >= MIN_CHARS) setIsSuggestionsOpen(true);
    else setIsSuggestionsOpen(false);
  }, []);

  const selectSuggestion = useCallback((title: string) => {
    setQuery(title);
    setIsSuggestionsOpen(false);
    setHighlightIndex(-1);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isSuggestionsOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      setQuery(suggestions[highlightIndex].title);
      setIsSuggestionsOpen(false);
    } else if (e.key === "Escape") {
      setIsSuggestionsOpen(false);
    }
  }, [isSuggestionsOpen, suggestions, highlightIndex]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setSuggestions([]);
    setResults([]);
    setSearchExecuted(false);
    inputRef.current?.focus();
  }, []);

  const filteredResults = useMemo(() => results.filter((p) => {
    if (selectedCategory && selectedCategory !== "Все") {
      return p.category === selectedCategory;
    }
    return true;
  }), [results, selectedCategory]);

  const sortedResults = useMemo(() => [...filteredResults].sort((a, b) => {
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
  }), [filteredResults, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Поиск промптов</h1>
        <p className="mt-2 text-gray-600">
          Найдите нужный промпт по названию, описанию или категории
        </p>

        {/* Search Form (GET-form) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.length >= MIN_CHARS) {
              setDebouncedQuery(query);
              setIsSuggestionsOpen(false);
            }
          }}
          className="relative mt-8"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <label htmlFor="search-input" className="sr-only">Поиск промптов</label>
            <input
              id="search-input"
              ref={inputRef}
              type="search"
              name="q"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => {
                if (query.length >= MIN_CHARS && suggestions.length > 0)
                  setIsSuggestionsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Поиск промптов (минимум ${MIN_CHARS} символа)...`}
              className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-12 text-sm text-gray-900 shadow-sm placeholder-gray-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Suggestions dropdown */}
          {isSuggestionsOpen && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg"
            >
              {suggestions.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectSuggestion(s.title)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    i === highlightIndex
                      ? "bg-violet-50 text-violet-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{s.title}</p>
                    <p className="truncate text-xs text-gray-400">{s.category}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Min chars hint */}
        {query.length > 0 && query.length < MIN_CHARS && (
          <p className="mt-2 text-sm text-amber-600">
            Введите ещё {MIN_CHARS - query.length}{" "}
            {MIN_CHARS - query.length === 1
              ? "символ"
              : MIN_CHARS - query.length < 5
                ? "символа"
                : "символов"}{" "}
            для поиска
          </p>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
            Поиск...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Results */}
        {searchExecuted && !isLoading && !error && (
          <>
            {/* Filters */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {promptCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedCategory(
                        (cat === "Все" && selectedCategory === null) ||
                          selectedCategory === cat
                          ? null
                          : cat === "Все"
                            ? null
                            : cat
                      )
                    }
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      (cat === "Все" && selectedCategory === null) ||
                        selectedCategory === cat
                        ? "bg-violet-600 text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <label htmlFor="search-sort" className="sr-only">Сортировка</label>
              <select
                id="search-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="rating">По рейтингу</option>
                <option value="popular">По популярности</option>
                <option value="date">По дате</option>
              </select>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Найдено: {sortedResults.length}{" "}
              {sortedResults.length === 1
                ? "промпт"
                : sortedResults.length >= 2 && sortedResults.length <= 4
                  ? "промпта"
                  : "промптов"}
            </p>

            {sortedResults.length === 0 ? (
              <div className="mt-16 flex flex-col items-center text-center">
                <Search className="h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Ничего не найдено
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Попробуйте изменить запрос или фильтры
                </p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedResults.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Initial state */}
        {!searchExecuted && !isLoading && query.length < MIN_CHARS && (
          <div className="mt-16 flex flex-col items-center text-center">
            <Search className="h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Начните вводить запрос
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Минимум {MIN_CHARS} символа для поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
