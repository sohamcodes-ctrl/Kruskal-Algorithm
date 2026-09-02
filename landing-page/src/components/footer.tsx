export default function Footer() {
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
}