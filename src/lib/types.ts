export type Category = 'work' | 'personal';
export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  deadline?: string; // 'YYYY-MM-DD' — від AI або вручну
  category?: Category; // вручну в Inbox
  priority?: Priority; // вручну в Inbox
};
