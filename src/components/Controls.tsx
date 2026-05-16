'use client';

import { Algorithm, DrawMode, ALGORITHM_LABELS, ALGORITHM_DESCRIPTIONS } from '@/lib/types';

interface ControlsProps {
  algorithm: Algorithm;
  drawMode: DrawMode;
  isRunning: boolean;
  isPaused: boolean;
  hasStart: boolean;
  hasEnd: boolean;
  lastResult: { found: boolean; visitedCount: number; pathLength: number } | null;
  onAlgorithmChange: (a: Algorithm) => void;
  onDrawModeChange: (m: DrawMode) => void;
  onVisualize: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  onClearPath: () => void;
}

const ALGORITHMS: Algorithm[] = ['bfs', 'dfs', 'dijkstra', 'astar'];

export default function Controls({
  algorithm,
  drawMode,
  isRunning,
  isPaused,
  hasStart,
  hasEnd,
  lastResult,
  onAlgorithmChange,
  onDrawModeChange,
  onVisualize,
  onPause,
  onResume,
  onStop,
  onReset,
  onClearPath,
}: ControlsProps) {
  const canVisualize = hasStart && hasEnd && !isRunning;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Algorithm picker */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Algorithm</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {ALGORITHMS.map(alg => (
            <button
              key={alg}
              onClick={() => onAlgorithmChange(alg)}
              disabled={isRunning}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                algorithm === alg
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-violet-500/50 hover:text-white'
              }`}
            >
              {ALGORITHM_LABELS[alg]}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">{ALGORITHM_DESCRIPTIONS[algorithm]}</p>
      </div>

      {/* Draw mode */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Draw Mode</span>
        <div className="flex gap-2">
          {(
            [
              { mode: 'start' as DrawMode, label: '⭐ Start', active: 'bg-emerald-600 border-emerald-500 text-white' },
              { mode: 'end' as DrawMode, label: '🎯 End', active: 'bg-rose-600 border-rose-500 text-white' },
              { mode: 'wall' as DrawMode, label: '█ Wall', active: 'bg-slate-300 border-slate-200 text-slate-900' },
            ] as const
          ).map(({ mode, label, active }) => (
            <button
              key={mode}
              onClick={() => onDrawModeChange(mode)}
              disabled={isRunning && !isPaused}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                drawMode === mode
                  ? active
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          {drawMode === 'wall'
            ? 'Click or drag on the grid to draw/erase walls.'
            : `Click a cell to place the ${drawMode} node.`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap items-center">
        {/* Visualize — hidden while running */}
        {!isRunning && (
          <button
            onClick={onVisualize}
            disabled={!canVisualize}
            className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg shadow-violet-500/20 text-sm"
          >
            Visualize
          </button>
        )}

        {/* Pause / Resume — only while running */}
        {isRunning && (
          <button
            onClick={isPaused ? onResume : onPause}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all text-sm border ${
              isPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-amber-500 hover:bg-amber-400 border-amber-400 text-white shadow-lg shadow-amber-500/20'
            }`}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
        )}

        {/* Stop — only while running */}
        {isRunning && (
          <button
            onClick={onStop}
            className="px-5 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 border border-rose-600 text-white font-semibold transition-all shadow-lg shadow-rose-500/10 text-sm"
          >
            ■ Stop
          </button>
        )}

        {/* Clear Path / Reset — hidden while actively animating, shown when paused or stopped */}
        {!isRunning && (
          <>
            <button
              onClick={onClearPath}
              className="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-all text-sm"
            >
              Clear Path
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-all text-sm"
            >
              Reset Grid
            </button>
          </>
        )}
      </div>

      {/* Result badge */}
      {lastResult && !isRunning && (
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm border ${
            lastResult.found
              ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
              : 'bg-rose-950 border-rose-700 text-rose-300'
          }`}
        >
          <span className="font-semibold">{lastResult.found ? 'Path found!' : 'No path exists'}</span>
          {lastResult.found && (
            <span className="text-slate-400 text-xs">
              {lastResult.visitedCount} cells explored · {lastResult.pathLength} steps
            </span>
          )}
        </div>
      )}
    </div>
  );
}
