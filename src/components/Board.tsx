import { useCallback, useRef, useState, type ReactNode } from 'react';

/**
 * The cutting board.
 *
 * Scraps are scattered across it and can be dragged anywhere. Pointer Events
 * rather than mouse events, so a finger works the same as a cursor, and
 * `setPointerCapture` keeps the drag alive when the pointer leaves the scrap —
 * without it a fast drag drops the piece the moment it outruns the element.
 *
 * Positions are percentages so the scatter survives a resize, and each scrap
 * is lifted above the others while held.
 */

export interface Scrap {
  id: string;
  /** Percentages of the board, so the layout holds at any width. */
  x: number;
  y: number;
  rotate: number;
  node: ReactNode;
}

export default function Board({ scraps, label }: { scraps: Scrap[]; label: string }) {
  const board = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() =>
    Object.fromEntries(scraps.map((s) => [s.id, { x: s.x, y: s.y }])));
  const [top, setTop] = useState<string | null>(null);
  const [moved, setMoved] = useState(false);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const onDown = useCallback((e: React.PointerEvent, id: string) => {
    const host = board.current;
    if (!host) return;
    const r = host.getBoundingClientRect();
    const cur = pos[id];
    drag.current = {
      id,
      dx: ((e.clientX - r.left) / r.width) * 100 - cur.x,
      dy: ((e.clientY - r.top) / r.height) * 100 - cur.y,
    };
    setTop(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [pos]);

  const onMove = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    const host = board.current;
    if (!d || !host) return;
    const r = host.getBoundingClientRect();
    // Clamped so a scrap can be moved around but never flung off the board
    // and lost.
    const x = Math.min(92, Math.max(-2, ((e.clientX - r.left) / r.width) * 100 - d.dx));
    const y = Math.min(88, Math.max(-2, ((e.clientY - r.top) / r.height) * 100 - d.dy));
    setPos((p) => ({ ...p, [d.id]: { x, y } }));
    setMoved(true);
  }, []);

  const onUp = useCallback(() => { drag.current = null; }, []);

  return (
    <div className="board" ref={board} role="group" aria-label={label}>
      {scraps.map((s) => {
        const p = pos[s.id];
        return (
          <div
            key={s.id}
            className="scrap"
            data-top={top === s.id || undefined}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `rotate(${s.rotate}deg)`,
            }}
            onPointerDown={(e) => onDown(e, s.id)}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {s.node}
          </div>
        );
      })}
      {/* The hint retires itself the moment a scrap is actually moved. */}
      {!moved && <p className="board-hint">drag these around &rarr;</p>}
    </div>
  );
}
