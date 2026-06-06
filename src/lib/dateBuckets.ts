// Логіка розкладання задач по кошиках Today / Week / Month відносно сьогодні.
// Усі дати — рядки 'YYYY-MM-DD' (локальний день, без часу й таймзон).

export type Bucket = 'today' | 'week' | 'month';

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toUTC(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

// Скільки днів від today до deadline (відʼємне = прострочено).
export function daysUntil(deadline: string, today: string): number {
  return Math.round((toUTC(deadline) - toUTC(today)) / 86_400_000);
}

export function bucketFor(deadline: string, today: string): Bucket {
  const diff = daysUntil(deadline, today);
  if (diff <= 0) return 'today'; // сьогодні або прострочено
  if (diff <= 7) return 'week'; // наступні 7 днів
  return 'month'; // далі
}

export function isOverdue(deadline: string, today: string): boolean {
  return daysUntil(deadline, today) < 0;
}

// Людський підпис дедлайну для картки.
export function formatDeadline(deadline: string, today: string): string {
  const diff = daysUntil(deadline, today);
  if (diff === 0) return 'Сьогодні';
  if (diff === 1) return 'Завтра';
  if (diff === -1) return 'Вчора';
  if (diff < 0) return `${-diff} дн. тому`;
  const [y, m, d] = deadline.split('-');
  return `${d}.${m}.${y.slice(2)}`;
}
