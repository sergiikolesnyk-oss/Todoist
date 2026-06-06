'use client';

import { useEffect, useState } from 'react';
import { LEARN_SOURCES } from '@/lib/learnSources';
import { RefreshIcon, ExternalIcon } from '@/components/icons';

export default function PinnedLearn() {
  // Стартуємо з детермінованого індексу (картка видна одразу, без SSR-розбіжності),
  // потім на клієнті обираємо випадкове джерело.
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(Math.floor(Math.random() * LEARN_SOURCES.length));
  }, []);

  const item = LEARN_SOURCES[idx];

  function open() {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  }

  function shuffle() {
    if (LEARN_SOURCES.length < 2) return;
    setIdx((prev) => {
      let n = prev;
      while (n === prev) n = Math.floor(Math.random() * LEARN_SOURCES.length);
      return n;
    });
  }

  return (
    <div
      className="pinned"
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className="pinned__head">
        <span className="pinned__label">Pinned · Learn AI</span>
        <span className={`badge badge--${item.type}`}>
          {item.type.toUpperCase()}
        </span>
      </div>

      <div className="pinned__title">
        <ExternalIcon />
        {item.title}
      </div>

      <div className="pinned__foot">
        <span className="pinned__source">{item.source}</span>
        <button
          type="button"
          className="pinned__shuffle"
          onClick={(e) => {
            e.stopPropagation();
            shuffle();
          }}
          aria-label="Shuffle recommendation"
        >
          <RefreshIcon />
          Shuffle
        </button>
      </div>
    </div>
  );
}
