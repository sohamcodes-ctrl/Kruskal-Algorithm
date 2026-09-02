import { Network } from "lucide-react";

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
}