import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditorPage from "@/app/editor/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/editor",
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  },
}));

describe("Редактор промптов", () => {
  beforeEach(() => {
    render(<EditorPage />);
  });

  it("отображает заголовок страницы", () => {
    expect(screen.getByText("Редактор промптов")).toBeInTheDocument();
  });

  it("отображает поле ввода названия", () => {
    expect(screen.getByPlaceholderText(/Название промпта/)).toBeInTheDocument();
  });

  it("отображает textarea для текста промпта", () => {
    expect(screen.getByPlaceholderText(/Введите текст промпта/)).toBeInTheDocument();
  });

  it("отображает все кнопки инструментов", () => {
    expect(screen.getByText("Новый")).toBeInTheDocument();
    expect(screen.getByText("Сохранить")).toBeInTheDocument();
    expect(screen.getByText("Копировать")).toBeInTheDocument();
    expect(screen.getByText("Сбросить")).toBeInTheDocument();
    expect(screen.getByText("Форматировать")).toBeInTheDocument();
  });

  it("кнопка 'Сохранить' заблокирована при пустых полях", () => {
    const saveBtn = screen.getByText("Сохранить").closest("button");
    expect(saveBtn).toHaveAttribute("disabled");
  });

  it("кнопка 'Сохранить' разблокируется при заполнении полей", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/Название промпта/), "Тестовый промпт");
    await user.type(screen.getByPlaceholderText(/Введите текст промпта/), "Это тестовый промпт для проверки валидации");
    const saveBtn = screen.getByText("Сохранить").closest("button");
    expect(saveBtn).not.toHaveAttribute("disabled");
  });

  it("кнопка 'Копировать' копирует текст в буфер обмена", async () => {
    const user = userEvent.setup();
    const writeTextSpy = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextSpy },
      writable: true,
      configurable: true,
    });

    await user.type(screen.getByPlaceholderText(/Введите текст промпта/), "Текст для копирования");
    const copyBtn = screen.getByText("Копировать").closest("button")!;
    await user.click(copyBtn);
    expect(writeTextSpy).toHaveBeenCalledWith("Текст для копирования");
  });

  it("кнопка 'Новый' очищает оба поля ввода", async () => {
    const user = userEvent.setup();
    const titleInput = screen.getByPlaceholderText(/Название промпта/);
    const textarea = screen.getByPlaceholderText(/Введите текст промпта/);

    await user.type(titleInput, "Тест");
    await user.type(textarea, "Текст");
    await user.click(screen.getByText("Новый").closest("button")!);

    expect(titleInput).toHaveValue("");
    expect(textarea).toHaveValue("");
  });

  it("кнопка 'Сбросить' очищает оба поля", async () => {
    const user = userEvent.setup();
    const titleInput = screen.getByPlaceholderText(/Название промпта/);
    const textarea = screen.getByPlaceholderText(/Введите текст промпта/);

    await user.type(titleInput, "Заголовок");
    await user.type(textarea, "Текст для сброса");
    await user.click(screen.getByText("Сбросить").closest("button")!);

    expect(titleInput).toHaveValue("");
    expect(textarea).toHaveValue("");
  });

  it("кнопка 'Форматировать' обрабатывает текст", async () => {
    const user = userEvent.setup();
    const textarea = screen.getByPlaceholderText(/Введите текст промпта/);
    await user.type(textarea, "Текст для форматирования");
    await user.click(screen.getByText("Форматировать").closest("button")!);
    expect(textarea).toHaveValue("Текст для форматирования");
  });

  it("показывает ошибки валидации при пустых полях", async () => {
    const user = userEvent.setup();
    await user.tab();
    await user.tab();
    await user.tab();
    const errors = screen.getAllByText(/обязательно для заполнения/);
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  it("предпросмотр отображает текст из textarea", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/Введите текст промпта/), "Превью текста");
    const previews = screen.getAllByText("Превью текста");
    expect(previews.length).toBe(2); // textarea + preview
  });

  it("предпросмотр показывает подсказку при пустом поле", () => {
    expect(screen.getByText(/Начните вводить текст промпта/)).toBeInTheDocument();
  });
});
