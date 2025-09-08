import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UserJourney from "@/components/UserJourney";
import TechStack from "@/components/TechStack";
import BharatStrategy from "@/components/BharatStrategy";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section id="hero">
        <HeroSection />
      </section>
      <section id="journey">
        <UserJourney />
      </section>
      <section id="tech">
        <TechStack />
      </section>
      <section id="bharat">
        <BharatStrategy />
      </section>
      <section id="cta">
        <CTASection />
      </section>
      <Footer />
    </div>
  );
};

export default Index;
