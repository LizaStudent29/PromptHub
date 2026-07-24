"use client";

import React from "react";
import Link from "next/link";
import { Heart, Star, BarChart3 } from "lucide-react";
import type { Prompt } from "@/lib/data";

interface PromptCardProps {
  prompt: Prompt;
  onToggleFavorite?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  "Маркетинг": "bg-blue-100 text-blue-700",
  "Программирование": "bg-green-100 text-green-700",
  "Креатив": "bg-purple-100 text-purple-700",
  "Бизнес": "bg-amber-100 text-amber-700",
  "Образование": "bg-cyan-100 text-cyan-700",
  "Аналитика": "bg-pink-100 text-pink-700",
};

const PromptCard: React.FC<PromptCardProps> = React.memo(function PromptCard({
  prompt,
  onToggleFavorite,
}) {
  const { id, title, description, author, category, tags, rating, uses, isFavorite } = prompt;
  const badgeClass = categoryColors[category] || "bg-gray-100 text-gray-700";

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <Link href={`/catalog/${id}`} className="flex-1 min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900 transition-colors group-hover:text-violet-600">
            {title}
          </h3>
        </Link>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(id);
          }}
          className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`}
          />
        </button>
      </div>

      {/* Description */}
      <Link href={`/catalog/${id}`}>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      </Link>

      {/* Category & Author */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
          {category}
        </span>
        <span className="text-xs text-gray-400">&middot;</span>
        <span className="truncate text-xs text-gray-500">{author}</span>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              {tag}
            </span>
          ))}
          {tags.length > 5 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">
              +{tags.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Footer: Rating & Uses */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.round(rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="ml-1 text-xs font-medium text-gray-600">
            {rating.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>{uses.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
});

PromptCard.displayName = "PromptCard";

export default PromptCard;
