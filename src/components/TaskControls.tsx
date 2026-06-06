'use client';

import { useTasks } from '@/lib/store';
import type { Task, Category, Priority } from '@/lib/types';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
];

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function TaskControls({ task }: { task: Task }) {
  const { updateTask } = useTasks();

  return (
    <div className="controls">
      <input
        type="date"
        className="control-date"
        value={task.deadline ?? ''}
        onChange={(e) =>
          updateTask(task.id, { deadline: e.target.value || undefined })
        }
        aria-label="Deadline"
      />

      <div className="control-group" role="group" aria-label="Category">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            className={`tag${task.category === c.value ? ' tag--on' : ''}`}
            onClick={() =>
              updateTask(task.id, {
                category: task.category === c.value ? undefined : c.value,
              })
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="control-group" role="group" aria-label="Priority">
        {PRIORITIES.map((p) => (
          <button
            key={p.value}
            type="button"
            className={`prio prio--${p.value}${
              task.priority === p.value ? ' prio--on' : ''
            }`}
            onClick={() =>
              updateTask(task.id, {
                priority: task.priority === p.value ? undefined : p.value,
              })
            }
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
