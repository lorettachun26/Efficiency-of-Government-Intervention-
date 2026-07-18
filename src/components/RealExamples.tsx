import React, { useState } from "react";
import { REAL_EXAMPLES, RealExample } from "../data.ts";
import { BookOpen, MapPin, Tag, HelpCircle, ArrowUpRight } from "lucide-react";

export default function RealExamples() {
  const [selectedExample, setSelectedExample] = useState<RealExample | null>(null);

  return (
    <div id="real-examples-section" className="bg-white border border-black rounded-none p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-4 h-4 text-neutral-950" />
        <h3 className="font-serif italic font-medium text-neutral-950 tracking-tight text-lg">Real-World Case Studies</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REAL_EXAMPLES.map((ex, index) => {
          return (
            <div
              key={index}
              onClick={() => setSelectedExample(ex)}
              className="group border border-black bg-white hover:bg-neutral-50 p-5 rounded-none cursor-pointer flex flex-col justify-between transition-colors duration-150"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded-none font-bold uppercase font-mono border border-black bg-neutral-100 text-neutral-800 tracking-wider text-[9px]">
                    {ex.policyType}
                  </span>
                  <div className="flex items-center gap-1 text-neutral-500 font-mono text-[9px]">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{ex.location}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-neutral-950 text-sm group-hover:underline flex items-center justify-between gap-2">
                    {ex.title}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-neutral-800 transition-all duration-150 shrink-0" />
                  </h4>
                  <p className="text-neutral-600 font-serif text-xs mt-1.5 line-clamp-3 leading-relaxed">
                    {ex.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-black pt-3 mt-4 text-[9px] text-neutral-950 font-mono font-bold uppercase tracking-wider">
                View Economic Analysis →
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-out or Modal Backdrop for Analysis Detail */}
      {selectedExample && (
        <div 
          className="fixed inset-0 bg-neutral-900/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedExample(null)}
        >
          <div 
            className="bg-white rounded-none max-w-xl w-full p-6 md:p-8 space-y-5 border-2 border-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-1">Economic Analysis Detail</span>
                <h3 className="text-lg font-serif italic font-bold text-neutral-950 tracking-tight">{selectedExample.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedExample(null)}
                className="w-7 h-7 rounded-none bg-white hover:bg-neutral-100 border border-black text-neutral-900 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-4 text-xs font-mono text-[10px]">
              <div className="flex items-center gap-1 text-neutral-600">
                <Tag className="w-3.5 h-3.5 text-neutral-700" />
                <span>{selectedExample.policyType}</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-600">
                <MapPin className="w-3.5 h-3.5 text-neutral-700" />
                <span>{selectedExample.location}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <p className="font-mono tracking-widest text-neutral-400 uppercase text-[9px] font-bold">Real-World Scenario</p>
                <p className="text-neutral-700 leading-relaxed font-serif">{selectedExample.description}</p>
              </div>

              <div className="bg-[#FDFCFB]/45 border border-black p-4 rounded-none space-y-1.5">
                <p className="font-mono tracking-widest text-neutral-400 uppercase text-[9px] font-bold">DSE Syllabus Economic Analysis</p>
                <p className="text-neutral-950 leading-relaxed font-serif font-medium">{selectedExample.economicAnalysis}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedExample(null)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white border border-black rounded-none text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
