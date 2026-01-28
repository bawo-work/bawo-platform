'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Sentiment } from '@/lib/tasks/types';

interface SentimentSelectorProps {
  onSelect: (sentiment: Sentiment) => void;
  disabled?: boolean;
  defaultValue?: Sentiment;
}

export function SentimentSelector({
  onSelect,
  disabled = false,
  defaultValue
}: SentimentSelectorProps) {
  const [selected, setSelected] = useState<Sentiment | null>(defaultValue || null);

  const handleSelect = (sentiment: Sentiment) => {
    setSelected(sentiment);
    onSelect(sentiment);
  };

  return (
    <div className="grid grid-cols-3 gap-4" role="radiogroup" aria-label="Sentiment selection">
      <Button
        type="button"
        variant={selected === 'positive' ? 'default' : 'outline'}
        size="lg"
        onClick={() => handleSelect('positive')}
        disabled={disabled}
        className="h-12 min-h-[48px] flex items-center justify-center gap-2"
        aria-pressed={selected === 'positive'}
        role="radio"
      >
        <span className="text-xl" aria-hidden="true">😊</span>
        <span>Positive</span>
      </Button>
      <Button
        type="button"
        variant={selected === 'negative' ? 'default' : 'outline'}
        size="lg"
        onClick={() => handleSelect('negative')}
        disabled={disabled}
        className="h-12 min-h-[48px] flex items-center justify-center gap-2"
        aria-pressed={selected === 'negative'}
        role="radio"
      >
        <span className="text-xl" aria-hidden="true">😞</span>
        <span>Negative</span>
      </Button>
      <Button
        type="button"
        variant={selected === 'neutral' ? 'default' : 'outline'}
        size="lg"
        onClick={() => handleSelect('neutral')}
        disabled={disabled}
        className="h-12 min-h-[48px] flex items-center justify-center gap-2"
        aria-pressed={selected === 'neutral'}
        role="radio"
      >
        <span className="text-xl" aria-hidden="true">😐</span>
        <span>Neutral</span>
      </Button>
    </div>
  );
}
