import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import ModerationBanner from "@/components/ModerationBanner";
import Debate from "@/components/Debate";
import MindMap from "@/components/MindMap";
import Poll from "@/components/Poll";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <ModerationBanner />
        <Debate />
        <MindMap />
        <Poll />
      </main>
      <Footer />
    </>
  );
}
