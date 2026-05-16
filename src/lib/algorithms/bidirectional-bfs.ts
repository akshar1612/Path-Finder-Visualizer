import { CellData, AlgorithmResult, ROWS, COLS } from '../types';

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]] as const;

export function bidirectionalBfs(
  grid: CellData[][],
  start: [number, number],
  end: [number, number]
): AlgorithmResult {
  const visited: [number, number][] = [];

  const fwdSeen = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const bwdSeen = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const fwdParent = Array.from({ length: ROWS }, () =>
    Array<[number, number] | null>(COLS).fill(null)
  );
  const bwdParent = Array.from({ length: ROWS }, () =>
    Array<[number, number] | null>(COLS).fill(null)
  );

  fwdSeen[start[0]][start[1]] = true;
  bwdSeen[end[0]][end[1]] = true;

  const fwdQueue: [number, number][] = [start];
  const bwdQueue: [number, number][] = [end];

  const buildPath = (meeting: [number, number]): [number, number][] => {
    // Forward leg: meeting → start (reversed to get start → meeting)
    const fwd: [number, number][] = [];
    let cur: [number, number] | null = meeting;
    while (cur && !(cur[0] === start[0] && cur[1] === start[1])) {
      fwd.unshift(cur);
      cur = fwdParent[cur[0]][cur[1]];
    }

    // Backward leg: meeting → end (following bwdParent)
    if (meeting[0] === end[0] && meeting[1] === end[1]) return fwd;

    const bwd: [number, number][] = [];
    cur = bwdParent[meeting[0]][meeting[1]];
    while (cur) {
      bwd.push(cur);
      if (cur[0] === end[0] && cur[1] === end[1]) break;
      cur = bwdParent[cur[0]][cur[1]];
    }

    return [...fwd, ...bwd];
  };

  while (fwdQueue.length > 0 || bwdQueue.length > 0) {
    // --- Forward step ---
    if (fwdQueue.length > 0) {
      const [row, col] = fwdQueue.shift()!;

      // If backward BFS already touched this cell, it's our meeting point
      if (bwdSeen[row][col]) {
        return { visited, path: buildPath([row, col]), found: true };
      }

      if (!(row === start[0] && col === start[1])) visited.push([row, col]);

      for (const [dr, dc] of DIRS) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (grid[nr][nc].state === 'wall' || fwdSeen[nr][nc]) continue;
        fwdSeen[nr][nc] = true;
        fwdParent[nr][nc] = [row, col];
        fwdQueue.push([nr, nc]);
      }
    }

    // --- Backward step ---
    if (bwdQueue.length > 0) {
      const [row, col] = bwdQueue.shift()!;

      if (fwdSeen[row][col]) {
        return { visited, path: buildPath([row, col]), found: true };
      }

      if (!(row === end[0] && col === end[1])) visited.push([row, col]);

      for (const [dr, dc] of DIRS) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (grid[nr][nc].state === 'wall' || bwdSeen[nr][nc]) continue;
        bwdSeen[nr][nc] = true;
        bwdParent[nr][nc] = [row, col];
        bwdQueue.push([nr, nc]);
      }
    }
  }

  return { visited, path: [], found: false };
}
