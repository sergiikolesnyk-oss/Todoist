'use client';

import { useState } from 'react';
import { useTasks } from '@/lib/store';
import EmptyState from '@/components/EmptyState';
import TaskControls from '@/components/TaskControls';
import {
  todayISO,
  bucketFor,
  isOverdue,
  formatDeadline,
  type Bucket,
} from '@/lib/dateBuckets';

const TABS: { value: Bucket; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const EMPTY: Record<Bucket, string> = {
  today: 'На сьогодні нічого. Признач дедлайни в Inbox.',
  week: 'На цей тиждень порожньо.',
  month: 'Далі по місяцю порожньо.',
};

export default function TodayPage() {
  const { tasks, ready, toggleDone, removeTask } = useTasks();
  const [tab, setTab] = useState<Bucket>('today');
  const today = todayISO();

  const inBucket = tasks
    .filter((t) => t.deadline && bucketFor(t.deadline, today) === tab)
    .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1));

  const doneCount = inBucket.filter((t) => t.done).length;

  return (
    <section className="list">
      <header className="list__header">
        <h1 className="list__title">Today</h1>
        <p className="list__sub">
          {inBucket.length > 0
            ? `${doneCount}/${inBucket.length} виконано`
            : 'Задачі за датами'}
        </p>
      </header>

      <div className="segmented" role="tablist" aria-label="Період">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            className={`segmented__btn${tab === t.value ? ' segmented__btn--on' : ''}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!ready ? null : inBucket.length === 0 ? (
        <EmptyState icon="🗓" text={EMPTY[tab]} />
      ) : (
        <ul className="cards">
          {inBucket.map((task) => {
            const overdue = isOverdue(task.deadline!, today);
            return (
              <li
                key={task.id}
                className={`card card--stack${task.done ? ' card--done' : ''}${
                  overdue && !task.done ? ' card--overdue' : ''
                }`}
              >
                <div className="card__row">
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
                    onClick={() => removeTask(task.id)}
                    aria-label="Видалити задачу"
                  >
                    ✕
                  </button>
                </div>

                <div className={`deadline${overdue && !task.done ? ' deadline--overdue' : ''}`}>
                  📅 {formatDeadline(task.deadline!, today)}
                </div>

                <TaskControls task={task} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
