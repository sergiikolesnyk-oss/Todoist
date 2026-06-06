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

type TasksContextValue = {
  tasks: Task[];
  ready: boolean;
  addTask: (title: string) => void;
  toggleDone: (id: string) => void;
  toggleToday: (id: string) => void;
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

  const addTask = useCallback((title: string) => {
    const t = title.trim();
    if (!t) return;
    setTasks((prev) => [
      { id: newId(), title: t, done: false, today: false, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x))
    );
  }, []);

  const toggleToday = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((x) => (x.id === id ? { ...x, today: !x.today, done: false } : x))
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return (
    <TasksContext.Provider
      value={{ tasks, ready, addTask, toggleDone, toggleToday, removeTask }}
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
