import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

// Серверний роут: бере сирий текст і повертає чіткий список задач.
// Ключ читається лише тут (на сервері) і НЕ потрапляє в браузер.

const SYSTEM = `Ти — асистент, що перетворює сире «вивантаження з голови» на чіткий список задач (to-do).

Вхід — потік свідомості користувача. Він міг бути надиктований голосом: без пунктуації, з вигуками («емм», «ну», «коротше»), з повторами й самовиправленнями («купити молоко, ой ні, кефір»).

Твоє завдання:
- Виокрем кожну окрему задачу як коротку чітку дію (зазвичай починається з дієслова).
- Прибери словесне сміття, вигуки, повтори.
- Враховуй самовиправлення: лишай фінальний намір користувача, а не закреслений варіант.
- Розбивай складені думки на окремі задачі.
- Зберігай мову оригіналу (українською — українською, англійською — англійською).
- НЕ вигадуй задач, яких не було. Якщо в тексті немає жодної задачі — поверни порожній список.
- Не додавай нумерації, пояснень чи зайвої пунктуації — лише суть дії.

Дедлайн: якщо в тексті є згадка часу («завтра», «до пʼятниці», «наступного тижня», «15 числа»), обчисли конкретну дату відносно сьогоднішньої і поверни її у форматі YYYY-MM-DD. Якщо дати не згадано — поверни deadline = null. Не вигадуй дедлайнів.

Поверни результат виключно через інструмент save_tasks.`;

const TASKS_TOOL: Anthropic.Tool = {
  name: 'save_tasks',
  description: 'Зберегти структурований список чітких задач (to-do).',
  input_schema: {
    type: 'object',
    properties: {
      tasks: {
        type: 'array',
        description: 'Список окремих задач.',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Коротка чітка дія.',
            },
            deadline: {
              type: ['string', 'null'],
              description: 'Дата у форматі YYYY-MM-DD, або null якщо часу не згадано.',
            },
          },
          required: ['title', 'deadline'],
        },
      },
    },
    required: ['tasks'],
  },
};

export async function POST(req: Request) {
  let text: unknown;
  try {
    ({ text } = await req.json());
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ tasks: [] });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Ключа немає (напр. локально без .env.local) — клієнт зробить фолбек.
    return NextResponse.json({ error: 'no_api_key' }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });
  const today = new Date().toISOString().slice(0, 10);

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      system: [
        { type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } },
      ],
      tools: [TASKS_TOOL],
      tool_choice: { type: 'tool', name: 'save_tasks' },
      messages: [
        { role: 'user', content: `Сьогоднішня дата: ${today}.\n\n${text}` },
      ],
    });

    const toolUse = response.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
    );
    const raw = (toolUse?.input as { tasks?: unknown })?.tasks;
    const tasks = Array.isArray(raw)
      ? raw
          .map((t) => {
            const obj = t as { title?: unknown; deadline?: unknown };
            const title = typeof obj?.title === 'string' ? obj.title.trim() : '';
            const deadline =
              typeof obj?.deadline === 'string' &&
              /^\d{4}-\d{2}-\d{2}$/.test(obj.deadline)
                ? obj.deadline
                : null;
            return { title, deadline };
          })
          .filter((t) => t.title.length > 0)
      : [];

    return NextResponse.json({ tasks });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error('Anthropic API error', err.status, err.message);
    } else {
      console.error('parse route error', err);
    }
    return NextResponse.json({ error: 'parse_failed' }, { status: 502 });
  }
}
