import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import PreambleSection from "@/components/PreambleSection";
import DigiCodeDatabase from "@/components/DigiCodeDatabase";
import ChatBot from "@/components/ChatBot";
import RecentCases from "@/components/RecentCases";
import InterpretationSection from "@/components/InterpretationSection";

const Index = () => {
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HeroSection />
      <PreambleSection />
      <DigiCodeDatabase />
      <ChatBot />
      <RecentCases />
      <InterpretationSection />
    </div>
  );
};

export default Index;
