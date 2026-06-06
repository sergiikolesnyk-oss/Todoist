// Простий клієнтський детектор відносних дат у тексті задачі.
// Працює миттєво (без AI) — щоб підхопити дедлайни в задачах, які вже лежать
// в Inbox без дати. AI на Capture робить розумніший розбір; це — швидкий запас.

function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

// Повертає 'YYYY-MM-DD' або null. `today` — теж 'YYYY-MM-DD'.
export function detectDeadline(title: string, today: string): string | null {
  const t = title.toLowerCase();

  // Порядок важливий: «післязавтра» містить «завтра».
  // (\b не використовуємо — у JS він не працює з кирилицею.)
  if (/після\s?завтра|post-?tomorrow/.test(t)) return addDays(today, 2);
  if (/завтра|tomorrow/.test(t)) return addDays(today, 1);
  if (/сьогодні|today/.test(t)) return today;

  // «через 3 дні», «за 5 днів»
  const inN = t.match(/(?:через|за)\s+(\d{1,2})\s*(?:дн|day)/);
  if (inN) return addDays(today, Number(inN[1]));

  return null;
}
