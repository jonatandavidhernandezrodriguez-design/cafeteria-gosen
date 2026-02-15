'use client';

import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { LandingFooter } from './components/LandingFooter';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <LandingFooter />
    </div>
  );
}
