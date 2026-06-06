'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type SpeechLang = 'uk-UA' | 'en-US';

type UseSpeechInputOptions = {
  lang: SpeechLang;
  // Викликається на кожну зміну: повний текст поточної сесії запису (final + interim).
  onTranscript: (text: string) => void;
};

export type SpeechError = 'unsupported' | 'denied' | 'error';

// ---- Мінімальні типи Web Speech API (їх немає в стандартній TS DOM-бібліотеці) ----

type RecognitionAlternative = { transcript: string };
type RecognitionResult = { isFinal: boolean; 0: RecognitionAlternative };
type RecognitionEvent = {
  resultIndex: number;
  results: { length: number; [index: number]: RecognitionResult };
};
type RecognitionErrorEvent = { error: string };

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechInput({ lang, onTranscript }: UseSpeechInputOptions) {
  // null = ще не визначено (щоб уникнути блимання на старті й SSR-розбіжностей)
  const [supported, setSupported] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<SpeechError | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef(''); // накопичений фіналізований текст поточної сесії

  // Тримаємо актуальний колбек у ref, щоб не перестворювати start/stop.
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError('unsupported');
      return;
    }
    if (recognitionRef.current) return; // вже слухаємо

    setError(null);
    finalRef.current = '';

    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const chunk = res[0].transcript;
        if (res.isFinal) finalRef.current += chunk;
        else interim += chunk;
      }
      onTranscriptRef.current((finalRef.current + interim).trim());
    };

    rec.onerror = (e) => {
      setError(
        e.error === 'not-allowed' || e.error === 'service-not-allowed'
          ? 'denied'
          : 'error'
      );
    };

    rec.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = rec;
    try {
      rec.start();
      setRecording(true);
    } catch {
      // start() кидає, якщо викликати двічі поспіль — просто ігноруємо
      recognitionRef.current = null;
      setRecording(false);
    }
  }, [lang]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  // Зупиняємо розпізнавання, якщо компонент демонтується під час запису.
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return { supported, recording, error, start, stop };
}
