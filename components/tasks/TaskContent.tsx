'use client';

import { cn } from '@/lib/utils';

interface TaskContentProps {
  content: string;
  instruction?: string;
  className?: string;
}

/**
 * TaskContent component displays the text to be labeled
 * Max 500 chars, responsive, clear and readable
 */
export function TaskContent({ content, instruction, className }: TaskContentProps) {
  // Truncate content if over 500 chars (safety check)
  const displayContent = content.length > 500 ? content.substring(0, 500) + '...' : content;

  return (
    <div className={cn('space-y-4', className)}>
      {instruction && (
        <p className="text-sm text-warm-gray-600 font-medium">{instruction}</p>
      )}
      <div className="bg-cream p-6 rounded-lg border border-sand">
        <p className="text-base leading-relaxed text-warm-gray-800">{displayContent}</p>
      </div>
      <p className="text-xs text-warm-gray-600 text-right">
        {displayContent.length} characters
      </p>
    </div>
  );
}
