'use client';

import { useState } from 'react';
import { useTasks } from '@/lib/store';
import type { Task } from '@/lib/types';
import EmptyState from '@/components/EmptyState';
import TaskControls from '@/components/TaskControls';
import PinnedLearn from '@/components/PinnedLearn';
import { CalendarIcon, CloseIcon } from '@/components/icons';
import {
  todayISO,
  bucketFor,
  isOverdue,
  formatDeadline,
  BUCKET_META,
  type Bucket,
} from '@/lib/dateBuckets';

const TABS: Bucket[] = ['today', 'week', 'month'];

type CatFilter = 'all' | 'work' | 'personal';
const CAT_FILTERS: { value: CatFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
];

const EMPTY: Record<Bucket, string> = {
  today: 'Nothing for today. Set deadlines in Inbox.',
  week: 'Nothing this week.',
  month: 'Nothing further out.',
};

export default function TodayPage() {
  const { tasks, ready, toggleDone, removeTask } = useTasks();
  const [tab, setTab] = useState<Bucket>('today');
  const [cat, setCat] = useState<CatFilter>('all');
  const today = todayISO();

  const inBucket = tasks
    .filter((t) => t.deadline && bucketFor(t.deadline, today) === tab)
    .filter((t) => cat === 'all' || t.category === cat)
    .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1));

  // Групування за пріоритетом: спочатку high, потім решта.
  const highTasks = inBucket.filter((t) => t.priority === 'high');
  const otherTasks = inBucket.filter((t) => t.priority !== 'high');
  const showGroups = highTasks.length > 0 && otherTasks.length > 0;

  const doneCount = inBucket.filter((t) => t.done).length;

  function renderCard(task: Task) {
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
            <CloseIcon />
          </button>
        </div>

        <div className="meta-row">
          <span className={`badge badge--${tab}`}>{BUCKET_META[tab].label}</span>
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
  }

  return (
    <section className="list">
      <header className="list__header">
        <h1 className="list__title">Tasks</h1>
        <p className="list__sub">
          {inBucket.length > 0
            ? `${doneCount}/${inBucket.length} done`
            : 'Tasks by date'}
        </p>
      </header>

      <PinnedLearn />

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

      <div className="catfilter" role="group" aria-label="Category filter">
        {CAT_FILTERS.map((c) => (
          <button
            key={c.value}
            type="button"
            className={`catpill${cat === c.value ? ' catpill--on' : ''}`}
            onClick={() => setCat(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {!ready ? null : inBucket.length === 0 ? (
        <EmptyState icon={<CalendarIcon />} text={EMPTY[tab]} />
      ) : showGroups ? (
        <>
          <div className="group__head">
            <span className="dot dot--high" aria-hidden />
            High
            <span className="group__count">{highTasks.length}</span>
          </div>
          <ul className="cards">{highTasks.map(renderCard)}</ul>

          <div className="group__head">
            <span className="dot dot--other" aria-hidden />
            Other
            <span className="group__count">{otherTasks.length}</span>
          </div>
          <ul className="cards">{otherTasks.map(renderCard)}</ul>
        </>
      ) : (
        <ul className="cards">
          {[...highTasks, ...otherTasks].map(renderCard)}
        </ul>
      )}
    </section>
  );
}
