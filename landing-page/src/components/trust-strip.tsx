export default function TrustStrip() {
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
}