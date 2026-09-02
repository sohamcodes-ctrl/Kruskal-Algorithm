"use client";
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
}