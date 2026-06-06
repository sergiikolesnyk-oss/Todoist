'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Capture', icon: '✏️' },
  { href: '/inbox', label: 'Inbox', icon: '📥' },
  { href: '/today', label: 'Today', icon: '✅' },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="tabbar" aria-label="Main navigation">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`tab${active ? ' tab--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className="tab__icon" aria-hidden>
              {tab.icon}
            </span>
            <span className="tab__label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
