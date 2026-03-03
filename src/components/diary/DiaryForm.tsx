'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { format, addDays, subDays } from 'date-fns';
import { DiaryFormData, ExerciseInput, MealInput, CustomField, EMPTY_DIARY_FORM } from '@/lib/types';
import { formatDateKorean } from '@/lib/utils';
import { SectionHappenings } from './SectionHappenings';
import { SectionGratitude } from './SectionGratitude';
import { SectionSleep } from './SectionSleep';
import { SectionExercise } from './SectionExercise';
import { SectionMeals } from './SectionMeals';
import { SectionBodySoul } from './SectionBodySoul';
import { SectionGames } from './SectionGames';
import { SectionShopping } from './SectionShopping';
import { SectionCustom } from './SectionCustom';

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface Props {
  date: string;
  initialData?: DiaryFormData;
  quoteText?: string | null;
  quoteAuthor?: string | null;
}

export function DiaryForm({ date, initialData, quoteText, quoteAuthor }: Props) {
  const [form, setForm] = useState<DiaryFormData>(initialData ?? EMPTY_DIARY_FORM);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const isFirstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const save = useCallback(async (data: DiaryFormData) => {
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/diary/${date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, ...data }),
      });
      if (res.ok) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  }, [date]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaveStatus('unsaved');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(form), 2000);
    return () => clearTimeout(timerRef.current);
  }, [form, save]);

  const update = <K extends keyof DiaryFormData>(key: K, value: DiaryFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const prevDate = format(subDays(new Date(date + 'T00:00:00'), 1), 'yyyy-MM-dd');
  const nextDate = format(addDays(new Date(date + 'T00:00:00'), 1), 'yyyy-MM-dd');

  const statusLabel: Record<SaveStatus, string> = {
    saved: '저장됨',
    saving: '저장 중...',
    unsaved: '변경사항 있음',
    error: '저장 실패',
  };

  const statusDot: Record<SaveStatus, string> = {
    saved: 'bg-success',
    saving: 'bg-accent animate-pulse',
    unsaved: 'bg-rating-fill',
    error: 'bg-danger',
  };

  const sections = [
    <SectionHappenings key="happenings" value={form.happenings} onChange={v => update('happenings', v)} />,
    <SectionGratitude key="gratitude" value={form.gratitude} onChange={v => update('gratitude', v)} />,
    <SectionSleep
      key="sleep"
      bedTime={form.sleepBedTime}
      wakeTime={form.sleepWakeTime}
      onBedTimeChange={v => update('sleepBedTime', v)}
      onWakeTimeChange={v => update('sleepWakeTime', v)}
    />,
    <SectionExercise key="exercise" exercises={form.exercises} onChange={v => update('exercises', v)} />,
    <SectionMeals key="meals" meals={form.meals} onChange={v => update('meals', v)} />,
    <SectionBodySoul
      key="bodysoul"
      bodyStatus={form.bodyStatus}
      soulStatus={form.soulStatus}
      bodyNote={form.bodyNote}
      soulNote={form.soulNote}
      onBodyStatusChange={v => update('bodyStatus', v)}
      onSoulStatusChange={v => update('soulStatus', v)}
      onBodyNoteChange={v => update('bodyNote', v)}
      onSoulNoteChange={v => update('soulNote', v)}
    />,
    <SectionGames key="games" value={form.games} onChange={v => update('games', v)} />,
    <SectionShopping key="shopping" value={form.shopping} onChange={v => update('shopping', v)} />,
    <SectionCustom key="custom" fields={form.customFields} onChange={v => update('customFields', v)} />,
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/diary/${prevDate}`}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all duration-200 active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-bold font-[family-name:var(--font-serif-kr)] text-text-primary">
            {formatDateKorean(date)}
          </h1>
          {/* Decorative line under date */}
          <div className="flex items-center justify-center mt-1.5 gap-3">
            <span className="h-px w-6 bg-accent/20" />
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${statusDot[saveStatus]} ${saveStatus === 'saving' ? 'animate-spin-slow' : ''}`} />
              <span className="text-xs text-text-muted">{statusLabel[saveStatus]}</span>
            </div>
            <span className="h-px w-6 bg-accent/20" />
          </div>
        </div>
        <Link
          href={`/diary/${nextDate}`}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all duration-200 active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      {/* Quote Stamp */}
      {quoteText && (
        <div className="relative flex items-center justify-center py-6">
          {/* Post-it note */}
          <div
            className="relative max-w-xs"
            style={{
              background: '#fff9c4',
              padding: '20px 24px',
              boxShadow: '2px 4px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08)',
              transform: 'rotate(-1.5deg)',
            }}
          >
            {/* Tape */}
            <div
              className="absolute left-1/2"
              style={{
                top: '-10px',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '20px',
                background: 'rgba(255,255,255,0.6)',
                borderRadius: '2px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            />
            <p
              className="font-[family-name:var(--font-serif-kr)]"
              style={{
                color: '#5d4037',
                fontSize: '14px',
                fontStyle: 'italic',
                textAlign: 'center',
                lineHeight: '1.7',
                marginTop: '4px',
              }}
            >
              &ldquo;{quoteText}&rdquo;
              {quoteAuthor && (
                <span style={{ display: 'block', fontSize: '12px', marginTop: '6px', fontStyle: 'normal', color: '#8d6e63', fontWeight: 500 }}>
                  -- {quoteAuthor}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Sections with staggered animation */}
      {sections.map((section, i) => (
        <div
          key={i}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
        >
          {section}
        </div>
      ))}

      {/* Manual save */}
      <div className="flex justify-center pt-4 pb-8">
        <button
          onClick={() => save(form)}
          disabled={saveStatus === 'saving' || saveStatus === 'saved'}
          className="px-10 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-medium shadow-[0_2px_8px_rgba(196,149,106,0.25)] hover:shadow-[0_6px_20px_rgba(196,149,106,0.35)] hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all duration-200"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
