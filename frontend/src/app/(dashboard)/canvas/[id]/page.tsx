'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DrawingCanvas from '@/components/DrawingCanvas';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useApi } from '@/hooks/useApi';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Stroke {
  id: string;
  user_id: string;
  points: Array<{x: number, y: number}>;
  color: string;
  size: number;
  created_at: string;
  deleted_at: string | null;
}

export default function CanvasPage() {
  const params = useParams();
  const canvasId = params.id as string;
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();
  const { strokes: wsStrokes } = useWebSocket(canvasId);

  useEffect(() => {
    loadStrokes();
  }, [canvasId]);

  useEffect(() => {
    setStrokes(wsStrokes);
  }, [wsStrokes]);

  const loadStrokes = async () => {
    try {
      setIsLoading(true);
      const response = await apiCall(`/api/canvases/${canvasId}/strokes`);
      if (!response.ok) throw new Error('Failed to load');
      const data = await response.json();
      setStrokes(data.filter((s: Stroke) => !s.deleted_at));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStrokeSave = async (stroke: any) => {
    try {
      const response = await apiCall(`/api/canvases/${canvasId}/strokes`, {
        method: 'POST',
        body: JSON.stringify(stroke)
      });
      if (!response.ok) throw new Error('Failed to save');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="h-screen flex flex-col">
      {error && <div className="bg-red-100 text-red-700 px-4 py-3">{error}</div>}
      <DrawingCanvas canvasId={canvasId} strokes={strokes} onStrokeSave={handleStrokeSave} />
    </div>
  );
}
