'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Task } from './types';

const STORAGE_KEY = 'ai-planner.tasks.v1';

type TaskInput = Pick<Task, 'deadline' | 'category' | 'priority'>;

type TasksContextValue = {
  tasks: Task[];
  ready: boolean;
  addTask: (title: string, opts?: Partial<TaskInput>) => void;
  updateTask: (id: string, patch: Partial<TaskInput>) => void;
  toggleDone: (id: string) => void;
  removeTask: (id: string) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);

  // Завантажуємо з localStorage один раз на старті (тільки в браузері).
  // Старі задачі могли мати поле `today` — воно просто ігнорується.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw) as Task[]);
    } catch {
      // ігноруємо пошкоджені дані
    }
    setReady(true);
  }, []);

  // Зберігаємо при кожній зміні (після першого завантаження).
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // сховище недоступне — мовчки пропускаємо
    }
  }, [tasks, ready]);

  const addTask = useCallback((title: string, opts?: Partial<TaskInput>) => {
    const t = title.trim();
    if (!t) return;
    setTasks((prev) => [
      {
        id: newId(),
        title: t,
        done: false,
        createdAt: Date.now(),
        deadline: opts?.deadline,
        category: opts?.category,
        priority: opts?.priority,
      },
      ...prev,
    ]);
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<TaskInput>) => {
    setTasks((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...patch } : x))
    );
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x))
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return (
    <TasksContext.Provider
      value={{ tasks, ready, addTask, updateTask, toggleDone, removeTask }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks must be used within <TasksProvider>');
  }
  return ctx;
}
