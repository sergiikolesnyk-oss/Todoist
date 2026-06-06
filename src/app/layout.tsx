import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TasksProvider } from '@/lib/store';
import TabBar from '@/components/TabBar';

export const metadata: Metadata = {
  title: 'AI Day Planner',
  description:
    'Dump everything from your head — AI turns it into structured tasks.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a1018',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TasksProvider>
          <div className="app">
            <main className="screen">{children}</main>
            <TabBar />
          </div>
        </TasksProvider>
      </body>
    </html>
  );
}
