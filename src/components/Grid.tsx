'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Cell from './Cell';
import { CellData, CellState, DrawMode, ROWS, COLS } from '@/lib/types';

interface GridProps {
  grid: CellData[][];
  drawMode: DrawMode;
  isRunning: boolean;
  onGridChange: (grid: CellData[][]) => void;
  onStartChange: (pos: [number, number] | null) => void;
  onEndChange: (pos: [number, number] | null) => void;
  start: [number, number] | null;
  end: [number, number] | null;
}

export default function Grid({
  grid,
  drawMode,
  isRunning,
  onGridChange,
  onStartChange,
  onEndChange,
  start,
  end,
}: GridProps) {
  const isMouseDown = useRef(false);

  useEffect(() => {
    const up = () => { isMouseDown.current = false; };
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  const updateCell = useCallback(
    (row: number, col: number) => {
      if (isRunning) return;
      const current = grid[row][col].state;

      if (drawMode === 'start') {
        const newGrid = grid.map(r => r.map(c => ({ ...c })));
        // clear old start
        if (start) newGrid[start[0]][start[1]].state = 'empty';
        newGrid[row][col].state = 'start';
        onStartChange([row, col]);
        onGridChange(newGrid);
        return;
      }

      if (drawMode === 'end') {
        const newGrid = grid.map(r => r.map(c => ({ ...c })));
        if (end) newGrid[end[0]][end[1]].state = 'empty';
        newGrid[row][col].state = 'end';
        onEndChange([row, col]);
        onGridChange(newGrid);
        return;
      }

      // wall mode — skip start/end cells
      if (current === 'start' || current === 'end') return;
      const newState: CellState = current === 'wall' ? 'empty' : 'wall';
      const newGrid = grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].state = newState;
      onGridChange(newGrid);
    },
    [grid, drawMode, isRunning, start, end, onGridChange, onStartChange, onEndChange]
  );

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      isMouseDown.current = true;
      updateCell(row, col);
    },
    [updateCell]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isMouseDown.current || drawMode !== 'wall') return;
      updateCell(row, col);
    },
    [updateCell, drawMode]
  );

  return (
    <div
      className="inline-block border border-slate-600 rounded-md overflow-hidden shadow-2xl"
      onDragStart={e => e.preventDefault()}
    >
      {grid.map((row, r) => (
        <div key={r} className="flex">
          {row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              row={r}
              col={c}
              state={cell.state}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
