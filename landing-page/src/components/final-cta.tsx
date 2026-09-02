export default function FinalCTA() {
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
}