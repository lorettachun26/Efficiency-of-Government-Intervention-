import React, { useState } from "react";
import { POLICY_CONCEPTS, PolicyConcept } from "../data.ts";
import { HelpCircle, ArrowRight, ShieldCheck, Landmark, Scale } from "lucide-react";

export default function ConceptExplainer() {
  const [activeTab, setActiveTab] = useState<string>("price-ceiling");

  const activePolicy = POLICY_CONCEPTS.find((c) => qMatch(c.id, activeTab)) || POLICY_CONCEPTS[0];

  function qMatch(id: string, tab: string) {
    return id === tab;
  }

  return (
    <div id="concept-explainer-section" className="bg-white border border-black rounded-none p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Landmark className="w-4 h-4 text-neutral-950" />
        <h3 className="font-serif italic font-medium text-neutral-950 tracking-tight text-lg">Curriculum Concept Explainer</h3>
      </div>

      {/* Horizontal Tabs to select policy */}
      <div className="flex border-b border-black overflow-x-auto gap-2 mb-6 pb-px scrollbar-none">
        {POLICY_CONCEPTS.map((concept) => (
          <button
            key={concept.id}
            id={`explainer-tab-${concept.id}`}
            onClick={() => setActiveTab(concept.id)}
            className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === concept.id
                ? "border-black text-neutral-950 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {concept.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Theory Details (Left Column) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">Definition & Core Concept</span>
            <h4 className="text-xl font-serif font-bold text-neutral-950 tracking-tight mb-2">{activePolicy.name}</h4>
            <p className="text-neutral-700 text-sm leading-relaxed font-serif">{activePolicy.definition}</p>
          </div>

          <div className="p-4 bg-neutral-100 rounded-none border border-black text-xs">
            <div className="flex items-center gap-2 mb-2 font-serif font-bold text-neutral-950">
              <ShieldCheck className="w-4 h-4 text-neutral-800" />
              <span>HKDSE Condition for Effectiveness (有效條件)</span>
            </div>
            <p className="text-neutral-800 leading-relaxed font-medium font-serif italic">{activePolicy.conditionForEffectiveness}</p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">Theoretical Breakdown</span>
            {activePolicy.explanationDetails.map((detail, index) => (
              <div key={index} className="bg-neutral-50/50 p-4 rounded-none border border-black">
                <h5 className="font-serif font-bold text-neutral-950 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-none border border-black bg-white text-neutral-900 flex items-center justify-center text-[10px] font-mono font-semibold">
                    {index + 1}
                  </span>
                  {detail.title}
                </h5>
                <p className="text-neutral-700 text-xs leading-relaxed font-serif">{detail.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Welfare Impacts Matrix (Right Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-950 rounded-none p-6 text-white shadow-none">
            <div className="flex items-center gap-2 mb-4 text-neutral-300">
              <Scale className="w-4 h-4" />
              <span className="text-[10px] font-mono tracking-widest uppercase">Welfare Analysis Matrix</span>
            </div>
            <h4 className="text-sm font-serif italic font-bold tracking-tight mb-4">How effective {activePolicy.name.split(" ")[0]} impacts the market:</h4>

            <div className="space-y-3.5 text-xs font-serif">
              <div className="pb-3 border-b border-neutral-800 flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-neutral-200">Price paid by Consumers</p>
                  <p className="text-[11px] text-neutral-500 font-sans">How price changes for buyers</p>
                </div>
                <span className="font-mono bg-neutral-900 px-2 py-1 text-amber-400 text-[10px] font-bold shrink-0">
                  {activePolicy.id === "price-ceiling" && "↓ Decreases"}
                  {activePolicy.id === "price-floor" && "↑ Increases"}
                  {activePolicy.id === "quota" && "↑ Increases"}
                  {activePolicy.id === "tax" && "↑ Increases (Pc)"}
                  {activePolicy.id === "subsidy" && "↓ Decreases (Pc)"}
                </span>
              </div>

              <div className="pb-3 border-b border-neutral-800 flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-neutral-200">Quantity Transacted</p>
                  <p className="text-[11px] text-neutral-500 font-sans">The actual number of units sold</p>
                </div>
                <span className="font-mono bg-neutral-900 px-2 py-1 text-rose-400 text-[10px] font-bold shrink-0">
                  {activePolicy.id === "subsidy" ? "↑ Increases (Qs)" : "↓ Decreases"}
                </span>
              </div>

              <div className="pb-3 border-b border-neutral-800 flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-neutral-200">Consumer Surplus (CS)</p>
                  <p className="text-[11px] text-neutral-500 font-sans">Benefit to the buyers</p>
                </div>
                <span className="font-mono bg-neutral-900 px-2 py-1 text-[10px] text-neutral-400 font-bold shrink-0">
                  {activePolicy.id === "price-ceiling" && "Uncertain (elasticity)"}
                  {activePolicy.id === "price-floor" && "↓ Decreases"}
                  {activePolicy.id === "quota" && "↓ Decreases"}
                  {activePolicy.id === "tax" && "↓ Decreases"}
                  {activePolicy.id === "subsidy" && "↑ Increases"}
                </span>
              </div>

              <div className="pb-3 border-b border-neutral-800 flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-neutral-200">Producer Surplus (PS)</p>
                  <p className="text-[11px] text-neutral-500 font-sans">Benefit to the sellers</p>
                </div>
                <span className="font-mono bg-neutral-900 px-2 py-1 text-[10px] text-neutral-400 font-bold shrink-0">
                  {activePolicy.id === "price-ceiling" && "↓ Decreases"}
                  {activePolicy.id === "price-floor" && "Uncertain (elasticity)"}
                  {activePolicy.id === "quota" && "Uncertain (rent capture)"}
                  {activePolicy.id === "tax" && "↓ Decreases"}
                  {activePolicy.id === "subsidy" && "↑ Increases"}
                </span>
              </div>

              <div className="pb-3 border-b border-neutral-800 flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-neutral-200">Deadweight Loss (DWL)</p>
                  <p className="text-[11px] text-neutral-500 font-sans">Welfare lost due to inefficiency</p>
                </div>
                <span className="font-mono bg-rose-950/40 px-2 py-1 text-rose-400 text-[10px] font-bold border border-rose-900/60 shrink-0">
                  {"↑ Created (DWL > 0)"}
                </span>
              </div>
            </div>
          </div>

          {/* DSE Tip Card */}
          <div className="bg-neutral-50 p-5 rounded-none border border-black text-xs font-serif">
            <h5 className="font-bold text-neutral-950 mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>DSE Exam Strategy Tip</span>
            </h5>
            <div className="space-y-2 text-neutral-850 leading-relaxed">
              <p>In HKDSE explanations, **always define efficiency** before stating why a policy leads to Deadweight Loss.</p>
              <div className="bg-white p-2.5 rounded-none border border-black font-mono text-[10px] space-y-1.5 text-neutral-700">
                <p className="font-bold text-neutral-950">Logical Chain:</p>
                <div className="flex items-center gap-1">
                  <span>Equilibrium:</span>
                  <span className="font-bold">MB = MC</span>
                  <span>(Surplus Maximized)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Intervention:</span>
                  <span className="font-bold">MB &gt; MC</span>
                  <span>(Underproduction)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Or Subsidy:</span>
                  <span className="font-bold">MC &gt; MB</span>
                  <span>(Overproduction)</span>
                </div>
              </div>
              <p className="text-[11px] mt-2">Explicitly mentioning that the marginal benefit deviates from the marginal cost at the transacted quantity is a prerequisite to securing the full 4 to 6 marks in structured questions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
