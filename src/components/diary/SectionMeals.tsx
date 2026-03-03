'use client';

import { useState } from 'react';
import type { MealInput } from '@/lib/types';
import { MEAL_TYPES } from '@/lib/types';

interface SectionMealsProps {
  meals: MealInput[];
  onChange: (meals: MealInput[]) => void;
}

const MEAL_ICONS: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌆',
  snack: '🍪',
};

export function SectionMeals({ meals, onChange }: SectionMealsProps) {
  const [activeTab, setActiveTab] = useState<string>('breakfast');

  const getMealContent = (mealType: string): string => {
    const meal = meals.find((m) => m.mealType === mealType);
    return meal?.content ?? '';
  };

  const updateMeal = (mealType: string, content: string) => {
    const exists = meals.find((m) => m.mealType === mealType);
    if (exists) {
      onChange(
        meals.map((m) => (m.mealType === mealType ? { ...m, content } : m))
      );
    } else {
      onChange([
        ...meals,
        { mealType: mealType as MealInput['mealType'], content },
      ]);
    }
  };

  const hasContent = (mealType: string): boolean => {
    return getMealContent(mealType).trim().length > 0;
  };

  return (
    <section
      className="animate-fade-in bg-bg-card rounded-2xl p-5 shadow-[var(--shadow)] border-l-4 border-l-section-meals relative overflow-hidden"
      style={{ animationDelay: '0.2s' }}
    >
      {/* Subtle background tint */}
      <div className="absolute inset-0 bg-section-meals-light pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl" role="img" aria-label="meals">🍽️</span>
          <h3 className="text-base font-semibold text-text-primary font-[family-name:var(--font-serif-kr)]">
            식사
          </h3>
        </div>

        {/* Meal type tabs */}
        <div className="flex gap-1.5 mb-4 bg-bg-input rounded-xl p-1 border border-border">
          {MEAL_TYPES.map((mt) => (
            <button
              key={mt.value}
              type="button"
              onClick={() => setActiveTab(mt.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === mt.value
                  ? 'bg-bg-card shadow-[var(--shadow)] text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <span className="text-base">{MEAL_ICONS[mt.value]}</span>
              <span className="hidden sm:inline">{mt.label}</span>
              {hasContent(mt.value) && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--section-meals)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Active meal textarea */}
        {MEAL_TYPES.map((mt) => (
          <div
            key={mt.value}
            className={activeTab === mt.value ? 'block' : 'hidden'}
          >
            <textarea
              value={getMealContent(mt.value)}
              onChange={(e) => updateMeal(mt.value, e.target.value)}
              placeholder={`${MEAL_ICONS[mt.value]} ${mt.label}에 뭘 먹었나요?`}
              rows={3}
              className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-y min-h-[80px] leading-relaxed"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
