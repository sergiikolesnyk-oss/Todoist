'use client';

import { useTasks } from '@/lib/store';
import EmptyState from '@/components/EmptyState';

export default function TodayPage() {
  const { tasks, ready, toggleDone, toggleToday } = useTasks();
  const today = tasks.filter((t) => t.today);
  const doneCount = today.filter((t) => t.done).length;

  return (
    <section className="list">
      <header className="list__header">
        <h1 className="list__title">Today</h1>
        <p className="list__sub">
          {today.length > 0
            ? `${doneCount}/${today.length} виконано`
            : 'Чекліст на сьогодні'}
        </p>
      </header>

      {!ready ? null : today.length === 0 ? (
        <EmptyState icon="✅" text="На сьогодні нічого. Додай задачі з Inbox." />
      ) : (
        <ul className="cards">
          {today.map((task) => (
            <li
              key={task.id}
              className={`card card--check${task.done ? ' card--done' : ''}`}
            >
              <label className="check">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                />
                <span className="check__box" aria-hidden />
                <span className="card__title">{task.title}</span>
              </label>
              <button
                type="button"
                className="chip chip--ghost"
                onClick={() => toggleToday(task.id)}
                aria-label="Повернути в Inbox"
              >
                ↩
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
