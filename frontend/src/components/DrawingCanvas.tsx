'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: string;
  user_id: string;
  points: Point[];
  color: string;
  size: number;
  created_at: string;
  deleted_at: string | null;
}

interface DrawingCanvasProps {
  canvasId: string;
  strokes: Stroke[];
  onStrokeSave: (stroke: any) => Promise<void>;
}

export default function DrawingCanvas({ canvasId, strokes, onStrokeSave }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);
  const currentStroke = useRef<Point[]>([]);

  useEffect(() => {
    redrawCanvas();
  }, [strokes]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(stroke => {
      if (stroke.deleted_at) return;
      drawStroke(ctx, stroke.points, stroke.color, stroke.size);
    });
  };

  const drawStroke = (ctx: CanvasRenderingContext2D, points: Point[], color: string, size: number) => {
    if (points.length === 0) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  };

  const drawPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    currentStroke.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    currentStroke.current.push({x: e.clientX - rect.left, y: e.clientY - rect.top});
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawPoint(x, y);
    currentStroke.current.push({x, y});
  };

  const handleMouseUp = async () => {
    if (!isDrawing || currentStroke.current.length === 0) {
      setIsDrawing(false);
      return;
    }
    setIsDrawing(false);
    await onStrokeSave({
      points: currentStroke.current,
      color,
      size,
      deleted_at: null
    });
    currentStroke.current = [];
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b p-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Color:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 cursor-pointer" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Size:</label>
          <button onClick={() => setSize(Math.max(1, size - 1))} className="p-1 hover:bg-gray-200 rounded">
            <ChevronDown size={16} />
          </button>
          <input type="range" min="1" max="20" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-24" />
          <button onClick={() => setSize(Math.min(20, size + 1))} className="p-1 hover:bg-gray-200 rounded">
            <ChevronUp size={16} />
          </button>
          <span className="text-sm text-gray-600">{size}px</span>
        </div>
        <button onClick={() => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          }
        }} className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2">
          <RotateCcw size={16} />
          Clear
        </button>
      </div>
      <div className="flex-1 bg-white overflow-auto">
        <canvas ref={canvasRef} width={1200} height={800} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className="border border-gray-300 cursor-crosshair bg-white" />
      </div>
    </div>
  );
}
