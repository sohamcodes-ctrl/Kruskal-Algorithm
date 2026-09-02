"use client";
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
}