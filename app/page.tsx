import LandingNav from "@/components/landing/LandingNav";
import Hero from "@/components/landing/Hero";
import Pills from "@/components/landing/Pills";
import DemoChat from "@/components/landing/DemoChat";
import ValueProps from "@/components/landing/ValueProps";
import Pricing from "@/components/landing/Pricing";
import HowItWorks from "@/components/landing/HowItWorks";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import VisualPlaceholder from "@/components/landing/VisualPlaceholder";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f7f6f3] text-[#0b0b0b]">
      <LandingNav />
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-16">
        <Hero />
        <div className="mt-6">
          <Pills />
        </div>
        <VisualPlaceholder />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <DemoChat />
          <ValueProps />
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-14">
        <Pricing />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <HowItWorks />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <FAQ />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <FinalCTA />
      </section>

      <Footer />
    </main>
  );
}
