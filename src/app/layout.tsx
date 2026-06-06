import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TasksProvider } from '@/lib/store';
import TabBar from '@/components/TabBar';

export const metadata: Metadata = {
  title: 'AI-планер дня',
  description:
    'Вивантаж усе з голови — AI перетворить це на структуровані задачі.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
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
