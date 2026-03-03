'use client';

import { useState } from 'react';
import type { ExerciseInput } from '@/lib/types';

interface SectionExerciseProps {
  exercises: ExerciseInput[];
  onChange: (exercises: ExerciseInput[]) => void;
}

export function SectionExercise({ exercises, onChange }: SectionExerciseProps) {
  const [editingIndices, setEditingIndices] = useState<Set<number>>(new Set());

  const addExercise = () => {
    const newIndex = exercises.length;
    setEditingIndices((prev) => new Set([...prev, newIndex]));
    onChange([...exercises, { type: '', duration: null, note: '' }]);
  };

  const removeExercise = (index: number) => {
    setEditingIndices((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
    onChange(exercises.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndices((prev) => new Set([...prev, index]));
  };

  const finishEdit = (index: number) => {
    setEditingIndices((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const updateExercise = (
    index: number,
    field: keyof ExerciseInput,
    value: string | number | null
  ) => {
    const updated = exercises.map((ex, i) =>
      i === index ? { ...ex, [field]: value } : ex
    );
    onChange(updated);
  };

  return (
    <section
      className="animate-fade-in bg-bg-card rounded-2xl p-5 shadow-[var(--shadow)] border-l-4 border-l-section-exercise relative overflow-hidden"
      style={{ animationDelay: '0.15s' }}
    >
      <div className="absolute inset-0 bg-section-exercise-light pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl" role="img" aria-label="exercise">💪</span>
          <h3 className="text-base font-semibold text-text-primary font-[family-name:var(--font-serif-kr)]">
            운동
          </h3>
        </div>

        <div className="space-y-3">
          {exercises.map((ex, index) => {
            const isEditing = editingIndices.has(index);

            if (isEditing) {
              return (
                <div
                  key={index}
                  className="flex flex-wrap items-start gap-2 bg-bg-input rounded-xl p-3 border border-border"
                >
                  <input
                    type="text"
                    value={ex.type}
                    onChange={(e) => updateExercise(index, 'type', e.target.value)}
                    placeholder="운동 종류"
                    className="flex-1 min-w-[120px] bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={ex.duration ?? ''}
                      onChange={(e) =>
                        updateExercise(
                          index,
                          'duration',
                          e.target.value ? parseInt(e.target.value, 10) : null
                        )
                      }
                      placeholder="시간"
                      min={0}
                      className="w-20 bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted"
                    />
                    <span className="text-xs text-text-muted">분</span>
                  </div>
                  <input
                    type="text"
                    value={ex.note ?? ''}
                    onChange={(e) => updateExercise(index, 'note', e.target.value)}
                    placeholder="메모"
                    className="flex-1 min-w-[100px] bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => finishEdit(index)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                      style={{
                        backgroundColor: 'var(--section-exercise-light)',
                        color: 'var(--section-exercise)',
                      }}
                    >
                      완료
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-danger rounded-lg hover:bg-danger-light transition-colors text-lg"
                      aria-label="운동 삭제"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              );
            }

            // View mode
            return (
              <div
                key={index}
                className="flex items-center justify-between bg-bg-input rounded-xl px-4 py-3 border border-border"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {ex.type || '운동'}
                  </span>
                  {ex.duration != null && (
                    <span
                      className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'var(--section-exercise-light)',
                        color: 'var(--section-exercise)',
                      }}
                    >
                      {ex.duration}분
                    </span>
                  )}
                  {ex.note && (
                    <span className="text-sm text-text-secondary truncate">{ex.note}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => startEdit(index)}
                    className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-hover transition-colors text-sm"
                    aria-label="수정"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-danger rounded-lg hover:bg-danger-light transition-colors text-lg"
                    aria-label="삭제"
                  >
                    &times;
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addExercise}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-colors"
          style={{
            backgroundColor: 'var(--section-exercise-light)',
            color: 'var(--section-exercise)',
          }}
        >
          <span className="text-base">+</span>
          운동 추가
        </button>
      </div>
    </section>
  );
}
