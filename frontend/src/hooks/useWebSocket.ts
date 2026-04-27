'use client';

import { useEffect, useRef, useState } from 'react';

interface Stroke {
  id: string;
  user_id: string;
  points: Array<{x: number, y: number}>;
  color: string;
  size: number;
  created_at: string;
  deleted_at: string | null;
}

export function useWebSocket(canvasId: string) {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const wsUrl = `ws://localhost:3000/ws?token=${token}&canvasId=${canvasId}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      reconnectAttempts.current = 0;
      ws.current?.send(JSON.stringify({ type: 'request_strokes' }));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'strokes_snapshot') setStrokes(message.strokes);
      else if (message.type === 'stroke_complete') setStrokes(prev => [...prev, message.stroke]);
      else if (message.type === 'stroke_deleted') setStrokes(prev => prev.map(s => s.id === message.strokeId ? {...s, deleted_at: new Date().toISOString()} : s));
    };

    ws.current.onclose = () => {
      if (reconnectAttempts.current < 5) {
        reconnectAttempts.current++;
        setTimeout(() => window.location.reload(), 1000 * Math.pow(2, reconnectAttempts.current));
      }
    };

    return () => ws.current?.close();
  }, [canvasId]);

  return { strokes };
}
