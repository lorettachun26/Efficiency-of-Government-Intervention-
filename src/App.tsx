import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import InteractiveGraph from "./components/InteractiveGraph.tsx";
import ConceptExplainer from "./components/ConceptExplainer.tsx";
import PracticePanel from "./components/PracticePanel.tsx";
import RealExamples from "./components/RealExamples.tsx";
import { 
  Sliders, 
  Landmark, 
  Brain, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  ChevronRight, 
  Award,
  BookMarked
} from "lucide-react";

type MainTab = "graphs" | "theory" | "practice" | "examples";

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>("graphs");

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#1A1A1A] antialiased flex flex-col selection:bg-neutral-900 selection:text-white">
      
      {/* Upper Curriculum Banner */}
      <div className="bg-neutral-950 text-neutral-200 text-xs py-2.5 px-4 font-mono flex items-center justify-between border-b border-black">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#FDFCFB] text-[#1A1A1A] font-bold px-2 py-0.5 rounded-none text-[10px] tracking-wider border border-black font-mono">
              HKDSE ECONOMICS
            </span>
            <span className="text-neutral-400 font-sans text-[11px]">Compulsory Part • Topic E: Efficiency, Equity and the Role of Government</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-300 hover:text-white transition-colors duration-150">
            <BookMarked className="w-3.5 h-3.5" />
            <span className="font-sans">Aligned with C&A Guide (effective 2025/26)</span>
          </div>
        </div>
      </div>

      {/* Main Elegant Header */}
      <header className="border-b border-black bg-[#FDFCFB] py-8 px-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 font-mono">HKDSE Economics / Module E.ii</p>
            <h1 className="font-serif italic font-medium text-4xl md:text-5xl text-[#1A1A1A] tracking-tight leading-none flex flex-wrap items-center gap-3">
              Market Intervention & Efficiency
            </h1>
            <p className="text-neutral-600 text-xs md:text-sm max-w-2xl leading-relaxed font-serif">
              An interactive visualizer suite designed for Secondary 4-6 students to master the efficiency effects of Price Ceilings, Price Floors, Quotas, Taxes, and Subsidies.
            </p>
          </div>

          {/* Mini Progress Card / Stats */}
          <div className="bg-neutral-50 border border-black p-4 flex items-center gap-4 shrink-0 max-w-sm">
            <div className="w-10 h-10 rounded-none bg-white border border-black flex items-center justify-center text-neutral-900">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Active Study Session</p>
              <p className="text-xs font-serif italic font-semibold text-neutral-900 leading-snug">Syllabus Topic E.ii (Deviations)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1 flex flex-col gap-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-neutral-300 w-full">
          <div className="flex flex-wrap gap-2 md:gap-6 -mb-[1px]">
            
            <button
              id="main-tab-graphs"
              onClick={() => setActiveTab("graphs")}
              className={`pb-3 px-1 text-xs font-mono uppercase tracking-widest transition-all duration-200 flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === "graphs"
                  ? "border-black text-black font-bold"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Graphs</span>
            </button>

            <button
              id="main-tab-theory"
              onClick={() => setActiveTab("theory")}
              className={`pb-3 px-1 text-xs font-mono uppercase tracking-widest transition-all duration-200 flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === "theory"
                  ? "border-black text-black font-bold"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Theory Explainer</span>
            </button>

            <button
              id="main-tab-practice"
              onClick={() => setActiveTab("practice")}
              className={`pb-3 px-1 text-xs font-mono uppercase tracking-widest transition-all duration-200 flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === "practice"
                  ? "border-black text-black font-bold"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>DSE Practice</span>
            </button>

            <button
              id="main-tab-examples"
              onClick={() => setActiveTab("examples")}
              className={`pb-3 px-1 text-xs font-mono uppercase tracking-widest transition-all duration-200 flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === "examples"
                  ? "border-black text-black font-bold"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Case Studies</span>
            </button>

          </div>
        </div>

        {/* Dynamic Tab Render with Slide/Fade Animate */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full"
            >
              {activeTab === "graphs" && <InteractiveGraph />}
              {activeTab === "theory" && <ConceptExplainer />}
              {activeTab === "practice" && <PracticePanel />}
              {activeTab === "examples" && <RealExamples />}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* High-quality DSE Syllabus Reference Quick-guide Banner */}
      <section className="bg-neutral-50 border-t border-black py-12 px-4 mt-12">
        <div className="max-w-7xl mx-auto w-full">
          <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6 block">Syllabus Insights & Core Conditions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 bg-white border border-black">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-neutral-900"></span>
                <h4 className="font-serif italic font-bold text-gray-950 text-base">MB = MC Condition</h4>
              </div>
              <p className="text-neutral-600 text-xs leading-relaxed font-sans">
                In a perfectly competitive market with no externalities, efficiency is achieved when Marginal Benefit (MB) equals Marginal Cost (MC) at the last unit transacted. Total Social Surplus is maximized.
              </p>
            </div>
            <div className="space-y-3 p-6 bg-white border border-black">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-600"></span>
                <h4 className="font-serif italic font-bold text-gray-950 text-base">Underproduction Inefficiency</h4>
              </div>
              <p className="text-neutral-600 text-xs leading-relaxed font-sans">
                Price ceilings, price floors, quotas, and taxes restrict transaction quantities below the equilibrium. Since MB &gt; MC for the foregone units, mutually beneficial trades are lost, creating Deadweight Loss.
              </p>
            </div>
            <div className="space-y-3 p-6 bg-white border border-black">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-600"></span>
                <h4 className="font-serif italic font-bold text-gray-950 text-base">Overproduction Inefficiency</h4>
              </div>
              <p className="text-neutral-600 text-xs leading-relaxed font-sans">
                Subsidies stimulate transacted quantities beyond the equilibrium level. For these extra units, the Marginal Cost of production is greater than the Marginal Benefit of consumption (MC &gt; MB), leading to a waste of resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-300 py-8 px-4 text-xs border-t border-black font-mono">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="font-medium text-neutral-400">
            © {new Date().getFullYear()} HKDSE Economics Interactive Learning Platform. 
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <span className="text-neutral-200">MODE: EXAM_PREP</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-200">CURRICULUM: C&A GUIDE 2024</span>
            <span className="text-neutral-600">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 animate-pulse"></span>
              <span className="text-neutral-300">AUTO-GRADED ACTIVATED</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
