#  BATTLE MIND AI

A complex, multi-agent adversarial simulation platform demonstrating dual implementations of the theoretical **Minimax Algorithm** paired with pristine **Alpha-Beta Branch Pruning**.

Algorithmic Realms seamlessly aggregates an interactive narrative adventure and an autonomous spatial grid warfare simulator. Both levels directly execute dynamic, stateless JavaScript Game Trees via a custom-built Express backend.

---

## 🏗️ System Architecture Overview

The Node.js server acts as an algorithmic **Dungeon Master** by interpreting game-states and executing zero-sum computational searches. The platform is distinctly segmented into two phases:

### Level 1: Narrative Adjudication (Story Mode)
The backend evaluates *Tension Metrics*. Instead of executing moves to instantly kill the player (which creates a poor game experience), the engine simulates 3 story-branches deep (such as deploying Goblin Ambushes or Healing Fountains) to locate an optimal path where the player's hitpoints dynamically hover exactly around 45% (the tension threshold).
* **Pruning Logic:** Branches where the player initiates an invalid action (e.g., attempting a Merchant interaction with zero gold) are structurally ignored via pure Alpha-Beta mechanisms before execution time is squandered.

### Level 2: Tactical Spatial Operations (Grid Mode)
If a player survives 3 consecutive encounters in Level 1, their exact surviving HP pool is recursively transferred onto a 2D topographical Grid Battlefield. The backend engine shifts from tension mapping into a ruthless Deathmatch algorithm.
* **Intent Computation**: The Multi-Agent engine analyzes Line of Sight (LoS) and executes greedy path-finding variants to physically swarm the player node.
* **Zero-Sum Engine**: The Minimax `evaluateGrid(state)` function blindly targets minimizing the player's remaining health while maximizing the collective health pool of its AI Minions across 4 distinct turns deep.

---

## 🛠️ Project Structure

```
├── /backend
│   ├── /ai
│   │   └── engine.js     # Unified Master Intelligence (both Grid and Story mathematical routines)
│   ├── server.js         # Node.js/Express router isolating `/api/ai/story` and `/api/ai/grid` endpoints
│   └── package.json      
└── /frontend             
    ├── /src
    │   ├── App.jsx       # Giant single-page application utilizing complex React state navigation
    │   └── index.css     # Bespoke UI styling across Dark mode, grid visualizations, and split coding consoles
    └── vite.config.js
```

---

## 🚀 Running The Application

### 1. The Minimax Backend
Navigate uniquely into the core `backend` folder and spawn the express server.
```bash
cd backend
npm install
npm start
```
*The `AIEngine` routinely broadcasts successfully generated computational telemetry and parses algorithms safely on local Port `5000`.*

### 2. The Frontend UI
Simultaneously, bootstrap the high-intensity Vite DOM structure from the `frontend` folder.
```bash
cd frontend
npm install
npm run dev
```
*Access the unified simulation array physically displayed at `http://localhost:5173`.*

---

## 📈 UI Component Functionalities

*   **Global Landing Page:** Immersive entryway with direct routing.
*   **Metric Dashboards:** Real-time feedback HUD tracking exact computation times (Latency `ms`), Graph Nodes Evaluated, and Deadlocks Pruned actively returned by the AI instance.
*   **Framer Motion Interpolations:** Clean, responsive `.jsx` integrations driving smooth DOM entry animations.
