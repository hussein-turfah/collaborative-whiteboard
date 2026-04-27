'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import CanvasList from '@/components/CanvasList';

interface Canvas {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export default function CanvasesPage() {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useApi();

  useEffect(() => {
    fetchCanvases();
  }, []);

  const fetchCanvases = async () => {
    try {
      setIsLoading(true);
      const response = await apiCall('/api/canvases');
      if (!response.ok) throw new Error('Failed to load canvases');
      const data = await response.json();
      setCanvases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (canvasId: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await apiCall(`/api/canvases/${canvasId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setCanvases(canvases.filter(c => c.id !== canvasId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleCreateCanvas = async () => {
    const name = prompt('Enter canvas name:');
    if (!name) return;
    try {
      const response = await apiCall('/api/canvases', {
        method: 'POST',
        body: JSON.stringify({ name })
      });
      if (!response.ok) throw new Error('Failed to create');
      const newCanvas = await response.json();
      setCanvases([...canvases, newCanvas]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Your Canvases</h1>
        <button onClick={handleCreateCanvas} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Create Canvas
        </button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {canvases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No canvases yet. Create one!</p>
        </div>
      ) : (
        <CanvasList canvases={canvases} onDelete={handleDelete} />
      )}
    </div>
  );
}
