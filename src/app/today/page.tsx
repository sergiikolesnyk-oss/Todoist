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
  BUCKET_META,
  type Bucket,
} from '@/lib/dateBuckets';

const TABS: Bucket[] = ['today', 'week', 'month'];

const EMPTY: Record<Bucket, string> = {
  today: 'Nothing for today. Set deadlines in Inbox.',
  week: 'Nothing this week.',
  month: 'Nothing further out.',
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
            ? `${doneCount}/${inBucket.length} done`
            : 'Tasks by date'}
        </p>
      </header>

      <div className="segmented" role="tablist" aria-label="Period">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={`segmented__btn${tab === t ? ' segmented__btn--on' : ''}`}
            onClick={() => setTab(t)}
          >
            <span className={`dot dot--${t}`} aria-hidden />
            {BUCKET_META[t].tab}
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
                    aria-label="Delete task"
                  >
                    ✕
                  </button>
                </div>

                <div className="meta-row">
                  <span className={`badge badge--${tab}`}>
                    {BUCKET_META[tab].label}
                  </span>
                  <span
                    className={`deadline${
                      overdue && !task.done ? ' deadline--overdue' : ''
                    }`}
                  >
                    {formatDeadline(task.deadline!, today)}
                  </span>
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
