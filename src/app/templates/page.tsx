"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"
import { templates, templateCategories } from "@/lib/data"
import TemplateCard from "@/components/TemplateCard"

export default function TemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MIN_CHARS = 3;
  const DEBOUNCE_MS = 300;

  // Debounce
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
    const params = new URLSearchParams();
    if (debouncedQuery.length >= MIN_CHARS) params.set("q", debouncedQuery);
    if (selectedCategory !== "Все") params.set("cat", selectedCategory);
    const qs = params.toString();
    router.replace(`/templates${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [debouncedQuery, selectedCategory, router]);

  // Simulate loading
  useEffect(() => {
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);

    if (debouncedQuery.length >= MIN_CHARS) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      loadingTimerRef.current = setTimeout(
        () => setIsLoading(false),
        200 + Math.random() * 300
      );
    } else {
      setIsLoading(false);
    }
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, [debouncedQuery]);

  const suggestions = useMemo(() => {
    if (debouncedQuery.length >= MIN_CHARS) {
      const q = debouncedQuery.toLowerCase();
      return templates
        .filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q))
        )
        .slice(0, 5);
    }
    return [];
  }, [debouncedQuery]);

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
    setIsSuggestionsOpen(value.length >= MIN_CHARS);
  }, []);

  const selectSuggestion = useCallback((title: string) => {
    setQuery(title);
    setIsSuggestionsOpen(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isSuggestionsOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
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
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => templates.filter((t) => {
    const matchesCategory = selectedCategory === "Все" || t.category === selectedCategory;
    let matchesSearch = true;
    if (debouncedQuery.length >= MIN_CHARS) {
      const q = debouncedQuery.toLowerCase();
      matchesSearch =
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q));
    }
    return matchesCategory && matchesSearch;
  }), [selectedCategory, debouncedQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Шаблоны промптов</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {templateCategories.map((cat) => (
              <button
                key={cat}
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-violet-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-violet-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GET-форма поиска с debounce */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsSuggestionsOpen(false);
            }}
            className="relative w-full sm:w-72"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <label htmlFor="templates-search" className="sr-only">Поиск шаблонов</label>
            <input
              ref={inputRef}
              id="templates-search"
              type="search"
              name="q"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => {
                if (query.length >= MIN_CHARS && suggestions.length > 0)
                  setIsSuggestionsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Поиск (мин. ${MIN_CHARS} символа)...`}
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Suggestions */}
            {isSuggestionsOpen && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSuggestion(s.title)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      i === highlightIndex
                        ? "bg-violet-50 text-violet-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Search className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{s.title}</p>
                      <p className="truncate text-xs text-gray-400">{s.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
            Загрузка...
          </div>
        )}

        {/* Min chars hint */}
        {query.length > 0 && query.length < MIN_CHARS && (
          <p className="text-sm text-amber-600 mb-4">
            Введите ещё {MIN_CHARS - query.length} символа для поиска
          </p>
        )}

        {!isLoading && filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-16">Шаблоны не найдены</p>
        ) : !isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
