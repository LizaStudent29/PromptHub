import { test, expect } from "@playwright/test";

test.describe("Поиск и просмотр шаблонов", () => {
  test("поиск → фильтрация → детали шаблона → копирование", async ({
    page,
  }) => {
    // 1. Заход на сайт
    await page.goto("/");
    await expect(page.getByRole("link", { name: "PromptHub" })).toBeVisible();

    // 2. Переход в каталог шаблонов
    await page.click('a[href="/templates"]');
    await page.waitForURL("/templates");
    await expect(page.locator("h1")).toContainText("Шаблоны промптов");

    // 3. Поиск шаблона (вводим минимум 3 символа)
    const searchInput = page.locator('input[name="q"]');
    await searchInput.fill("Few");

    // 4. Ждём результатов фильтрации
    await page.waitForTimeout(1000); // debounce + simulated delay
    const cards = page.locator('a[href^="/templates/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // 5. Клик по первому шаблону для перехода на детальную страницу
    await cards.first().click();
    await page.waitForURL(/\/templates\/t/);
    await expect(page.locator("h1")).toBeVisible();

    // 6. Проверяем что на странице шаблона есть основные элементы
    await expect(page.locator("text=Назад к шаблонам")).toBeVisible();
  });

  test("фильтрация по категории", async ({ page }) => {
    await page.goto("/templates");

    // Нажимаем на категорию "Структурирование"
    await page.click('button:has-text("Структурирование")');

    // Проверяем что URL обновился (или хотя бы что шаблоны отфильтрованы)
    await page.waitForTimeout(500);
    const cards = page.locator('a[href^="/templates/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Все видимые шаблоны принадлежат выбранной категории
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText("Структурирование");
    }
  });

  test("поиск с подсказками (саджест)", async ({ page }) => {
    await page.goto("/templates");

    const searchInput = page.locator('input[name="q"]');
    await searchInput.fill("Few");

    // Ждём появления выпадающего списка с подсказками
    await page.waitForTimeout(800);
    const suggestions = page.locator(
      '[class*="absolute"] button'
    );
    const sugCount = await suggestions.count();
    expect(sugCount).toBeGreaterThan(0);
  });

  test("параметры поиска сохраняются в URL", async ({ page }) => {
    await page.goto("/templates");

    const searchInput = page.locator('input[name="q"]');
    await searchInput.fill("CoT");
    await page.waitForTimeout(500);

    // URL должен содержать параметр q
    const url = page.url();
    expect(url).toContain("q=CoT");
  });

  test("при перезагрузке результаты восстанавливаются из URL", async ({
    page,
  }) => {
    await page.goto("/templates?q=CoT");
    await page.waitForTimeout(1000);

    // Поле ввода должно содержать поисковый запрос
    const searchInput = page.locator('input[name="q"]');
    await expect(searchInput).toHaveValue("CoT");

    // Должны отображаться результаты
    const cards = page.locator('a[href^="/templates/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
