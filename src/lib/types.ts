export type CellState = 'empty' | 'start' | 'end' | 'wall' | 'visited' | 'path';
export type Algorithm = 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'greedy' | 'bidirectional-bfs';
export type DrawMode = 'start' | 'end' | 'wall';

export interface CellData {
  row: number;
  col: number;
  state: CellState;
  distance: number;
  g: number;
  h: number;
  parent: [number, number] | null;
}

export interface AlgorithmResult {
  visited: [number, number][];
  path: [number, number][];
  found: boolean;
}

export const ROWS = 22;
export const COLS = 50;
export const ANIMATION_SPEED_MS = 12;
export const PATH_SPEED_MS = 40;

export const ALGORITHM_LABELS: Record<Algorithm, string> = {
  bfs: 'Breadth-First Search',
  dfs: 'Depth-First Search',
  dijkstra: "Dijkstra's",
  astar: 'A* (A-Star)',
  greedy: 'Greedy Best-First',
  'bidirectional-bfs': 'Bidirectional BFS',
};

export const ALGORITHM_DESCRIPTIONS: Record<Algorithm, string> = {
  bfs: 'Guarantees shortest path · Unweighted',
  dfs: 'Does not guarantee shortest path · Unweighted',
  dijkstra: 'Guarantees shortest path · Weighted',
  astar: 'Guarantees shortest path · Uses heuristic',
  greedy: 'Does not guarantee shortest path · Heuristic only · Very fast',
  'bidirectional-bfs': 'Guarantees shortest path · Two frontiers meet in the middle',
};
