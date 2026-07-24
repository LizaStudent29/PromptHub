"use client";

import React from "react";
import Link from "next/link";
import type { Template } from "@/lib/data";

interface TemplateCardProps {
  template: Template;
}

const TemplateCard: React.FC<TemplateCardProps> = React.memo(({ template }) => {
  const { id, title, description, category, tags, author, uses } = template;

  return (
    <Link
      href={`/templates/${id}`}
      className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
      <span className="inline-block px-2 py-1 text-xs font-medium bg-violet-50 text-violet-700 rounded mb-3">
        {category}
      </span>
      <div className="flex flex-wrap gap-1 mb-4">
        {tags?.map((tag) => (
          <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{author}</span>
        <span>{uses} использований</span>
      </div>
    </Link>
  );
});

TemplateCard.displayName = "TemplateCard";

export default TemplateCard;
