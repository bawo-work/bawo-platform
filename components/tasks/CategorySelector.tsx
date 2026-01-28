'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CategorySelectorProps {
  categories: string[];
  onSelect: (category: string) => void;
  disabled?: boolean;
  defaultValue?: string;
}

/**
 * CategorySelector component for text classification tasks
 * Displays dynamic category list in 2-column grid
 * Single selection (radio-style)
 */
export function CategorySelector({
  categories,
  onSelect,
  disabled = false,
  defaultValue
}: CategorySelectorProps) {
  const [selected, setSelected] = useState<string | null>(defaultValue || null);

  const handleSelect = (category: string) => {
    setSelected(category);
    onSelect(category);
  };

  return (
    <div
      className="grid grid-cols-2 gap-4"
      role="radiogroup"
      aria-label="Category selection"
    >
      {categories.map((category) => (
        <Button
          key={category}
          type="button"
          variant={selected === category ? 'default' : 'outline'}
          size="lg"
          onClick={() => handleSelect(category)}
          disabled={disabled}
          className="h-12 min-h-[48px] flex items-center justify-center"
          aria-pressed={selected === category}
          role="radio"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
