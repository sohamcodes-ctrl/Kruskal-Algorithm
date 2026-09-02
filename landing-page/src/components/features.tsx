"use client";
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
}