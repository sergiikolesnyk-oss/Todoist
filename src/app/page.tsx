'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/lib/store';

export default function CapturePage() {
  const { addTask } = useTasks();
  const router = useRouter();
  const [text, setText] = useState('');

  const hasText = text.trim().length > 0;

  function handleSave() {
    if (!hasText) return;
    // Поки що БЕЗ AI: кожен непорожній рядок стає окремою задачею в Inbox.
    // Згодом тут буде парсинг через AI.
    text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach(addTask);

    setText('');
    router.push('/inbox');
  }

  function handleMic() {
    // Заглушка: голосовий ввід додамо пізніше.
    alert('🎙️ Голосовий ввід зʼявиться в наступній версії.');
  }

  return (
    <section className="capture">
      <header className="capture__header">
        <h1 className="capture__title">Що в голові?</h1>
        <p className="capture__hint">
          Вивантаж усе підряд — структуруємо пізніше.
        </p>
      </header>

      <textarea
        className="capture__input"
        placeholder="Почни писати… кожен рядок стане окремою задачею"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />

      <div className="capture__actions">
        <button
          type="button"
          className="mic"
          onClick={handleMic}
          aria-label="Диктувати голосом"
        >
          🎙️
        </button>

        <button
          type="button"
          className="btn btn--primary"
          onClick={handleSave}
          disabled={!hasText}
        >
          Зберегти в Inbox
        </button>
      </div>
    </section>
  );
}
