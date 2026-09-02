"use client";
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
}