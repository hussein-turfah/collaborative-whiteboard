'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';

interface Canvas {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

interface CanvasListProps {
  canvases: Canvas[];
  onDelete: (canvasId: string) => Promise<void>;
}

export default function CanvasList({ canvases, onDelete }: CanvasListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {canvases.map((canvas) => (
        <div key={canvas.id} className="bg-white rounded-lg shadow hover:shadow-lg p-4">
          <Link href={`/canvas/${canvas.id}`}>
            <h3 className="text-lg font-semibold mb-2 hover:text-indigo-600">{canvas.name}</h3>
          </Link>
          <p className="text-sm text-gray-500 mb-4">Created {new Date(canvas.created_at).toLocaleDateString()}</p>
          <div className="flex gap-2">
            <Link href={`/canvas/${canvas.id}`} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded text-center hover:bg-indigo-700">
              Open
            </Link>
            <button onClick={() => onDelete(canvas.id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
