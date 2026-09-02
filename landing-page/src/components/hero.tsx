"use client";
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
}