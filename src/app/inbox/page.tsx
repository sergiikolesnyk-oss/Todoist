'use client';

import { useTasks } from '@/lib/store';
import EmptyState from '@/components/EmptyState';

export default function InboxPage() {
  const { tasks, ready, toggleToday, removeTask } = useTasks();
  const inbox = tasks.filter((t) => !t.today);

  return (
    <section className="list">
      <header className="list__header">
        <h1 className="list__title">Inbox</h1>
        <p className="list__sub">Розпарсені задачі</p>
      </header>

      {!ready ? null : inbox.length === 0 ? (
        <EmptyState icon="📥" text="Поки порожньо. Почни з екрана Capture." />
      ) : (
        <ul className="cards">
          {inbox.map((task) => (
            <li key={task.id} className="card">
              <span className="card__title">{task.title}</span>
              <div className="card__actions">
                <button
                  type="button"
                  className="chip"
                  onClick={() => toggleToday(task.id)}
                >
                  На сьогодні
                </button>
                <button
                  type="button"
                  className="chip chip--ghost"
                  onClick={() => removeTask(task.id)}
                  aria-label="Видалити задачу"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
