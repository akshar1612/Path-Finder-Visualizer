'use client';

import { useCallback, useRef, useState } from 'react';
import Grid from '@/components/Grid';
import Controls from '@/components/Controls';
import {
  Algorithm,
  AlgorithmResult,
  CellData,
  DrawMode,
  ROWS,
  ANIMATION_SPEED_MS,
  PATH_SPEED_MS,
} from '@/lib/types';
import { runAlgorithm } from '@/lib/algorithms';

function makeEmptyGrid(): CellData[][] {
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: 50 }, (_, col) => ({
      row,
      col,
      state: 'empty' as const,
      distance: Infinity,
      g: Infinity,
      h: 0,
      parent: null,
    }))
  );
}

export default function Home() {
  const [grid, setGrid] = useState<CellData[][]>(makeEmptyGrid);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar');
  const [drawMode, setDrawMode] = useState<DrawMode>('start');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastResult, setLastResult] = useState<{
    found: boolean;
    visitedCount: number;
    pathLength: number;
  } | null>(null);

  // Animation state kept in refs so the step closure always reads current values
  const resultRef = useRef<AlgorithmResult | null>(null);
  const visitedIdxRef = useRef(0);
  const pathIdxRef = useRef(0);
  const phaseRef = useRef<'visited' | 'path'>('visited');
  const isActiveRef = useRef(false);
  const isPausedRef = useRef(false);
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelStep = () => {
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }
  };

  // Step function: advances one cell and schedules itself.
  // Reads only from refs + stable setters, so stale closures are safe.
  const step = () => {
    if (!isActiveRef.current || isPausedRef.current) return;
    const result = resultRef.current!;

    if (phaseRef.current === 'visited') {
      if (visitedIdxRef.current >= result.visited.length) {
        phaseRef.current = 'path';
        step();
        return;
      }
      const [row, col] = result.visited[visitedIdxRef.current++];
      setGrid(prev => {
        const next = prev.map(r => r.map(c => ({ ...c })));
        if (next[row][col].state === 'empty') next[row][col].state = 'visited';
        return next;
      });
      stepTimeoutRef.current = setTimeout(step, ANIMATION_SPEED_MS);
      return;
    }

    // path phase
    if (pathIdxRef.current >= result.path.length) {
      isActiveRef.current = false;
      setIsRunning(false);
      setIsPaused(false);
      setLastResult({
        found: result.found,
        visitedCount: result.visited.length,
        pathLength: result.path.length,
      });
      return;
    }
    const [row, col] = result.path[pathIdxRef.current++];
    setGrid(prev => {
      const next = prev.map(r => r.map(c => ({ ...c })));
      if (next[row][col].state === 'visited' || next[row][col].state === 'empty') {
        next[row][col].state = 'path';
      }
      return next;
    });
    stepTimeoutRef.current = setTimeout(step, PATH_SPEED_MS);
  };

  const clearPath = useCallback(
    (g: CellData[][]) =>
      g.map(row =>
        row.map(cell =>
          cell.state === 'visited' || cell.state === 'path'
            ? { ...cell, state: 'empty' as const }
            : cell
        )
      ),
    []
  );

  const handleVisualize = () => {
    if (!start || !end || isRunning) return;
    cancelStep();

    const freshGrid = clearPath(grid);
    setGrid(freshGrid);
    setLastResult(null);
    setIsRunning(true);
    setIsPaused(false);

    resultRef.current = runAlgorithm(freshGrid, start, end, algorithm);
    visitedIdxRef.current = 0;
    pathIdxRef.current = 0;
    phaseRef.current = 'visited';
    isActiveRef.current = true;
    isPausedRef.current = false;

    step();
  };

  const handlePause = () => {
    if (!isRunning || isPaused) return;
    cancelStep();
    isPausedRef.current = true;
    setIsPaused(true);
  };

  const handleResume = () => {
    if (!isRunning || !isPaused) return;
    isPausedRef.current = false;
    setIsPaused(false);
    step();
  };

  const handleStop = () => {
    cancelStep();
    isActiveRef.current = false;
    isPausedRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleClearPath = () => {
    handleStop();
    setGrid(prev => clearPath(prev));
    setLastResult(null);
  };

  const handleReset = () => {
    handleStop();
    setGrid(makeEmptyGrid());
    setStart(null);
    setEnd(null);
    setLastResult(null);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-8 px-4 gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Pathfinding Visualizer
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Place start &amp; end nodes, draw walls, then visualize.
        </p>
      </div>

      <div className="w-full max-w-[1300px]">
        <Controls
          algorithm={algorithm}
          drawMode={drawMode}
          isRunning={isRunning}
          isPaused={isPaused}
          hasStart={!!start}
          hasEnd={!!end}
          lastResult={lastResult}
          onAlgorithmChange={alg => {
            setAlgorithm(alg);
            handleClearPath();
          }}
          onDrawModeChange={setDrawMode}
          onVisualize={handleVisualize}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          onReset={handleReset}
          onClearPath={handleClearPath}
        />
      </div>

      <div className="w-full max-w-[1300px] flex justify-center">
        <Grid
          grid={grid}
          drawMode={drawMode}
          isRunning={isRunning && !isPaused}
          start={start}
          end={end}
          onGridChange={setGrid}
          onStartChange={pos => {
            setStart(pos);
            setDrawMode('end');
          }}
          onEndChange={pos => {
            setEnd(pos);
            setDrawMode('wall');
          }}
        />
      </div>

      <div className="flex gap-6 flex-wrap justify-center text-xs text-slate-400">
        {[
          { color: 'bg-emerald-400', label: 'Start' },
          { color: 'bg-rose-500', label: 'End' },
          { color: 'bg-slate-300', label: 'Wall' },
          { color: 'bg-violet-500/70', label: 'Visited' },
          { color: 'bg-yellow-400', label: 'Path' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-sm ${color}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
