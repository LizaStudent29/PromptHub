import { templates, templateCategories, Template } from "@/lib/data";

function filterTemplates(
  items: Template[],
  query: string,
  category: string | null
): Template[] {
  let result = items;

  if (category && category !== "Все") {
    result = result.filter((t) => t.category === category);
  }

  if (query.trim().length >= 3) {
    const q = query.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return result;
}

describe("Templates: фильтрация", () => {
  it("возвращает все шаблоны без фильтров", () => {
    const result = filterTemplates(templates, "", null);
    expect(result).toHaveLength(templates.length);
  });

  it("фильтрует по категории", () => {
    const result = filterTemplates(templates, "", "Структурирование");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((t) => {
      expect(t.category).toBe("Структурирование");
    });
  });

  it("не фильтрует по запросу короче 3 символов", () => {
    const result = filterTemplates(templates, "ab", null);
    expect(result).toHaveLength(templates.length);
  });

  it("фильтрует по запросу от 3 символов", () => {
    const result = filterTemplates(templates, "Few", null);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((t) => {
      const match =
        t.title.toLowerCase().includes("few") ||
        t.description.toLowerCase().includes("few") ||
        t.tags.some((tag) => tag.toLowerCase().includes("few"));
      expect(match).toBe(true);
    });
  });

  it("комбинирует запрос и категорию", () => {
    const result = filterTemplates(templates, "роль", "Генерация");
    expect(result.length).toBeGreaterThan(0);
    result.forEach((t) => {
      expect(t.category).toBe("Генерация");
    });
  });

  it("возвращает пустой массив при несовпадении", () => {
    const result = filterTemplates(templates, "zzzznonexistent", null);
    expect(result).toHaveLength(0);
  });

  it("поиск по тегам", () => {
    const result = filterTemplates(templates, "CoT", null);
    expect(result.length).toBeGreaterThan(0);
  });
});
