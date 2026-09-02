const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const files = {
  "navbar.tsx": `"use client";
import { motion } from "framer-motion";
import { Network, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Network className="w-5 h-5 text-primary" />
          <span className="font-semibold tracking-tight text-sm">Kruskal Visualizer</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
          <Link href="#home" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          <Link href="#algorithm" className="hover:text-foreground transition-colors">Algorithm</Link>
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
        </div>

        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-all">
          Launch Visualizer <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}`,
  
  "hero.tsx": `"use client";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-32 container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Interactive Graph Algorithm Visualizer
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Visualize <span className="gradient-text">Kruskal’s Algorithm.</span><br />
            Understand Every Step.
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Explore how a Minimum Spanning Tree is built step-by-step using Kruskal’s greedy approach. Watch edges get selected, rejected, and connected in real time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20">
              Launch Visualizer <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-muted text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/80 transition-all border border-border">
              Learn How It Works
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground font-medium">
            No setup required • Interactive • Educational
          </p>
        </motion.div>

        {/* Right Content - Static Graph Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative h-[400px] w-full rounded-2xl border border-white/10 glass-panel p-8 flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
          
          {/* Abstract Graph Representation */}
          <div className="relative w-full h-full max-w-sm mx-auto flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Edges */}
              {/* Rejected Edge */}
              <line x1="80" y1="120" x2="320" y2="120" stroke="#3f3f46" strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />
              <text x="200" y="110" fill="#a1a1aa" fontSize="12" textAnchor="middle">12 (Cycle)</text>
              
              {/* Normal/Unselected Edge */}
              <line x1="80" y1="280" x2="320" y2="280" stroke="#3f3f46" strokeWidth="2" />
              <text x="200" y="270" fill="#a1a1aa" fontSize="12" textAnchor="middle">8</text>
              
              {/* Selected MST Edges */}
              <motion.line x1="80" y1="120" x2="80" y2="280" stroke="#10b981" strokeWidth="4" filter="url(#glow)" />
              <text x="70" y="200" fill="#10b981" fontSize="12" textAnchor="end">4</text>
              
              <motion.line x1="320" y1="120" x2="320" y2="280" stroke="#10b981" strokeWidth="4" filter="url(#glow)" />
              <text x="330" y="200" fill="#10b981" fontSize="12" textAnchor="start">2</text>
              
              <motion.line x1="80" y1="120" x2="200" y2="200" stroke="#10b981" strokeWidth="4" filter="url(#glow)" />
              <text x="140" y="150" fill="#10b981" fontSize="12" textAnchor="end">5</text>
              
              <motion.line x1="320" y1="280" x2="200" y2="200" stroke="#10b981" strokeWidth="4" filter="url(#glow)" />
              <text x="260" y="250" fill="#10b981" fontSize="12" textAnchor="start">3</text>

              {/* Nodes */}
              {[
                { id: "A", x: 80, y: 120 },
                { id: "B", x: 320, y: 120 },
                { id: "C", x: 80, y: 280 },
                { id: "D", x: 320, y: 280 },
                { id: "E", x: 200, y: 200 },
              ].map((node, i) => (
                <motion.g 
                  key={node.id} 
                  initial={{ y: 0 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                >
                  <circle cx={node.x} cy={node.y} r="20" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
                  <circle cx={node.x} cy={node.y} r="20" fill="#10b981" opacity={["A","B","C","D","E"].includes(node.id) ? 0.1 : 0} />
                  <text x={node.x} y={node.y + 5} fill="#fafafa" fontSize="14" fontWeight="bold" textAnchor="middle">{node.id}</text>
                </motion.g>
              ))}
            </svg>
          </div>
          
          {/* Decorative floating UI elements */}
          <div className="absolute top-4 left-4 glass-panel px-3 py-2 rounded-lg border border-white/5 shadow-xl text-xs font-mono">
            <span className="text-primary">mst.push</span>(edge_AD)
          </div>
          <div className="absolute bottom-4 right-4 glass-panel px-3 py-2 rounded-lg border border-white/5 shadow-xl text-xs font-mono">
            cost: <span className="text-primary">14</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}`,

  "trust-strip.tsx": `export default function TrustStrip() {
  return (
    <div className="border-y border-white/5 bg-white/[0.01]">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
            Built to make graph algorithms easier to understand.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium text-foreground">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Step-by-Step Visualization
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Greedy Algorithm Explained
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Minimum Spanning Tree
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  "how-it-works.tsx": `"use client";
import { motion } from "framer-motion";
import { ListOrdered, CheckCircle2, RefreshCwOff, Network } from "lucide-react";

const steps = [
  {
    icon: ListOrdered,
    title: "01 — Sort Edges",
    desc: "Arrange all graph edges in ascending order of weight."
  },
  {
    icon: CheckCircle2,
    title: "02 — Pick the Smallest",
    desc: "Consider the smallest remaining edge."
  },
  {
    icon: RefreshCwOff,
    title: "03 — Avoid Cycles",
    desc: "Add the edge only if it does not create a cycle."
  },
  {
    icon: Network,
    title: "04 — Build the MST",
    desc: "Continue until the Minimum Spanning Tree is complete."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How Kruskal’s Algorithm Works</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">From sorted edges to a Minimum Spanning Tree.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-panel p-6 rounded-2xl hover:bg-white/[0.02] transition-colors border border-white/5"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
              <step.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}`,

  "visualizer-preview.tsx": `"use client";
import { motion } from "framer-motion";
import { Play, SkipBack, SkipForward, RotateCcw } from "lucide-react";

export default function VisualizerPreview() {
  return (
    <section className="py-24 bg-black/20 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">See the Algorithm in Action</h2>
          <p className="text-muted-foreground text-lg">A powerful interface to understand the mechanics.</p>
        </div>

        <div className="max-w-5xl mx-auto rounded-xl border border-white/10 glass-panel overflow-hidden shadow-2xl shadow-black/50">
          
          {/* Mac-like Header */}
          <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <div className="ml-auto text-xs font-mono text-muted-foreground bg-black/40 px-3 py-1 rounded-md">
              Kruskal's Visualizer Preview
            </div>
          </div>

          <div className="grid lg:grid-cols-4 min-h-[500px]">
            {/* Sidebar Tools */}
            <div className="border-r border-white/10 bg-black/40 p-6 flex flex-col gap-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Edge List</h4>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between p-2 rounded bg-primary/20 text-primary border border-primary/30">
                    <span>A - C</span> <span>Weight: 2</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-primary/20 text-primary border border-primary/30">
                    <span>C - D</span> <span>Weight: 3</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/5 text-muted-foreground">
                    <span>B - D</span> <span>Weight: 4</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/5 text-muted-foreground">
                    <span>A - B</span> <span>Weight: 7</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="glass-panel p-4 rounded-lg text-sm border-l-2 border-l-primary">
                  <p className="text-muted-foreground text-xs mb-1">Status</p>
                  <p className="font-semibold text-foreground">Current Edge: B — D</p>
                  <p className="text-foreground">Weight: 4</p>
                  <p className="text-primary mt-1 text-xs font-medium bg-primary/10 inline-block px-2 py-0.5 rounded">Action: Selected</p>
                </div>
              </div>
            </div>

            {/* Main Canvas */}
            <div className="lg:col-span-3 bg-[#0c0c0e] relative p-8 flex flex-col">
              
              <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:24px_24px]" />
                <svg width="100%" height="100%" viewBox="0 0 500 300" className="overflow-visible absolute inset-0 m-auto" style={{maxWidth: '400px', maxHeight: '250px'}}>
                  {/* Edges */}
                  <line x1="100" y1="100" x2="300" y2="100" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4" />
                  <line x1="100" y1="200" x2="300" y2="200" stroke="#10b981" strokeWidth="4" />
                  <line x1="100" y1="100" x2="100" y2="200" stroke="#10b981" strokeWidth="4" />
                  <line x1="300" y1="100" x2="300" y2="200" stroke="#10b981" strokeWidth="4" />
                  
                  {/* Nodes */}
                  <circle cx="100" cy="100" r="16" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
                  <text x="100" y="105" fill="#fafafa" fontSize="12" textAnchor="middle">A</text>
                  
                  <circle cx="300" cy="100" r="16" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
                  <text x="300" y="105" fill="#fafafa" fontSize="12" textAnchor="middle">B</text>
                  
                  <circle cx="100" cy="200" r="16" fill="#18181b" stroke="#10b981" strokeWidth="2" />
                  <text x="100" y="205" fill="#fafafa" fontSize="12" textAnchor="middle">C</text>
                  
                  <circle cx="300" cy="200" r="16" fill="#18181b" stroke="#10b981" strokeWidth="2" />
                  <text x="300" y="205" fill="#fafafa" fontSize="12" textAnchor="middle">D</text>
                </svg>
              </div>

              {/* Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-panel p-2 rounded-full border border-white/10 shadow-lg">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><SkipBack className="w-4 h-4" /></button>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><RotateCcw className="w-4 h-4" /></button>
                <button className="bg-primary text-primary-foreground p-3 rounded-full hover:scale-105 transition-transform"><Play className="w-4 h-4 fill-current" /></button>
                <button className="p-2 text-foreground hover:text-primary transition-colors"><SkipForward className="w-4 h-4" /></button>
              </div>
              
              {/* Step indicator */}
              <div className="absolute top-6 right-6 font-mono text-sm text-muted-foreground">
                Step 3 / 8
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}`,

  "features.tsx": `"use client";
import { MousePointer2, FastForward, Hash, RotateCcw, Target, Lightbulb } from "lucide-react";

const featureList = [
  { icon: MousePointer2, title: "Interactive Graph Visualization", desc: "Draw and interact with graph nodes and edges effortlessly." },
  { icon: FastForward, title: "Step-by-Step Execution", desc: "Control the algorithm's pace. Pause, rewind, or jump ahead." },
  { icon: Hash, title: "Edge Weight Visualization", desc: "Clearly see the weights that drive the greedy choices." },
  { icon: RotateCcw, title: "Cycle Detection Concept", desc: "Visually understand when and why a cycle is formed." },
  { icon: Target, title: "MST Construction", desc: "Watch the tree grow as optimal edges are connected." },
  { icon: Lightbulb, title: "Beginner-Friendly Learning", desc: "Designed specifically to bridge the gap between theory and intuition." }
];

export default function Features() {
  return (
    <section id="features" className="py-24 container mx-auto px-6">
      <div className="grid lg:grid-cols-3 gap-8">
        {featureList.map((f, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
            <div className="mt-1 bg-primary/10 text-primary p-2.5 rounded-lg border border-primary/20 h-fit">
              <f.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">{f.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}`,

  "why-kruskal.tsx": `import { Network } from "lucide-react";

export default function WhyKruskal() {
  return (
    <section id="algorithm" className="py-24 container mx-auto px-6 border-t border-white/5">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Why Learn Kruskal’s Algorithm?</h2>
          <div className="space-y-6">
            {[
              { title: "Greedy Algorithm Concept", desc: "Learn how making the locally optimal choice leads to a globally optimal solution." },
              { title: "Minimum Spanning Tree", desc: "Understand how to connect all vertices in a graph with the minimum total edge weight." },
              { title: "Graph Theory Fundamentals", desc: "Build a strong foundation for understanding complex networks, routing, and optimization." },
              { title: "Real-world Optimization", desc: "See the math behind network design, laying cables, and clustering algorithms." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-panel rounded-2xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-br from-black/40 to-primary/5">
          <Network className="absolute -right-8 -bottom-8 w-64 h-64 text-primary/10" />
          <h3 className="text-xl font-bold mb-4">Algorithm Complexity</h3>
          <div className="space-y-4 font-mono">
            <div className="bg-black/40 p-4 rounded-lg border border-white/5">
              <span className="text-muted-foreground text-sm block mb-1">Time Complexity</span>
              <span className="text-xl text-primary font-semibold">O(E log E)</span>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-white/5">
              <span className="text-muted-foreground text-sm block mb-1">Space Complexity</span>
              <span className="text-xl text-primary font-semibold">O(V + E)</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
            Where E = Number of edges, V = Number of vertices.<br/>
            Most of the work comes from sorting the edges and maintaining connected components (often using a Disjoint Set Data Structure).
          </p>
        </div>
      </div>
    </section>
  );
}`,

  "final-cta.tsx": `export default function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to See Kruskal’s Algorithm Differently?</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Stop reading about Minimum Spanning Trees. Visualize how they are built step-by-step.
        </p>
        <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/25">
          Launch Kruskal Visualizer →
        </button>
      </div>
    </section>
  );
}`,

  "footer.tsx": `export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
        <div>
          <div className="font-semibold text-foreground mb-1">Kruskal Visualizer</div>
          <p>An educational visualization of Kruskal’s Minimum Spanning Tree algorithm.</p>
        </div>
        
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="#" className="hover:text-foreground transition-colors">Visualizer</a>
          <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
        </div>
        
        <div>
          Built for learning • © 2026
        </div>
      </div>
    </footer>
  );
}`
};

Object.entries(files).forEach(([name, content]) => {
  fs.writeFileSync(path.join(dir, name), content);
});

console.log("Components created.");
