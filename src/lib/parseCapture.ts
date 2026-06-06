// Клієнтський хелпер: шле сирий текст на /api/parse (де його структурує Claude).
// Якщо AI недоступний (немає ключа / мережа / помилка) — фолбек на просте
// розбиття по рядках, щоб користувач НІКОЛИ не втрачав введене.

export type ParseResult = {
  tasks: string[];
  usedAI: boolean;
};

function naiveSplit(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
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
    const tasks = Array.isArray(data.tasks)
      ? data.tasks.filter(
          (t): t is string => typeof t === 'string' && t.trim().length > 0
        )
      : [];

    if (tasks.length === 0) throw new Error('empty result');
    return { tasks, usedAI: true };
  } catch {
    return { tasks: naiveSplit(trimmed), usedAI: false };
  }
}
