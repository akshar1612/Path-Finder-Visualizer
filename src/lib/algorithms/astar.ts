import { CellData, AlgorithmResult, ROWS, COLS } from '../types';

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const;

function heuristic(a: [number, number], b: [number, number]): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function astar(
  grid: CellData[][],
  start: [number, number],
  end: [number, number]
): AlgorithmResult {
  const visited: [number, number][] = [];
  const g = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
  const f = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
  const parent = Array.from({ length: ROWS }, () =>
    Array<[number, number] | null>(COLS).fill(null)
  );
  const closed = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

  g[start[0]][start[1]] = 0;
  f[start[0]][start[1]] = heuristic(start, end);

  // Open set: [f, row, col]
  const open: [number, number, number][] = [[f[start[0]][start[1]], start[0], start[1]]];

  while (open.length > 0) {
    open.sort((a, b) => a[0] - b[0]);
    const [, row, col] = open.shift()!;

    if (closed[row][col]) continue;
    closed[row][col] = true;

    if (row === end[0] && col === end[1]) {
      return { visited, path: buildPath(parent, start, end), found: true };
    }

    if (!(row === start[0] && col === start[1])) visited.push([row, col]);

    for (const [dr, dc] of DIRS) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (closed[nr][nc] || grid[nr][nc].state === 'wall') continue;
      const tentativeG = g[row][col] + 1;
      if (tentativeG < g[nr][nc]) {
        g[nr][nc] = tentativeG;
        f[nr][nc] = tentativeG + heuristic([nr, nc], end);
        parent[nr][nc] = [row, col];
        open.push([f[nr][nc], nr, nc]);
      }
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
