import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import TrustStrip from "@/components/trust-strip";
import HowItWorks from "@/components/how-it-works";
import VisualizerPreview from "@/components/visualizer-preview";
import Features from "@/components/features";
import WhyKruskal from "@/components/why-kruskal";
import FinalCTA from "@/components/final-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col">
      <Navbar />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <VisualizerPreview />
      <Features />
      <WhyKruskal />
      <FinalCTA />
      <Footer />
    </main>
  );
}
