# 🧠 AI IDE PROMPT — Kruskal Algorithm Visualizer Web Application
> Paste this entire prompt into Cursor / Windsurf / GitHub Copilot Workspace / v0 / Bolt.new

---

## 🎯 PROJECT OVERVIEW

Build a **single-page, fully interactive web application** called **"Kruskal Algorithm"** that lets users
construct a weighted undirected graph by adding nodes and edges, then visualize the step-by-step
execution of **Kruskal's Minimum Spanning Tree algorithm** with smooth animations.

**Developer credit:** Developed by **Soham Khairnar**  
**Stack:** Vanilla HTML5 + CSS3 + JavaScript (ES6+) — NO frameworks, NO build tools, single `.html` file  
**Canvas:** Use the HTML5 `<canvas>` API for all graph rendering

---

## 🏗️ APPLICATION STRUCTURE

The app is divided into **three panels** inside a full-viewport layout:

```
┌─────────────────────────────────────────────────────────┐
│              HEADER — App Name + Credits                 │
├────────────────┬────────────────────────────────────────┤
│  LEFT SIDEBAR  │         MAIN CANVAS (Graph)            │
│  (Controls)    │                                        │
│                │                                        │
├────────────────┴────────────────────────────────────────┤
│              BOTTOM PANEL — Step Log / MST Results       │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 DESIGN SYSTEM — STRICT RULES

### Color Palette (Pastel + Glow)
```css
:root {
  /* Backgrounds */
  --bg-primary:     #0f0f1a;   /* deep dark navy */
  --bg-surface:     #1a1a2e;   /* panel background */
  --bg-card:        #16213e;   /* card/sidebar bg */

  /* Pastel Node Colors (cycle through for new nodes) */
  --pastel-lavender:  #c9b8ff;
  --pastel-mint:      #b8ffd9;
  --pastel-peach:     #ffd4b8;
  --pastel-sky:       #b8e8ff;
  --pastel-rose:      #ffb8d4;
  --pastel-lemon:     #fffdb8;
  --pastel-lilac:     #e8b8ff;
  --pastel-seafoam:   #b8fff5;

  /* Edge Colors */
  --edge-default:   #3a3a5c;
  --edge-candidate: #7c6fff;   /* edge being considered */
  --edge-mst:       #4fffb0;   /* accepted into MST */
  --edge-rejected:  #ff4f6e;   /* rejected (forms cycle) */

  /* Glow Colors */
  --glow-node:    rgba(180, 140, 255, 0.55);
  --glow-mst:     rgba(79, 255, 176, 0.50);
  --glow-reject:  rgba(255, 79, 110, 0.45);
  --glow-active:  rgba(255, 220, 100, 0.55);

  /* Text */
  --text-primary:   #f0eeff;
  --text-secondary: #9090b8;
  --text-accent:    #a78bfa;

  /* UI Accents */
  --accent-purple:  #7c6fff;
  --accent-green:   #4fffb0;
  --accent-pink:    #ff6eb4;

  /* Typography */
  --font-heading: 'Outfit', sans-serif;
  --font-body:    'Inter',  sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
}
```

### Fonts (load from Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Glow Effect Utility (apply on canvas via `ctx.shadowBlur`)
```js
function applyGlow(ctx, color, blur = 18) {
  ctx.shadowColor = color;
  ctx.shadowBlur  = blur;
}
function clearGlow(ctx) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur  = 0;
}
```

### Animation Timing
- All state transitions: `350ms cubic-bezier(0.34, 1.56, 0.64, 1)` (spring feel)
- Step-through delay (auto-play): `900ms` between steps
- Edge draw animation: lerp stroke from 0 to full length over `400ms`
- Node spawn: scale from 0 → 1.1 → 1.0 with `300ms` spring
- Sidebar slides: `250ms ease-out`

---

## 🖥️ HEADER

```
┌──────────────────────────────────────────────────────────────┐
│  ✦  KRUSKAL ALGORITHM          [Reset] [Preset ▾] [Theme ☀]  │
│     Developed by Soham Khairnar                               │
└──────────────────────────────────────────────────────────────┘
```

- App name in `font-family: Outfit; font-weight: 700; font-size: 1.6rem`
- Subtle animated gradient underline on the title using `@keyframes`
- Tagline "Developed by Soham Khairnar" in `text-secondary`, `font-size: 0.8rem`
- Header has `backdrop-filter: blur(12px)` with semi-transparent bg

---

## 📐 LEFT SIDEBAR — Controls Panel

Width: `280px`, scrollable, fixed on the left.

### Section 1 — Mode Toggle
Three pill-shaped toggle buttons (only one active at a time):

| Button | Icon | Action |
|--------|------|--------|
| **Add Node** | ⬤ | Click canvas → place node |
| **Add Edge** | ━ | Click node A → click node B → prompt weight |
| **Pan / Select** | ✥ | Drag canvas; click node to highlight |

Active button glows with `--accent-purple` box-shadow.

### Section 2 — Add Node Form
```
Node Label:  [  A  ] (auto-increments A, B, C…)
             [+ Add Node]
```
- Clicking canvas in "Add Node" mode also places a node at cursor position
- Node label input: uppercase letters only, max 2 chars
- Button style: gradient `var(--accent-purple)` → `#a855f7`, glow on hover

### Section 3 — Add Edge Form
```
From: [ A ▾ ]   To: [ B ▾ ]
Weight: [──────●──] 1–50  value: 12
              [+ Add Edge]
```
- Weight input is **both** a range slider AND a number input (linked)
- Validation: prevent self-loops; prevent duplicate edges (show inline error)

### Section 4 — Algorithm Controls
```
 ┌─────────────────────────────┐
 │  [ ▶ Run ]  [ ⏭ Step ]      │
 │  [ ⏸ Pause ] [ ↺ Reset ]    │
 │                              │
 │  Speed:  [slow ──●── fast]   │
 └─────────────────────────────┘
```
- **Run**: auto-plays all steps with `setInterval` at current speed
- **Step**: advances one algorithm step at a time
- **Pause**: halts auto-play
- **Reset**: clears algorithm state but keeps graph (with confirmation toast)
- Speed slider: maps to interval delay 200ms–1500ms

### Section 5 — Graph Stats (live updating)
```
Nodes:       7
Edges:       9
MST Edges:   6  ← updates during run
MST Weight:  42 ← updates during run
Components:  1
```
Small monospaced numbers in `--font-mono`.

### Section 6 — Preset Graphs
Dropdown with 4 built-in examples:
1. Simple 5-node graph
2. Classic 7-node textbook MST
3. Dense 10-node graph
4. Disconnected graph (shows forest result)

---

## 🖼️ MAIN CANVAS — Graph Area

Full remaining width, full height. Dark background `--bg-primary`.

### Node Rendering
```
Each node = filled circle, radius 26px
  fill:          one of the pastel colors (cycled)
  stroke:        white, 2px, 60% opacity
  glow:          ctx.shadowBlur = 20, shadowColor = --glow-node
  label:         node letter, centered, Outfit 600, 16px, dark text
  state styles:
    default   → pastel fill + soft glow
    hovered   → scale 1.1, brighter glow, cursor: pointer
    selected  → pulsing glow animation (CSS @keyframes on overlay div)
    in-MST    → bright green border + glow (--glow-mst)
    active    → golden glow (--glow-active), slight scale
```

### Edge Rendering
```
Each edge = line between node centers
  strokeStyle:  state-dependent (see color table above)
  lineWidth:    default 2px | MST 3.5px | candidate 2.5px
  glow:         applied per state
  weight label: pill-shaped box at midpoint
    background: var(--bg-card)
    text:       var(--font-mono), 12px, white
    border:     1px solid var(--edge-default)
    padding:    2px 7px, border-radius 99px
```

### Edge States (color-coded during algorithm)
| State | Color | Glow |
|-------|-------|------|
| Unvisited | `--edge-default` (#3a3a5c) | none |
| Candidate (current) | `--edge-candidate` purple | purple glow |
| Accepted (MST) | `--edge-mst` green | green glow |
| Rejected (cycle) | `--edge-rejected` red | red glow, then fade back |

### Canvas Interactions
- **Right-click node** → context menu: [Rename, Delete Node, Delete Edges]
- **Right-click edge** → context menu: [Edit Weight, Delete Edge]
- **Scroll** → zoom in/out (transform scale on canvas, smooth)
- **Middle-drag / space+drag** → pan
- **Double-click canvas** → quick-add node at cursor (in Add Node mode)
- When adding edge: first clicked node gets a dashed "orbit" animation; draw a dotted line following the cursor to the second node

### MST Highlight Overlay
When algorithm completes, draw a subtle animated dashed path connecting all MST edges in sequence (like a trace effect).

---

## 📋 BOTTOM PANEL — Step Log

Height: `180px`, scrollable vertically.

```
┌─── Algorithm Steps ──────────────────────────────── [Clear] ──┐
│ ✦ Step 1 │ Sorted edges by weight: (A-B,2) (C-D,4) (B-C,5)…   │
│ ✓ Step 2 │ Edge A–B (weight 2) → Added to MST [components: 6] │
│ ✓ Step 3 │ Edge C–D (weight 4) → Added to MST [components: 5] │
│ ✗ Step 4 │ Edge A–C (weight 5) → REJECTED — forms a cycle     │
│ ▶ Step 5 │ Edge B–D (weight 6) → Added to MST [components: 4] │
└───────────────────────────────────────────────────────────────┘
```

- Each row slides in from below with `translateY(10px) → 0` + `opacity 0→1`
- Icon: ✦ (initial sort), ✓ (accepted), ✗ (rejected), ▶ (current)
- Accepted rows: left border `3px solid --edge-mst`
- Rejected rows: left border `3px solid --edge-rejected`, text strikethrough on edge name
- Current step row: highlighted background `rgba(124,111,255,0.15)`
- Auto-scroll to latest row

---

## ⚙️ KRUSKAL'S ALGORITHM IMPLEMENTATION

### Data Structures
```js
// Graph
const nodes = [];       // { id, label, x, y, color }
const edges = [];       // { id, from, to, weight, state }

// Algorithm state
let sortedEdges = [];   // edges sorted by weight asc
let mstEdges    = [];   // accepted edges
let stepIndex   = 0;
let parent      = {};   // Union-Find parent map
let rank        = {};   // Union-Find rank map
```

### Union-Find (Disjoint Set Union)
```js
function makeSet(nodes) {
  nodes.forEach(n => { parent[n.id] = n.id; rank[n.id] = 0; });
}

function find(x) {
  if (parent[x] !== x) parent[x] = find(parent[x]); // path compression
  return parent[x];
}

function union(x, y) {
  const rx = find(x), ry = find(y);
  if (rx === ry) return false;       // same component → cycle
  if (rank[rx] < rank[ry]) parent[rx] = ry;
  else if (rank[rx] > rank[ry]) parent[ry] = rx;
  else { parent[ry] = rx; rank[rx]++; }
  return true;
}
```

### Algorithm Steps Array
Pre-compute all steps before animating:
```js
function computeKruskalSteps() {
  makeSet(nodes);
  sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const steps = [{ type: 'sort', edges: sortedEdges }];

  sortedEdges.forEach(edge => {
    const accepted = union(edge.from, edge.to);
    steps.push({
      type:     accepted ? 'accept' : 'reject',
      edge,
      mstSoFar: [...mstEdges],
      message:  accepted
        ? `Edge ${edge.from}–${edge.to} (w=${edge.weight}) → Added to MST`
        : `Edge ${edge.from}–${edge.to} (w=${edge.weight}) → REJECTED (cycle)`,
    });
    if (accepted) mstEdges.push(edge);
  });

  steps.push({ type: 'complete', mst: mstEdges, totalWeight: mstEdges.reduce((s,e)=>s+e.weight,0) });
  return steps;
}
```

### Animation Loop
Use `requestAnimationFrame` for the canvas render loop. Separate the step-advance timer (`setInterval` for auto-play) from the render loop.

---

## 🏆 COMPLETION STATE

When algorithm finishes:
1. Show a **celebration modal** (centered card, no `position: fixed` — use flexbox wrapper):
   ```
   ┌────────────────────────────────┐
   │   🎉  MST Complete!            │
   │   Total Weight: 42             │
   │   Edges used:  6 / 9           │
   │   [View Details]  [Run Again]  │
   └────────────────────────────────┘
   ```
2. MST edges animate with a sequential glow "pulse" travelling along the path
3. Non-MST edges fade to 20% opacity
4. Confetti burst (use pure CSS/JS particles — no library)

---

## 🔔 TOAST NOTIFICATIONS

Show non-blocking toasts (top-right, stack vertically) for:
- "Node added: A"  → `--accent-green`
- "Edge added: A–B (weight 5)" → `--accent-purple`
- "Self-loop prevented" → `--accent-pink` (warning)
- "Duplicate edge" → `--accent-pink` (warning)
- "Graph reset" → `--text-secondary`

Toast style: `backdrop-filter: blur(10px)`, rounded `12px`, slide-in from right, auto-dismiss `3s`.

---

## 🖱️ CONTEXT MENUS

Custom context menus (not browser default):
```css
.context-menu {
  background: var(--bg-card);
  border: 1px solid rgba(124,111,255,0.3);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
  backdrop-filter: blur(16px);
  padding: 6px;
  animation: contextMenuIn 150ms cubic-bezier(0.34,1.56,0.64,1);
}
```

---

## 📱 RESPONSIVE BREAKPOINTS

| Width | Layout |
|-------|--------|
| > 1024px | Full 3-panel layout as described |
| 768–1024px | Sidebar collapses to icon-only; expand on click |
| < 768px | Sidebar becomes bottom sheet; canvas fills screen |

---

## ♿ ACCESSIBILITY

- All buttons have `aria-label`
- Canvas has `role="img"` with a live-updating `aria-label` describing the current graph state
- Color is never the sole indicator of state (icons + labels always accompany color coding)
- Keyboard shortcuts:
  - `N` → switch to Add Node mode
  - `E` → switch to Add Edge mode
  - `Space` → Step (when algorithm running)
  - `R` → Run / Pause toggle
  - `Escape` → Cancel current action / close modal

---

## 📁 FILE OUTPUT

Deliver as a **single file**: `kruskal-visualizer.html`

Structure:
```
kruskal-visualizer.html
├── <head>
│   ├── Google Fonts link
│   ├── <style> — all CSS (variables, layout, components, animations)
├── <body>
│   ├── Header
│   ├── Main layout (sidebar + canvas + bottom panel)
│   ├── Modal template (hidden)
│   ├── Context menu template (hidden)
│   └── <script> — all JS (graph, algorithm, rendering, UI)
```

---

## ✅ QUALITY CHECKLIST (verify before delivering)

- [ ] All pastel colors cycle correctly for new nodes
- [ ] Glow effects render on canvas nodes and edges
- [ ] Union-Find with path compression is correctly implemented
- [ ] Edge weight label renders at midpoint of every edge
- [ ] Step log auto-scrolls to latest entry
- [ ] Algorithm correctly identifies and marks cycle-forming edges in red
- [ ] MST total weight is displayed and accurate
- [ ] Preset graphs load correctly and reset properly
- [ ] Context menus close on outside click and `Escape`
- [ ] Toasts do not block canvas interactions
- [ ] Responsive layout works at 768px
- [ ] Smooth 60fps canvas animation loop
- [ ] No `console.error` in browser DevTools on load
- [ ] "Developed by Soham Khairnar" visible in header and page `<title>`

---

*End of prompt. Generate `kruskal-visualizer.html` now.*
