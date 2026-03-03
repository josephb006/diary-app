'use client';

import { useState } from 'react';
import type { CustomField } from '@/lib/types';

interface SectionCustomProps {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
}

export function SectionCustom({ fields, onChange }: SectionCustomProps) {
  const [editingIndices, setEditingIndices] = useState<Set<number>>(new Set());

  const addField = () => {
    const newIndex = fields.length;
    setEditingIndices((prev) => new Set([...prev, newIndex]));
    onChange([...fields, { label: '', value: '' }]);
  };

  const removeField = (index: number) => {
    setEditingIndices((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
    onChange(fields.filter((_, i) => i !== index));
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

  const updateField = (index: number, key: 'label' | 'value', val: string) => {
    const updated = fields.map((f, i) =>
      i === index ? { ...f, [key]: val } : f
    );
    onChange(updated);
  };

  return (
    <section
      className="animate-fade-in bg-bg-card rounded-2xl p-5 shadow-[var(--shadow)] border-l-4 border-l-section-custom relative overflow-hidden"
      style={{ animationDelay: '0.4s' }}
    >
      <div className="absolute inset-0 bg-section-custom-light pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl" role="img" aria-label="custom">✨</span>
          <h3 className="text-base font-semibold text-text-primary font-[family-name:var(--font-serif-kr)]">
            기타
          </h3>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => {
            const isEditing = editingIndices.has(index);

            if (isEditing) {
              return (
                <div
                  key={index}
                  className="bg-bg-input rounded-xl p-3 border border-border space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(index, 'label', e.target.value)}
                      placeholder="항목 이름"
                      className="flex-1 bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => finishEdit(index)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0"
                      style={{
                        backgroundColor: 'var(--section-custom-light)',
                        color: 'var(--section-custom)',
                      }}
                    >
                      완료
                    </button>
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-danger rounded-lg hover:bg-danger-light transition-colors text-lg"
                      aria-label="항목 삭제"
                    >
                      &times;
                    </button>
                  </div>
                  <textarea
                    value={field.value}
                    onChange={(e) => updateField(index, 'value', e.target.value)}
                    placeholder="내용을 입력하세요"
                    rows={2}
                    className="w-full bg-bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted resize-y min-h-[52px] leading-relaxed"
                  />
                </div>
              );
            }

            // View mode
            return (
              <div
                key={index}
                className="bg-bg-input rounded-xl px-4 py-3 border border-border"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {field.label && (
                      <p className="text-sm font-semibold text-text-primary mb-1">
                        {field.label}
                      </p>
                    )}
                    {field.value ? (
                      <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {field.value}
                      </p>
                    ) : (
                      <p className="text-sm text-text-muted italic">내용 없음</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
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
                      onClick={() => removeField(index)}
                      className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-danger rounded-lg hover:bg-danger-light transition-colors text-lg"
                      aria-label="삭제"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addField}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-colors"
          style={{
            backgroundColor: 'var(--section-custom-light)',
            color: 'var(--section-custom)',
          }}
        >
          <span className="text-base">+</span>
          항목 추가
        </button>
      </div>
    </section>
  );
}
