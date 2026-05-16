import { CellData, AlgorithmResult, ROWS, COLS } from '../types';

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const;

export function dijkstra(
  grid: CellData[][],
  start: [number, number],
  end: [number, number]
): AlgorithmResult {
  const visited: [number, number][] = [];
  const dist = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
  const parent = Array.from({ length: ROWS }, () =>
    Array<[number, number] | null>(COLS).fill(null)
  );
  const settled = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

  dist[start[0]][start[1]] = 0;
  // Min-heap: [distance, row, col]
  const heap: [number, number, number][] = [[0, start[0], start[1]]];

  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, row, col] = heap.shift()!;

    if (settled[row][col]) continue;
    settled[row][col] = true;

    if (row === end[0] && col === end[1]) {
      return { visited, path: buildPath(parent, start, end), found: true };
    }

    if (!(row === start[0] && col === start[1])) visited.push([row, col]);

    for (const [dr, dc] of DIRS) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (settled[nr][nc] || grid[nr][nc].state === 'wall') continue;
      const newDist = d + 1;
      if (newDist < dist[nr][nc]) {
        dist[nr][nc] = newDist;
        parent[nr][nc] = [row, col];
        heap.push([newDist, nr, nc]);
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
