/**
 * RLHF Preference Ranking Task - Worker selects preferred AI response
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export type RLHFTaskData = {
  id: string;
  project_id: string;
  prompt: string;
  response_a: string;
  response_b: string;
  task_type: 'rlhf_preference';
  time_limit: number;
};

export function RLHFTask({
  task,
  onSubmit,
}: {
  task: RLHFTaskData;
  onSubmit: (response: { preferred: 'a' | 'b' }) => void;
}) {
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;

    setSubmitting(true);
    await onSubmit({ preferred: selected });
    setSubmitting(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Prompt */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <p className="text-sm font-semibold text-gray-700 mb-2">Prompt:</p>
        <p className="text-base text-gray-900">{task.prompt}</p>
      </div>

      {/* Instructions */}
      <p className="text-sm text-gray-600 mb-4">
        Read both AI responses below and select which one you prefer (better quality, more helpful, more accurate):
      </p>

      {/* Responses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Response A */}
        <button
          onClick={() => setSelected('a')}
          className={`h-auto p-4 text-left rounded-lg border-2 transition-all ${
            selected === 'a'
              ? 'border-teal-700 bg-teal-50'
              : 'border-gray-200 bg-white hover:border-teal-300'
          }`}
          style={{ minHeight: '48px' }}
        >
          <div>
            <p className="font-semibold text-teal-700 mb-2">Response A</p>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{task.response_a}</p>
          </div>
        </button>

        {/* Response B */}
        <button
          onClick={() => setSelected('b')}
          className={`h-auto p-4 text-left rounded-lg border-2 transition-all ${
            selected === 'b'
              ? 'border-teal-700 bg-teal-50'
              : 'border-gray-200 bg-white hover:border-teal-300'
          }`}
          style={{ minHeight: '48px' }}
        >
          <div>
            <p className="font-semibold text-teal-700 mb-2">Response B</p>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{task.response_b}</p>
          </div>
        </button>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!selected || submitting}
        className="w-full"
        style={{ minHeight: '48px' }}
      >
        {submitting ? 'Submitting...' : selected ? `Submit (Response ${selected.toUpperCase()})` : 'Select a response'}
      </Button>
    </div>
  );
}
