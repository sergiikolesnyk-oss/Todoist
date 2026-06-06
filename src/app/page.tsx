'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/lib/store';
import { useSpeechInput, type SpeechLang } from '@/lib/useSpeechInput';
import { parseCapture } from '@/lib/parseCapture';

const LANG_KEY = 'ai-planner.speechLang.v1';

export default function CapturePage() {
  const { addTask } = useTasks();
  const router = useRouter();
  const [text, setText] = useState('');
  const [lang, setLang] = useState<SpeechLang>('uk-UA');
  const [saving, setSaving] = useState(false);

  // Текст, який був у полі на момент натискання мікрофона —
  // розпізнане дописуємо після нього.
  const baseRef = useRef('');

  const hasText = text.trim().length > 0;

  // Завантажуємо збережену мову розпізнавання один раз на старті.
  useEffect(() => {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === 'uk-UA' || saved === 'en-US') setLang(saved);
  }, []);

  const { supported, recording, error, start, stop } = useSpeechInput({
    lang,
    onTranscript: (t) => {
      const base = baseRef.current;
      setText(base + (base.trim() ? '\n' : '') + t);
    },
  });

  const micUnsupported = supported === false;

  function toggleLang() {
    setLang((prev) => {
      const next: SpeechLang = prev === 'uk-UA' ? 'en-US' : 'uk-UA';
      window.localStorage.setItem(LANG_KEY, next);
      return next;
    });
  }

  function handleMicDown(e: React.PointerEvent) {
    if (micUnsupported) return;
    e.preventDefault(); // не даємо полю втратити фокус / сторінці скролитись
    baseRef.current = text;
    start();
  }

  function handleMicUp() {
    if (recording) stop();
  }

  async function handleSave() {
    if (!hasText || saving) return;
    setSaving(true);
    // AI структурує сирий текст у чіткі задачі + дедлайни (з фолбеком, якщо недоступний).
    const { tasks } = await parseCapture(text);
    tasks.forEach((t) => addTask(t.title, { deadline: t.deadline }));
    setText('');
    setSaving(false);
    router.push('/inbox');
  }

  return (
    <section className="capture">
      <header className="capture__header">
        <h1 className="capture__title">What&apos;s on your mind?</h1>
        <p className="capture__hint">
          Brain-dump it all — we&apos;ll structure it later.
        </p>
      </header>

      <textarea
        className="capture__input"
        placeholder="Start typing… each line becomes a task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />

      {micUnsupported ? (
        <p className="capture__note">
          🎙️ Voice input isn&apos;t supported in this browser. Try Chrome, Edge,
          or Safari.
        </p>
      ) : error === 'denied' ? (
        <p className="capture__note">
          🚫 Microphone access denied. Allow it in your browser settings.
        </p>
      ) : recording ? (
        <p className="capture__note capture__note--live">● Listening…</p>
      ) : null}

      <div className="capture__actions">
        <button
          type="button"
          className="lang-toggle"
          onClick={toggleLang}
          disabled={micUnsupported}
          aria-label={`Recognition language: ${
            lang === 'uk-UA' ? 'Ukrainian' : 'English'
          }. Tap to change.`}
        >
          {lang === 'uk-UA' ? 'UA' : 'EN'}
        </button>

        <button
          type="button"
          className={`mic${recording ? ' mic--recording' : ''}`}
          onPointerDown={handleMicDown}
          onPointerUp={handleMicUp}
          onPointerLeave={handleMicUp}
          onPointerCancel={handleMicUp}
          disabled={micUnsupported}
          aria-label="Hold and speak"
        >
          🎙️
        </button>

        <button
          type="button"
          className="btn btn--primary"
          onClick={handleSave}
          disabled={!hasText || saving}
        >
          {saving ? 'Structuring…' : 'Save to Inbox'}
        </button>
      </div>
    </section>
  );
}
