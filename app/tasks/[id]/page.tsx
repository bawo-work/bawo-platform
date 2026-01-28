'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskContent } from '@/components/tasks/TaskContent';
import { SentimentSelector } from '@/components/tasks/SentimentSelector';
import { CategorySelector } from '@/components/tasks/CategorySelector';
import { TaskTimer } from '@/components/tasks/TaskTimer';
import { TaskResult } from '@/components/tasks/TaskResult';
import { Button } from '@/components/ui/button';
import { getTaskById, submitTaskResponse } from '@/lib/api/tasks';
import { returnTaskToQueue } from '@/lib/tasks/assignment';
import { getSentimentInstruction } from '@/lib/tasks/sentiment';
import { getClassificationInstruction } from '@/lib/tasks/classification';
import type { Task, Sentiment, TaskSubmissionResult } from '@/lib/tasks/types';

interface TaskPageProps {
  params: {
    id: string;
  };
}

export default function TaskPage({ params }: TaskPageProps) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TaskSubmissionResult | null>(null);
  const [startTime] = useState(Date.now());

  // Load task on mount
  useEffect(() => {
    async function loadTask() {
      const fetchedTask = await getTaskById(params.id);
      setTask(fetchedTask);
      setLoading(false);
    }
    loadTask();
  }, [params.id]);

  // Handle task timeout
  const handleTimeout = async () => {
    if (!task) return;

    // Return task to queue
    const workerId = 'worker-123'; // TODO: Get from auth context
    await returnTaskToQueue(task.id, workerId);

    // Redirect to dashboard
    router.push('/dashboard');
  };

  // Handle task skip
  const handleSkip = async () => {
    if (!task) return;

    const workerId = 'worker-123'; // TODO: Get from auth context
    await returnTaskToQueue(task.id, workerId);
    router.push('/dashboard');
  };

  // Handle task submission
  const handleSubmit = async () => {
    if (!task || !response || submitting) return;

    setSubmitting(true);

    const workerId = 'worker-123'; // TODO: Get from auth context
    const responseTimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    const submissionResult = await submitTaskResponse({
      taskId: task.id,
      workerId,
      response,
      responseTimeSeconds,
    });

    setResult(submissionResult);
    setSubmitting(false);
  };

  // Handle completion and auto-advance
  const handleComplete = () => {
    // TODO: Load next task or redirect to dashboard
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-warm-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-warm-gray-800 font-semibold mb-2">Task not found</p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Show result screen after submission
  if (result) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <TaskResult
          success={result.success}
          earned={result.earned}
          isGolden={result.isGolden}
          correct={result.correct}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  // Determine instruction based on task type
  const instruction =
    task.type === 'sentiment'
      ? getSentimentInstruction()
      : getClassificationInstruction(task.options || []);

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        {/* Header with timer */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-warm-gray-800">
            {task.type === 'sentiment' ? 'Sentiment Analysis' : 'Text Classification'}
          </h1>
          <TaskTimer
            timeLimit={task.timeLimit || 45}
            onTimeout={handleTimeout}
            autoStart={true}
          />
        </div>

        {/* Task content */}
        <TaskContent content={task.content} instruction={instruction} className="mb-8" />

        {/* Response selector */}
        <div className="mb-8">
          {task.type === 'sentiment' ? (
            <SentimentSelector
              onSelect={(sentiment: Sentiment) => setResponse(sentiment)}
              disabled={submitting}
            />
          ) : (
            <CategorySelector
              categories={task.options || []}
              onSelect={(category: string) => setResponse(category)}
              disabled={submitting}
            />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleSkip}
            disabled={submitting}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!response || submitting}
            className="flex-1 min-h-[48px]"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>

        {/* Helper text */}
        <p className="text-xs text-warm-gray-600 text-center mt-4">
          Earn ${task.payAmount.toFixed(2)} for this task
        </p>
      </div>
    </div>
  );
}
