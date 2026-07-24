import { prompts, promptCategories, Prompt } from "@/lib/data";

function filterBySearch(items: Prompt[], query: string): Prompt[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

function filterByCategory(items: Prompt[], category: string | null): Prompt[] {
  if (!category || category === "Все") return items;
  return items.filter((p) => p.category === category);
}

function sortByRating(items: Prompt[]): Prompt[] {
  return [...items].sort((a, b) => b.rating - a.rating);
}

function sortByUses(items: Prompt[]): Prompt[] {
  return [...items].sort((a, b) => b.uses - a.uses);
}

function sortByDate(items: Prompt[]): Prompt[] {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

describe("Catalog: поиск промптов", () => {
  it("возвращает все промпты при пустом запросе", () => {
    const result = filterBySearch(prompts, "");
    expect(result).toHaveLength(prompts.length);
  });

  it("фильтрует по названию", () => {
    const result = filterBySearch(prompts, "SQL");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => {
      expect(
        p.title.toLowerCase().includes("sql") ||
          p.description.toLowerCase().includes("sql")
      ).toBe(true);
    });
  });

  it("фильтрует по описанию", () => {
    const result = filterBySearch(prompts, "соцсет");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => {
      expect(
        p.title.toLowerCase().includes("соцсет") ||
          p.description.toLowerCase().includes("соцсет")
      ).toBe(true);
    });
  });

  it("фильтрует по категории", () => {
    const result = filterBySearch(prompts, "Маркетинг");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => {
      expect(p.category).toBe("Маркетинг");
    });
  });

  it("фильтрует по тегам", () => {
    const result = filterBySearch(prompts, "Python");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => {
      const match =
        p.title.toLowerCase().includes("python") ||
        p.description.toLowerCase().includes("python") ||
        p.tags.some((t) => t.toLowerCase().includes("python"));
      expect(match).toBe(true);
    });
  });

  it("возвращает пустой массив при несовпадении", () => {
    const result = filterBySearch(prompts, "zzzznonexistent");
    expect(result).toHaveLength(0);
  });

  it("поиск регистронезависимый", () => {
    const lower = filterBySearch(prompts, "sql");
    const upper = filterBySearch(prompts, "SQL");
    expect(lower.length).toBe(upper.length);
  });
});

describe("Catalog: фильтрация по категории", () => {
  it("возвращает все при категории 'Все' или null", () => {
    expect(filterByCategory(prompts, null)).toHaveLength(prompts.length);
    expect(filterByCategory(prompts, "Все")).toHaveLength(prompts.length);
  });

  it("фильтрует по конкретной категории", () => {
    const result = filterByCategory(prompts, "Программирование");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => {
      expect(p.category).toBe("Программирование");
    });
  });

  it("комбинирует поиск и категорию", () => {
    const byCategory = filterByCategory(prompts, "Программирование");
    const combined = filterBySearch(byCategory, "Python");
    expect(combined.length).toBeGreaterThan(0);
    combined.forEach((p) => {
      expect(p.category).toBe("Программирование");
    });
  });
});

describe("Catalog: сортировка", () => {
  it("сортировка по рейтингу — убывание", () => {
    const sorted = sortByRating(prompts);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].rating).toBeGreaterThanOrEqual(sorted[i].rating);
    }
  });

  it("сортировка по популярности — убывание", () => {
    const sorted = sortByUses(prompts);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].uses).toBeGreaterThanOrEqual(sorted[i].uses);
    }
  });

  it("сортировка по дате — новые первые", () => {
    const sorted = sortByDate(prompts);
    for (let i = 1; i < sorted.length; i++) {
      expect(new Date(sorted[i - 1].createdAt).getTime()).toBeGreaterThanOrEqual(
        new Date(sorted[i].createdAt).getTime()
      );
    }
  });
});

describe("Catalog: категории", () => {
  it("содержит категорию 'Все'", () => {
    expect(promptCategories).toContain("Все");
  });

  it("каждый промпт принадлежит одной из категорий", () => {
    const validCategories = promptCategories.filter((c) => c !== "Все");
    prompts.forEach((p) => {
      expect(validCategories).toContain(p.category);
    });
  });
});
