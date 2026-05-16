# Pathfinding Visualizer - LIVE @ https://akshar1612.github.io/Path-Finder-Visualizer/

An interactive pathfinding algorithm visualizer built with Next.js, TypeScript, and Tailwind CSS. Place a start and end node, draw walls, choose an algorithm, and watch it search in real time.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

---

## Features

- **6 pathfinding algorithms** with step-by-step animation
- **Interactive 22 × 50 grid** — click to place nodes, click and drag to draw walls
- **Pause / Resume / Stop** controls mid-animation
- **Result badge** showing cells explored and path length after each run
- Dark-themed UI with pop animations on visited and path cells

---

## Algorithms

| Algorithm | Shortest Path | Strategy |
|---|---|---|
| Breadth-First Search (BFS) | ✅ | Explores all neighbors level by level |
| Depth-First Search (DFS) | ❌ | Dives deep along one branch before backtracking |
| Dijkstra's | ✅ | Priority queue ordered by distance from start |
| A\* (A-Star) | ✅ | Dijkstra's + Manhattan distance heuristic |
| Greedy Best-First | ❌ | Only uses heuristic — ignores actual distance traveled |
| Bidirectional BFS | ✅ | Simultaneous BFS from start and end, meets in the middle |

### Visual comparisons worth trying

- **A\* vs Greedy** on the same walled maze — Greedy explores far fewer cells on open grids but gets misled by obstacles; A\* always finds the optimal route.
- **BFS vs Bidirectional BFS** on a large open grid — Bidirectional explores roughly half the cells.
- **DFS vs BFS** — DFS snakes chaotically; BFS fans out in a perfect circle.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How to Use

1. **Place Start** — the draw mode defaults to ⭐ Start. Click any cell.
2. **Place End** — mode automatically switches to 🎯 End. Click another cell.
3. **Draw Walls** — mode switches to Wall. Click or click-and-drag to build obstacles.
4. **Pick an algorithm** from the top bar.
5. **Visualize** — hit the button and watch the search animate.
   - **⏸ Pause** to freeze mid-animation.
   - **▶ Resume** to continue.
   - **■ Stop** to halt (grid stays frozen so you can inspect it).
6. **Clear Path** to re-run a different algorithm on the same maze.
7. **Reset Grid** to start fresh.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page — animation engine, state management
│   ├── layout.tsx
│   └── globals.css       # Keyframe animations for visited/path cells
├── components/
│   ├── Cell.tsx          # Individual grid cell (memoized)
│   ├── Grid.tsx          # Grid with mouse interaction (click + drag)
│   └── Controls.tsx      # Algorithm picker, draw modes, action buttons
└── lib/
    ├── types.ts          # Shared types and constants
    └── algorithms/
        ├── bfs.ts
        ├── dfs.ts
        ├── dijkstra.ts
        ├── astar.ts
        ├── greedy.ts
        ├── bidirectional-bfs.ts
        └── index.ts      # Algorithm dispatcher
```

---

## Animation Architecture

All algorithms run synchronously and return the full ordered list of visited cells and the final path. The animation is driven by a **self-scheduling step function** — each cell update schedules exactly one next `setTimeout` call rather than pre-scheduling thousands of timeouts upfront. This makes pause and resume trivial: pausing cancels the pending timeout; resuming calls `step()` again, which picks up from the stored index refs.

```
handleVisualize()
  └── runAlgorithm()        ← synchronous, returns { visited[], path[] }
  └── step()                ← animates one cell, then: setTimeout(step, delay)
        ├── pause  → cancelStep() + set isPausedRef
        ├── resume → isPausedRef = false + step()
        └── stop   → cancelStep() + isActiveRef = false
```

---

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
