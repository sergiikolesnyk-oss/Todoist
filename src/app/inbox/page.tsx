'use client';

import { useTasks } from '@/lib/store';
import EmptyState from '@/components/EmptyState';
import TaskControls from '@/components/TaskControls';

export default function InboxPage() {
  const { tasks, ready, removeTask } = useTasks();
  // Inbox = задачі без дедлайну. Щойно проставиш дату — задача переходить у Today/Week/Month.
  const inbox = tasks.filter((t) => !t.deadline);

  return (
    <section className="list">
      <header className="list__header">
        <h1 className="list__title">Inbox</h1>
        <p className="list__sub">Признач дедлайн, категорію, пріоритет</p>
      </header>

      {!ready ? null : inbox.length === 0 ? (
        <EmptyState icon="📥" text="Поки порожньо. Почни з екрана Capture." />
      ) : (
        <ul className="cards">
          {inbox.map((task) => (
            <li key={task.id} className="card card--stack">
              <div className="card__row">
                <span className="card__title">{task.title}</span>
                <button
                  type="button"
                  className="chip chip--ghost"
                  onClick={() => removeTask(task.id)}
                  aria-label="Видалити задачу"
                >
                  ✕
                </button>
              </div>
              <TaskControls task={task} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
