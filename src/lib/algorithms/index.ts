import { CellData, Algorithm, AlgorithmResult } from '../types';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';
import { astar } from './astar';
import { greedy } from './greedy';
import { bidirectionalBfs } from './bidirectional-bfs';

export function runAlgorithm(
  grid: CellData[][],
  start: [number, number],
  end: [number, number],
  algorithm: Algorithm
): AlgorithmResult {
  switch (algorithm) {
    case 'bfs': return bfs(grid, start, end);
    case 'dfs': return dfs(grid, start, end);
    case 'dijkstra': return dijkstra(grid, start, end);
    case 'astar': return astar(grid, start, end);
    case 'greedy': return greedy(grid, start, end);
    case 'bidirectional-bfs': return bidirectionalBfs(grid, start, end);
  }
}
