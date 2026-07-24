"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { prompts } from "@/lib/data";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface UseSearchReturn {
  query: string;
  setQuery: (value: string) => void;
  suggestions: SearchResult[];
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  isSuggestionsOpen: boolean;
  setIsSuggestionsOpen: (open: boolean) => void;
  highlightIndex: number;
  setHighlightIndex: (index: number) => void;
}

export function useSearch(minChars: number = 3, debounceMs: number = 300): UseSearchReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync URL -> state on mount
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.length >= minChars) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(q);
      setDebouncedQuery(q);
    }
  }, [searchParams, minChars]);

  // Debounce the query
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query, debounceMs]);

  // Run search when debouncedQuery changes
  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (debouncedQuery.length < minChars) {
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
      } catch {
        if (!controller.signal.aborted) {
          setError("Произошла ошибка при поиске");
          setIsLoading(false);
        }
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [debouncedQuery, minChars]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Update URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= minChars) {
      const params = new URLSearchParams();
      params.set("q", debouncedQuery);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    } else if (debouncedQuery.length === 0) {
      router.replace("/search", { scroll: false });
    }
  }, [debouncedQuery, minChars, router]);

  return {
    query,
    setQuery,
    suggestions,
    results,
    isLoading,
    error,
    isSuggestionsOpen,
    setIsSuggestionsOpen,
    highlightIndex,
    setHighlightIndex,
  };
}
