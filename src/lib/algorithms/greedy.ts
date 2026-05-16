import { CellData, AlgorithmResult, ROWS, COLS } from '../types';

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const;

function h(row: number, col: number, end: [number, number]): number {
  return Math.abs(row - end[0]) + Math.abs(col - end[1]);
}

export function greedy(
  grid: CellData[][],
  start: [number, number],
  end: [number, number]
): AlgorithmResult {
  const visited: [number, number][] = [];
  const seen = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const parent = Array.from({ length: ROWS }, () =>
    Array<[number, number] | null>(COLS).fill(null)
  );

  // Open set: [heuristic, row, col]
  const open: [number, number, number][] = [[h(start[0], start[1], end), start[0], start[1]]];

  while (open.length > 0) {
    open.sort((a, b) => a[0] - b[0]);
    const [, row, col] = open.shift()!;

    if (seen[row][col]) continue;
    seen[row][col] = true;

    if (row === end[0] && col === end[1]) {
      return { visited, path: buildPath(parent, start, end), found: true };
    }

    if (!(row === start[0] && col === start[1])) visited.push([row, col]);

    for (const [dr, dc] of DIRS) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (seen[nr][nc] || grid[nr][nc].state === 'wall') continue;
      if (!parent[nr][nc]) parent[nr][nc] = [row, col];
      open.push([h(nr, nc, end), nr, nc]);
    }
  }

  return { visited, path: [], found: false };
}

function buildPath(
  parent: ([number, number] | null)[][],
  start: [number, number],
  end: [number, number]
): [number, number][] {
  const path: [number, number][] = [];
  let cur: [number, number] | null = end;
  while (cur && !(cur[0] === start[0] && cur[1] === start[1])) {
    path.unshift(cur);
    cur = parent[cur[0]][cur[1]];
  }
  return path;
}
