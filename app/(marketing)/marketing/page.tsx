import React from "react";
import MarketingMenubar from "@/components/ui/MarketingMenubar";
import CTA from "../cta/page";
import GetStarted from "../get-started/page";
import HowItWorks from "../how-it-works/page";
import Testimonials from "../testimonials/page";
import WhyChoose from "../why-choose/page";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white pt-4"> {/* Added padding at the top */}
      <MarketingMenubar />
      <div className="container mx-auto px-4 py-8 space-y-8"> {/* Reduced spacing */}
        <section className="p-8 bg-white rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
          <CTA />
        </section>
        
        <section className="p-8 bg-white rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
          <WhyChoose />
        </section>
        
        <section className="p-8 bg-white rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
          <HowItWorks />
        </section>
        
        <section className="p-8 bg-white rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
          <Testimonials />
        </section>
        
        <section className="p-8 bg-white rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
          <GetStarted />
        </section>
      </div>
    </div>
  );
}
