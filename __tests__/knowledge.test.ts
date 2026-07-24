import { knowledgeArticles, KnowledgeArticle } from "@/lib/data";

function filterArticles(
  items: KnowledgeArticle[],
  query: string,
  category: string | null
): KnowledgeArticle[] {
  let result = items;

  if (category) {
    result = result.filter((a) => a.category === category);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
  }

  return result;
}

describe("Knowledge: фильтрация статей", () => {
  it("возвращает все статьи без фильтров", () => {
    const result = filterArticles(knowledgeArticles, "", null);
    expect(result).toHaveLength(knowledgeArticles.length);
  });

  it("фильтрует по категории", () => {
    const result = filterArticles(knowledgeArticles, "", "Основы");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((a) => {
      expect(a.category).toBe("Основы");
    });
  });

  it("фильтрует по запросу в заголовке", () => {
    const result = filterArticles(knowledgeArticles, "промпт", null);
    expect(result.length).toBeGreaterThan(0);
  });

  it("фильтрует по запросу в описании", () => {
    const result = filterArticles(knowledgeArticles, "пошагов", null);
    expect(result.length).toBeGreaterThan(0);
  });

  it("возвращает пустой результат при несовпадении", () => {
    const result = filterArticles(knowledgeArticles, "zzzz", null);
    expect(result).toHaveLength(0);
  });

  it("комбинирует запрос и категорию", () => {
    const result = filterArticles(knowledgeArticles, "промпт", "Основы");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((a) => {
      expect(a.category).toBe("Основы");
    });
  });
});
