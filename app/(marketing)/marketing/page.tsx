// app/(marketing)/marketing/page.tsx

import React from "react";
import MarketingMenubar from "@/components/ui/MarketingMenubar";
import CTA from "../cta/page";
import GetStarted from "../get-started/page";
import HowItWorks from "../how-it-works/page";
import Testimonials from "../testimonials/page";
import WhyChoose from "../why-choose/page";

export default function MarketingPage() {
  return (
    <div>
      <MarketingMenubar />
      <div className="space-y-16">
        <CTA />
        <WhyChoose />
        <HowItWorks />
        <Testimonials />
        <GetStarted />
      </div>
    </div>
  );
}
