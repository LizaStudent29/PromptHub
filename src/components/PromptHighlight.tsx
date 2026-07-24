"use client"

import React from "react"

interface PromptHighlightProps {
  text: string
  className?: string
}

function tokenize(text: string): { type: string; value: string }[] {
  const tokens: { type: string; value: string }[] = []
  let i = 0

  while (i < text.length) {
    // XML tags: <tag>
    if (text[i] === "<" && /<\/?\w/.test(text.slice(i, i + 2))) {
      const end = text.indexOf(">", i)
      if (end !== -1) {
        tokens.push({ type: "xml", value: text.slice(i, end + 1) })
        i = end + 1
        continue
      }
    }

    // Variables: {{var}}
    if (text[i] === "{" && text[i + 1] === "{") {
      const end = text.indexOf("}}", i + 2)
      if (end !== -1) {
        tokens.push({ type: "variable", value: text.slice(i, end + 2) })
        i = end + 2
        continue
      }
    }

    // Headings: ## Heading
    if (text[i] === "#" && (i === 0 || text[i - 1] === "\n")) {
      let end = i
      while (end < text.length && text[end] !== "\n") end++
      tokens.push({ type: "heading", value: text.slice(i, end) })
      i = end
      continue
    }

    // Decorators: +++Format
    if (text[i] === "+" && text[i + 1] === "+" && text[i + 2] === "+") {
      let end = i
      while (end < text.length && text[end] !== " " && text[end] !== "\n" && text[end] !== ",") end++
      tokens.push({ type: "decorator", value: text.slice(i, end) })
      i = end
      continue
    }

    // JSON keys: "key":
    if (text[i] === '"') {
      const endQuote = text.indexOf('"', i + 1)
      if (endQuote !== -1) {
        const afterQuote = text[endQuote + 1]
        if (afterQuote === ":") {
          tokens.push({ type: "json-key", value: text.slice(i, endQuote + 2) })
          i = endQuote + 2
          continue
        }
        // JSON string value
        tokens.push({ type: "json-value", value: text.slice(i, endQuote + 1) })
        i = endQuote + 1
        continue
      }
    }

    // MetaGlyphs: ∈ ∩ ∪ ¬ → ⊕
    if ("∈∩∪¬→⊕".includes(text[i])) {
      tokens.push({ type: "metaglyph", value: text[i] })
      i++
      continue
    }

    // Arrows: →
    if (text[i] === "→") {
      tokens.push({ type: "arrow", value: text[i] })
      i++
      continue
    }

    // Dividers: —
    if (text[i] === "—" && (i === 0 || text[i - 1] === "\n")) {
      let end = i
      while (end < text.length && text[end] !== "\n") end++
      tokens.push({ type: "divider", value: text.slice(i, end) })
      i = end
      continue
    }

    // Inline code: `code`
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1)
      if (end !== -1) {
        tokens.push({ type: "code", value: text.slice(i, end + 1) })
        i = end + 1
        continue
      }
    }

    // Default: regular text
    tokens.push({ type: "text", value: text[i] })
    i++
  }

  return tokens
}

const tokenStyles: Record<string, string> = {
  heading: "text-blue-600 font-bold",
  variable: "text-purple-600 bg-purple-50 px-0.5 rounded font-mono text-sm",
  xml: "text-emerald-600 font-mono text-sm",
  code: "text-rose-600 bg-rose-50 px-1 rounded font-mono text-sm",
  "json-key": "text-blue-500 font-mono text-sm",
  "json-value": "text-amber-600 font-mono text-sm",
  decorator: "text-orange-500 font-semibold",
  metaglyph: "text-indigo-600 font-bold",
  arrow: "text-gray-500 font-bold",
  divider: "text-gray-400",
  text: "text-gray-800",
}

export const PromptHighlight: React.FC<PromptHighlightProps> = React.memo(
  function PromptHighlight({ text, className = "" }) {
    const tokens = tokenize(text)

    return (
      <pre className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${className}`}>
        {tokens.map((token, i) => (
          <span key={i} className={tokenStyles[token.type] || "text-gray-800"}>
            {token.value}
          </span>
        ))}
      </pre>
    )
  }
)

PromptHighlight.displayName = "PromptHighlight"
