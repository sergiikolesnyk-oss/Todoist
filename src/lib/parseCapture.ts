// Клієнтський хелпер: шле сирий текст на /api/parse (де його структурує Claude).
// Якщо AI недоступний (немає ключа / мережа / помилка) — фолбек на просте
// розбиття по рядках, щоб користувач НІКОЛИ не втрачав введене.

export type ParsedTask = {
  title: string;
  deadline?: string; // 'YYYY-MM-DD', якщо AI його витяг
};

export type ParseResult = {
  tasks: ParsedTask[];
  usedAI: boolean;
};

function naiveSplit(text: string): ParsedTask[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((title) => ({ title }));
}

export async function parseCapture(text: string): Promise<ParseResult> {
  const trimmed = text.trim();
  if (!trimmed) return { tasks: [], usedAI: false };

  try {
    const res = await fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed }),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);

    const data = (await res.json()) as { tasks?: unknown };
    const tasks: ParsedTask[] = Array.isArray(data.tasks)
      ? data.tasks
          .map((t) => {
            const obj = t as { title?: unknown; deadline?: unknown };
            const title = typeof obj?.title === 'string' ? obj.title.trim() : '';
            const deadline =
              typeof obj?.deadline === 'string' && obj.deadline
                ? obj.deadline
                : undefined;
            return { title, deadline };
          })
          .filter((t) => t.title.length > 0)
      : [];

    if (tasks.length === 0) throw new Error('empty result');
    return { tasks, usedAI: true };
  } catch {
    return { tasks: naiveSplit(trimmed), usedAI: false };
  }
}
