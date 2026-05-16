'use client';

import { memo } from 'react';
import { CellState } from '@/lib/types';

interface CellProps {
  row: number;
  col: number;
  state: CellState;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
}

const STATE_CLASSES: Record<CellState, string> = {
  empty: 'bg-slate-900 border-slate-700/40 hover:bg-slate-800',
  start: 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
  end: 'bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]',
  wall: 'bg-slate-300 border-slate-200',
  visited: 'bg-violet-500/70 border-violet-400/50 animate-visited',
  path: 'bg-yellow-400 border-yellow-300 shadow-[0_0_6px_rgba(250,204,21,0.5)] animate-path',
};

const ICONS: Partial<Record<CellState, string>> = {
  start: '⭐',
  end: '🎯',
};

function Cell({ row, col, state, onMouseDown, onMouseEnter }: CellProps) {
  return (
    <div
      className={`w-6 h-6 border transition-colors duration-100 flex items-center justify-center text-[9px] font-bold select-none cursor-pointer ${STATE_CLASSES[state]}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
    >
      {ICONS[state] ?? ''}
    </div>
  );
}

export default memo(Cell);
