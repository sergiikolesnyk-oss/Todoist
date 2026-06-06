'use client';

import { useEffect, useState } from 'react';
import { LEARN_SOURCES } from '@/lib/learnSources';
import { RefreshIcon, ExternalIcon } from '@/components/icons';

export default function PinnedLearn() {
  // Випадковий вибір лише на клієнті (уникаємо SSR-розбіжності).
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    setIdx(Math.floor(Math.random() * LEARN_SOURCES.length));
  }, []);

  if (idx === null) return null;
  const item = LEARN_SOURCES[idx];

  function shuffle() {
    if (LEARN_SOURCES.length < 2) return;
    setIdx((prev) => {
      let n = prev;
      while (n === prev) n = Math.floor(Math.random() * LEARN_SOURCES.length);
      return n;
    });
  }

  return (
    <div className="pinned">
      <div className="pinned__head">
        <span className="pinned__label">Pinned · Learn AI</span>
        <span className={`badge badge--${item.type}`}>
          {item.type.toUpperCase()}
        </span>
      </div>

      <a
        className="pinned__title"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalIcon />
        {item.title}
      </a>

      <div className="pinned__foot">
        <span className="pinned__source">{item.source}</span>
        <button
          type="button"
          className="pinned__shuffle"
          onClick={shuffle}
          aria-label="Shuffle recommendation"
        >
          <RefreshIcon />
          Shuffle
        </button>
      </div>
    </div>
  );
}
