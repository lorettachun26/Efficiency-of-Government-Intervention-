import React, { useState } from "react";
import { Sliders, HelpCircle, Check, Info } from "lucide-react";

type PolicyType = "price-ceiling" | "price-floor" | "quota" | "tax" | "subsidy";

export default function InteractiveGraph() {
  const [policy, setPolicy] = useState<PolicyType>("price-ceiling");

  // State sliders for policy levels
  const [ceilingPrice, setCeilingPrice] = useState<number>(45);
  const [floorPrice, setFloorPrice] = useState<number>(75);
  const [quotaQty, setQuotaQty] = useState<number>(25);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [subsidyRate, setSubsidyRate] = useState<number>(20);

  // Model parameters: Demand: P = 100 - Q, Supply: P = 20 + Q
  // Equilibrium: 100 - Q = 20 + Q => 2Q = 80 => Qe = 40, Pe = 60
  const Qe = 40;
  const Pe = 60;

  // Coordinate transformation helpers for SVG (viewbox: 0 to 100 for Q, 0 to 100 for P)
  // Let's have SVG coordinates: width=360, height=360.
  // Origin (0,0) of economics is at bottom-left of SVG: (40, 320)
  // Q goes from 0 to 60. P goes from 0 to 110.
  const svgWidth = 400;
  const svgHeight = 400;
  const paddingLeft = 50;
  const paddingBottom = 50;
  const paddingTop = 30;
  const paddingRight = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxQ = 60;
  const maxP = 115;

  const getX = (q: number) => paddingLeft + (q / maxQ) * chartWidth;
  const getY = (p: number) => paddingTop + chartHeight - (p / maxP) * chartHeight;

  // Demand curve: P = 100 - Q => Qd = 100 - P
  const getDemandP = (q: number) => 100 - q;
  // Supply curve: P = 20 + Q => Qs = P - 20
  const getSupplyP = (q: number) => 20 + q;

  // Variables for calculated outputs
  let qTransacted = Qe;
  let pConsumer = Pe;
  let pProducer = Pe;
  let isEffective = true;
  let statusText = "Effective (有效)";

  let cs = 0;
  let ps = 0;
  let govRevenue = 0;
  let govExpenditure = 0;
  let quotaRent = 0;
  let dwl = 0;

  // Perform economic calculations based on policy and levels
  if (policy === "price-ceiling") {
    if (ceilingPrice >= Pe) {
      isEffective = false;
      statusText = "Ineffective (無效) - Price ceiling is set above the equilibrium price, so the market continues to clear at equilibrium.";
      qTransacted = Qe;
      pConsumer = Pe;
      pProducer = Pe;
      cs = 0.5 * (100 - Pe) * Qe; // 0.5 * 40 * 40 = 800
      ps = 0.5 * (Pe - 20) * Qe; // 0.5 * 40 * 40 = 800
      dwl = 0;
    } else {
      isEffective = true;
      statusText = "Effective (有效) - Set below equilibrium. Quantity transacted is restricted by quantity supplied, creating a shortage.";
      pConsumer = ceilingPrice;
      pProducer = ceilingPrice;
      // Supply restricts transacted quantity: Pc = 20 + Q => Q_supplied = Pc - 20
      qTransacted = Math.max(0, ceilingPrice - 20);
      const demandWillingnessToPay = getDemandP(qTransacted);

      // CS is the trapezoid below demand down to pConsumer up to qTransacted
      cs = 0.5 * ( (100 - pConsumer) + (demandWillingnessToPay - pConsumer) ) * qTransacted;
      // PS is the triangle below pProducer down to supply up to qTransacted
      ps = 0.5 * (pProducer - 20) * qTransacted;
      // DWL is the triangle between qTransacted and Qe, bounded by Demand and Supply
      dwl = 0.5 * (demandWillingnessToPay - pProducer) * (Qe - qTransacted);
    }
  } else if (policy === "price-floor") {
    if (floorPrice <= Pe) {
      isEffective = false;
      statusText = "Ineffective (無效) - Price floor is set below the equilibrium price, so the market continues to clear at equilibrium.";
      qTransacted = Qe;
      pConsumer = Pe;
      pProducer = Pe;
      cs = 0.5 * (100 - Pe) * Qe;
      ps = 0.5 * (Pe - 20) * Qe;
      dwl = 0;
    } else {
      isEffective = true;
      statusText = "Effective (有效) - Set above equilibrium. Quantity transacted is restricted by quantity demanded, creating a surplus.";
      pConsumer = floorPrice;
      pProducer = floorPrice;
      // Demand restricts transacted quantity: Pf = 100 - Q => Q_demanded = 100 - Pf
      qTransacted = Math.max(0, 100 - floorPrice);
      const supplyMinPrice = getSupplyP(qTransacted);

      // CS is the triangle below demand down to pConsumer up to qTransacted
      cs = 0.5 * (100 - pConsumer) * qTransacted;
      // PS is the trapezoid below pProducer down to supply up to qTransacted
      ps = 0.5 * ( (pProducer - 20) + (pProducer - supplyMinPrice) ) * qTransacted;
      // DWL is the triangle between qTransacted and Qe
      dwl = 0.5 * (pConsumer - supplyMinPrice) * (Qe - qTransacted);
    }
  } else if (policy === "quota") {
    if (quotaQty >= Qe) {
      isEffective = false;
      statusText = "Ineffective (無效) - Quota limit is set above the equilibrium quantity, so the market clears at equilibrium.";
      qTransacted = Qe;
      pConsumer = Pe;
      pProducer = Pe;
      cs = 0.5 * (100 - Pe) * Qe;
      ps = 0.5 * (Pe - 20) * Qe;
      dwl = 0;
    } else {
      isEffective = true;
      statusText = "Effective (有效) - Restricts quantity below equilibrium. This drives a wedge between consumers' demand price and producers' supply price.";
      qTransacted = quotaQty;
      pConsumer = getDemandP(quotaQty); // Pc = 100 - Qq
      pProducer = getSupplyP(quotaQty); // Pp = 20 + Qq
      quotaRent = (pConsumer - pProducer) * qTransacted;

      // CS is the triangle below demand down to Pc up to Qq
      cs = 0.5 * (100 - pConsumer) * qTransacted;
      // PS is the region below Pc down to supply up to Qq (including quota rent)
      ps = 0.5 * ( (pConsumer - 20) + (pConsumer - pProducer) ) * qTransacted;
      // DWL is the triangle from Qq to Qe
      dwl = 0.5 * (pConsumer - pProducer) * (Qe - qTransacted);
    }
  } else if (policy === "tax") {
    isEffective = true;
    statusText = "Effective - A per-unit tax shifts the supply curve upwards. Quantity decreases, consumer price increases, and producer price decreases.";
    // Supply with tax: P = 20 + Q + t
    // Equilibrium: 100 - Q = 20 + Q + t => 2Q = 80 - t => Qt = 40 - 0.5t
    qTransacted = Math.max(0, 40 - 0.5 * taxRate);
    pConsumer = 100 - qTransacted;
    pProducer = pConsumer - taxRate;
    govRevenue = taxRate * qTransacted;

    // CS
    cs = 0.5 * (100 - pConsumer) * qTransacted;
    // PS
    ps = 0.5 * (pProducer - 20) * qTransacted;
    // DWL
    dwl = 0.5 * taxRate * (Qe - qTransacted);
  } else if (policy === "subsidy") {
    isEffective = true;
    statusText = "Effective - A per-unit subsidy shifts the supply curve downwards. Quantity increases, consumer price decreases, and producer price increases.";
    // Supply with subsidy: P = 20 + Q - s
    // Equilibrium: 100 - Q = 20 + Q - s => 2Q = 80 + s => Qs = 40 + 0.5s
    qTransacted = Math.min(60, 40 + 0.5 * subsidyRate);
    pConsumer = 100 - qTransacted;
    pProducer = pConsumer + subsidyRate;
    govExpenditure = subsidyRate * qTransacted;

    // CS is the large triangle below demand down to pConsumer up to qTransacted
    cs = 0.5 * (100 - pConsumer) * qTransacted;
    // PS is the large triangle below pProducer down to supply up to qTransacted
    ps = 0.5 * (pProducer - 20) * qTransacted;
    // DWL represents overproduction: for units from Qe to Qs, MC > MB
    dwl = 0.5 * subsidyRate * (qTransacted - Qe);
  }

  // Pre-calculate key coordinates for SVG drawings
  const eqX = getX(Qe);
  const eqY = getY(Pe);
  const originX = getX(0);
  const originY = getY(0);
  const transX = getX(qTransacted);
  const pcY = getY(pConsumer);
  const ppY = getY(pProducer);
  const quotaX = getX(quotaQty);
  const kinkY = getY(20 + quotaQty);

  // Shading Path Generator Functions for SVG
  const getCSPath = () => {
    if (policy === "price-ceiling" && isEffective) {
      // Trapezoid
      const pWilling = getDemandP(qTransacted);
      return `M ${getX(0)} ${getY(100)} 
              L ${getX(0)} ${pcY} 
              L ${transX} ${pcY} 
              L ${transX} ${getY(pWilling)} 
              Z`;
    } else {
      // Standard CS Triangle
      return `M ${getX(0)} ${getY(100)} 
              L ${getX(0)} ${pcY} 
              L ${transX} ${pcY} 
              Z`;
    }
  };

  const getPSPath = () => {
    if (policy === "price-floor" && isEffective) {
      // Trapezoid
      const pMin = getSupplyP(qTransacted);
      return `M ${getX(0)} ${ppY} 
              L ${getX(0)} ${getY(20)} 
              L ${transX} ${getY(pMin)} 
              L ${transX} ${ppY} 
              Z`;
    } else if (policy === "quota" && isEffective) {
      // PS area includes the Quota Rent (trapezoid up to Pc)
      return `M ${getX(0)} ${pcY} 
              L ${getX(0)} ${getY(20)} 
              L ${transX} ${getY(pProducer)} 
              L ${transX} ${pcY} 
              Z`;
    } else {
      // Standard PS Triangle (or base supply curve triangle)
      return `M ${getX(0)} ${ppY} 
              L ${getX(0)} ${getY(20)} 
              L ${transX} ${getY(pProducer)} 
              Z`;
    }
  };

  const getDWLPath = () => {
    if (!isEffective) return "";
    if (policy === "subsidy") {
      // Right triangle (overproduction)
      return `M ${eqX} ${eqY} 
              L ${transX} ${pcY} 
              L ${transX} ${ppY} 
              Z`;
    } else {
      // Left triangle (underproduction)
      const pDemandVal = getDemandP(qTransacted);
      const pSupplyVal = getSupplyP(qTransacted);
      return `M ${transX} ${getY(pDemandVal)} 
              L ${transX} ${getY(pSupplyVal)} 
              L ${eqX} ${eqY} 
              Z`;
    }
  };

  const getTaxRevenuePath = () => {
    if (policy !== "tax" || !isEffective) return "";
    return `M ${getX(0)} ${pcY} 
            L ${getX(0)} ${ppY} 
            L ${transX} ${ppY} 
            L ${transX} ${pcY} 
            Z`;
  };

  const getSubsidyExpPath = () => {
    if (policy !== "subsidy" || !isEffective) return "";
    // Big rectangle from Pc to Pp up to Qs
    return `M ${getX(0)} ${ppY} 
            L ${getX(0)} ${pcY} 
            L ${transX} ${pcY} 
            L ${transX} ${ppY} 
            Z`;
  };

  const getQuotaRentPath = () => {
    if (policy !== "quota" || !isEffective) return "";
    return `M ${getX(0)} ${pcY} 
            L ${getX(0)} ${ppY} 
            L ${transX} ${ppY} 
            L ${transX} ${pcY} 
            Z`;
  };

  return (
    <div id="interactive-graphs-section" className="bg-white border border-black rounded-none overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* Policy Selection and Controls (Left Column) */}
      <div className="lg:col-span-5 p-6 md:p-8 bg-neutral-50/60 flex flex-col justify-between border-r border-black">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4 text-neutral-900" />
            <h3 className="font-serif italic font-medium text-gray-950 tracking-tight text-lg">Policy Controls & Parameters</h3>
          </div>

          {/* Policy Selector Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(["price-ceiling", "price-floor", "quota", "tax", "subsidy"] as PolicyType[]).map((p) => (
              <button
                key={p}
                id={`policy-btn-${p}`}
                onClick={() => setPolicy(p)}
                className={`px-3 py-1.5 rounded-none text-xs font-mono uppercase tracking-wider transition-all duration-150 cursor-pointer border ${
                  policy === p
                    ? "bg-neutral-900 text-white border-neutral-900 font-bold"
                    : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100 hover:text-black"
                }`}
              >
                {p === "price-ceiling" && "Ceiling"}
                {p === "price-floor" && "Floor"}
                {p === "quota" && "Quota"}
                {p === "tax" && "Tax"}
                {p === "subsidy" && "Subsidy"}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {/* Dynamic Sliders based on selected policy */}
            {policy === "price-ceiling" && (
              <div className="bg-white p-4 rounded-none border border-black">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-serif italic font-medium text-neutral-800">Price Ceiling (最高限價):</span>
                  <span className="font-mono font-bold text-neutral-900">${ceilingPrice}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={ceilingPrice}
                  onChange={(e) => setCeilingPrice(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-300 rounded-none appearance-none cursor-pointer accent-neutral-900"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                  <span>$20</span>
                  <span className="text-neutral-600 font-bold">$60 (Equilibrium)</span>
                  <span>$90</span>
                </div>
              </div>
            )}

            {policy === "price-floor" && (
              <div className="bg-white p-4 rounded-none border border-black">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-serif italic font-medium text-neutral-800">Price Floor (最低限價):</span>
                  <span className="font-mono font-bold text-neutral-900">${floorPrice}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={floorPrice}
                  onChange={(e) => setFloorPrice(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-300 rounded-none appearance-none cursor-pointer accent-neutral-900"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                  <span>$30</span>
                  <span className="text-neutral-600 font-bold">$60 (Equilibrium)</span>
                  <span>$100</span>
                </div>
              </div>
            )}

            {policy === "quota" && (
              <div className="bg-white p-4 rounded-none border border-black">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-serif italic font-medium text-neutral-800">Quota Limit (配額數量):</span>
                  <span className="font-mono font-bold text-neutral-900">{quotaQty} units</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="55"
                  value={quotaQty}
                  onChange={(e) => setQuotaQty(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-300 rounded-none appearance-none cursor-pointer accent-neutral-900"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                  <span>10 (Tight)</span>
                  <span className="text-neutral-600 font-bold">40 (Equilibrium)</span>
                  <span>55 (Loose)</span>
                </div>
              </div>
            )}

            {policy === "tax" && (
              <div className="bg-white p-4 rounded-none border border-black">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-serif italic font-medium text-neutral-800">Per-Unit Tax (從量稅):</span>
                  <span className="font-mono font-bold text-neutral-900">${taxRate}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-300 rounded-none appearance-none cursor-pointer accent-neutral-900"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                  <span>$0 (No Tax)</span>
                  <span>$30</span>
                  <span>$60 (High Tax)</span>
                </div>
              </div>
            )}

            {policy === "subsidy" && (
              <div className="bg-white p-4 rounded-none border border-black">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-serif italic font-medium text-neutral-800">Per-Unit Subsidy (從量津貼):</span>
                  <span className="font-mono font-bold text-neutral-900">${subsidyRate}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={subsidyRate}
                  onChange={(e) => setSubsidyRate(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-300 rounded-none appearance-none cursor-pointer accent-neutral-900"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                  <span>$0 (No Subsidy)</span>
                  <span>$20</span>
                  <span>$40 (High)</span>
                </div>
              </div>
            )}

            {/* Policy Status Badge */}
            <div className="p-4 rounded-none border border-black text-xs leading-relaxed bg-neutral-100 text-neutral-900">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-neutral-700" />
                <div>
                  <p className="font-serif italic font-bold mb-1 text-sm">{isEffective ? "Effective Policy (有效政策)" : "Ineffective Policy (無效政策)"}</p>
                  <p className="text-neutral-700 leading-normal">{statusText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Table */}
        {(policy === "tax" || policy === "subsidy" || (policy === "quota" && isEffective)) && (
          <div className="mt-8 pt-6 border-t border-black">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-3">Live Policy Statistics (政策數據統計)</h4>
            <table className="w-full text-xs font-serif border-collapse">
              <tbody>
                {policy === "tax" && (
                  <tr className="border-b border-neutral-200">
                    <td className="py-2 italic text-neutral-700">Total Tax Revenue (總稅收收入)</td>
                    <td className="py-2 text-right font-mono font-bold text-neutral-950">${govRevenue.toFixed(1)}</td>
                  </tr>
                )}

                {policy === "subsidy" && (
                  <tr className="border-b border-neutral-200">
                    <td className="py-2 italic text-neutral-700">Total Subsidy Granted (總補貼支出)</td>
                    <td className="py-2 text-right font-mono font-bold text-neutral-950">-${govExpenditure.toFixed(1)}</td>
                  </tr>
                )}

                {policy === "quota" && isEffective && (
                  <tr className="border-b border-neutral-200">
                    <td className="py-2 italic text-neutral-700">Total Quota Rent (總配額租金)</td>
                    <td className="py-2 text-right font-mono font-bold text-neutral-950">${quotaRent.toFixed(1)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SVG Graph Renderer (Right Column) */}
      <div className="lg:col-span-7 p-6 md:p-8 flex flex-col items-center justify-center bg-white">
        <div className="relative w-full max-w-[400px] aspect-square">
          <svg
            id="market-intervention-svg"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full select-none"
          >
            {/* Definitions for Gradients and Markers */}
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#1A1A1A" />
              </marker>
            </defs>

            {/* Areas Shading */}
            {/* 1. Consumer Surplus (CS) - Shaded green / minimal */}
            <path
              d={getCSPath()}
              fill="#00008B"
              fillOpacity="0.08"
              stroke="#00008B"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />

            {/* 2. Producer Surplus (PS) - Shaded blue / minimal */}
            <path
              d={getPSPath()}
              fill="#8B0000"
              fillOpacity="0.08"
              stroke="#8B0000"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />

            {/* 3. Tax Revenue */}
            {policy === "tax" && isEffective && (
              <g id="tax-revenue-group">
                <path
                  d={getTaxRevenuePath()}
                  fill="#1A1A1A"
                  fillOpacity="0.07"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                />
                {taxRate > 0 && (
                  <g id="tax-revenue-labels">
                    <text
                      x={(getX(0) + transX) / 2}
                      y={((pcY + ppY) / 2) - 3}
                      textAnchor="middle"
                      fill="#1A1A1A"
                      stroke="#FDFCFB"
                      strokeWidth="3.5"
                      paintOrder="stroke"
                      className="text-[9px] font-mono font-bold tracking-wider"
                    >
                      TOTAL TAX REVENUE
                    </text>
                    <text
                      x={(getX(0) + transX) / 2}
                      y={((pcY + ppY) / 2) + 7}
                      textAnchor="middle"
                      fill="#1A1A1A"
                      stroke="#FDFCFB"
                      strokeWidth="3.5"
                      paintOrder="stroke"
                      className="text-[8px] font-mono font-bold"
                    >
                      ${taxRate} × {qTransacted.toFixed(1)} = ${govRevenue.toFixed(1)}
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* 4. Subsidy Cost Area */}
            {policy === "subsidy" && isEffective && (
              <g id="subsidy-cost-group">
                <path
                  d={getSubsidyExpPath()}
                  fill="#1A1A1A"
                  fillOpacity="0.04"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                {subsidyRate > 0 && (
                  <g id="subsidy-cost-labels">
                    <text
                      x={(getX(0) + transX) / 2}
                      y={((pcY + ppY) / 2) - 3}
                      textAnchor="middle"
                      fill="#1A1A1A"
                      stroke="#FDFCFB"
                      strokeWidth="3.5"
                      paintOrder="stroke"
                      className="text-[9px] font-mono font-bold tracking-wider"
                    >
                      TOTAL SUBSIDY GRANTED
                    </text>
                    <text
                      x={(getX(0) + transX) / 2}
                      y={((pcY + ppY) / 2) + 7}
                      textAnchor="middle"
                      fill="#1A1A1A"
                      stroke="#FDFCFB"
                      strokeWidth="3.5"
                      paintOrder="stroke"
                      className="text-[8px] font-mono font-bold"
                    >
                      ${subsidyRate} × {qTransacted.toFixed(1)} = ${govExpenditure.toFixed(1)}
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* 5. Quota Rent Area */}
            {policy === "quota" && isEffective && (
              <path
                d={getQuotaRentPath()}
                fill="#1A1A1A"
                fillOpacity="0.08"
                stroke="#1A1A1A"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            )}

            {/* 6. Deadweight Loss (DWL) - Shaded solid crimson Red */}
            {isEffective && dwl > 0 && (
              <path
                d={getDWLPath()}
                fill="#E11D48"
                fillOpacity="0.22"
                stroke="#E11D48"
                strokeWidth="1.5"
              />
            )}

            {/* Grid Lines (Base Equilibrium reference) */}
            <line
              x1={getX(0)}
              y1={eqY}
              x2={eqX}
              y2={eqY}
              stroke="#A3A3A3"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1={eqX}
              y1={originY}
              x2={eqX}
              y2={eqY}
              stroke="#A3A3A3"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Policy specific lines */}
            {/* Price Ceiling Line */}
            {policy === "price-ceiling" && (
              <g>
                <line
                  x1={getX(0)}
                  y1={pcY}
                  x2={getX(maxQ)}
                  y2={pcY}
                  stroke="#E11D48"
                  strokeWidth="2"
                />
                <text
                  x={getX(maxQ - 18)}
                  y={pcY - 6}
                  fill="#E11D48"
                  className="text-[9px] font-bold font-mono tracking-wider"
                >
                  PRICE CEILING (Pc)
                </text>
              </g>
            )}

            {/* Price Floor Line */}
            {policy === "price-floor" && (
              <g>
                <line
                  x1={getX(0)}
                  y1={pcY}
                  x2={getX(maxQ)}
                  y2={pcY}
                  stroke="#E11D48"
                  strokeWidth="2"
                />
                <text
                  x={getX(maxQ - 16)}
                  y={pcY - 6}
                  fill="#E11D48"
                  className="text-[9px] font-bold font-mono tracking-wider"
                >
                  PRICE FLOOR (Pf)
                </text>
              </g>
            )}

            {/* Quota Guideline to Kink Point */}
            {policy === "quota" && (
              <g id="quota-guideline-group">
                <line
                  x1={quotaX}
                  y1={originY}
                  x2={quotaX}
                  y2={kinkY}
                  stroke="#8B0000"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              </g>
            )}

            {/* Tax Shifted Supply Curve */}
            {policy === "tax" && isEffective && taxRate > 0 && (
              <g>
                <line
                  x1={getX(0)}
                  y1={getY(20 + taxRate)}
                  x2={getX(maxQ)}
                  y2={getY(20 + maxQ + taxRate)}
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text
                  x={getX(maxQ - 8)}
                  y={getY(20 + maxQ + taxRate - 4)}
                  fill="#1A1A1A"
                  className="text-[9px] font-bold font-mono"
                >
                  S + Tax
                </text>
              </g>
            )}

            {/* Subsidy Shifted Supply Curve */}
            {policy === "subsidy" && isEffective && subsidyRate > 0 && (
              <g>
                <line
                  x1={getX(0)}
                  y1={getY(Math.max(0, 20 - subsidyRate))}
                  x2={getX(maxQ)}
                  y2={getY(20 + maxQ - subsidyRate)}
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text
                  x={getX(maxQ - 12)}
                  y={getY(20 + maxQ - subsidyRate + 4)}
                  fill="#1A1A1A"
                  className="text-[9px] font-bold font-mono"
                >
                  S - Subsidy
                </text>
              </g>
            )}

            {/* Core Curves */}
            {/* Demand Curve (D) */}
            <line
              x1={getX(0)}
              y1={getY(100)}
              x2={getX(maxQ)}
              y2={getY(100 - maxQ)}
              stroke="#00008B"
              strokeWidth="2"
            />
            <text
              x={getX(maxQ - 4)}
              y={getY(100 - maxQ) - 6}
              fill="#00008B"
              className="text-xs font-serif font-bold italic"
            >
              D
            </text>

            {/* Supply Curve (S) */}
            {policy !== "quota" ? (
              <g id="standard-supply-curve">
                <line
                  x1={getX(0)}
                  y1={getY(20)}
                  x2={getX(maxQ)}
                  y2={getY(20 + maxQ)}
                  stroke="#8B0000"
                  strokeWidth="2.5"
                />
                <text
                  x={getX(maxQ - 4)}
                  y={getY(20 + maxQ) - 6}
                  fill="#8B0000"
                  className="text-xs font-serif font-bold italic"
                >
                  S
                </text>
              </g>
            ) : (
              <g id="kinked-supply-quota">
                {/* 1. Thin dashed line for the original un-restricted supply curve beyond Qq as a reference */}
                <line
                  x1={getX(0)}
                  y1={getY(20)}
                  x2={getX(maxQ)}
                  y2={getY(20 + maxQ)}
                  stroke="#D4D4D4"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={getX(maxQ - 4)}
                  y={getY(20 + maxQ) - 6}
                  fill="#A3A3A3"
                  className="text-xs font-serif font-bold italic"
                >
                  S (Original)
                </text>

                {/* 2. Sloped part of the kinked supply curve: from (0, 20) to (quotaQty, 20 + quotaQty) */}
                <line
                  x1={getX(0)}
                  y1={getY(20)}
                  x2={quotaX}
                  y2={kinkY}
                  stroke="#8B0000"
                  strokeWidth="3"
                />

                {/* 3. Vertical part of the kinked supply curve: from (quotaQty, 20 + quotaQty) straight up to maxP */}
                <line
                  x1={quotaX}
                  y1={kinkY}
                  x2={quotaX}
                  y2={getY(maxP)}
                  stroke="#8B0000"
                  strokeWidth="3"
                />

                {/* Label for the new kinked supply curve S' */}
                <text
                  x={quotaX + 6}
                  y={getY(maxP - 10)}
                  fill="#8B0000"
                  className="text-xs font-serif font-bold italic"
                >
                  S' (Kinked Supply)
                </text>
              </g>
            )}

            {/* Intersect Dots and Guidelines under Policy */}
            {isEffective && (
              <g>
                {/* Vertical quantity line */}
                <line
                  x1={transX}
                  y1={originY}
                  x2={transX}
                  y2={Math.min(pcY, ppY)}
                  stroke="#1A1A1A"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Price Guidelines */}
                <line
                  x1={originX}
                  y1={pcY}
                  x2={transX}
                  y2={pcY}
                  stroke="#1A1A1A"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                {pcY !== ppY && (
                  <line
                     x1={originX}
                     y1={ppY}
                     x2={transX}
                     y2={ppY}
                     stroke="#1A1A1A"
                     strokeWidth="1"
                     strokeDasharray="2 2"
                   />
                )}

                {/* Dots at key points */}
                <circle cx={transX} cy={pcY} r="3" fill="#1A1A1A" />
                {pcY !== ppY && <circle cx={transX} cy={ppY} r="3" fill="#1A1A1A" />}
              </g>
            )}

            {/* Base Equilibrium Dot */}
            <circle cx={eqX} cy={eqY} r="3.5" fill="#1A1A1A" />

            {/* Axis Lines */}
            <line
              x1={paddingLeft}
              y1={chartHeight + paddingTop}
              x2={paddingLeft + chartWidth + 10}
              y2={chartHeight + paddingTop}
              stroke="#1A1A1A"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
            <line
              x1={paddingLeft}
              y1={chartHeight + paddingTop}
              x2={paddingLeft}
              y2={paddingTop - 10}
              stroke="#1A1A1A"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />

            {/* Axis Labels */}
            <text
              x={paddingLeft - 15}
              y={paddingTop - 15}
              fill="#1A1A1A"
              className="text-[10px] font-mono uppercase font-bold"
            >
              P
            </text>
            <text
              x={svgWidth - 25}
              y={chartHeight + paddingTop + 15}
              fill="#1A1A1A"
              className="text-[10px] font-mono uppercase font-bold"
            >
              Q
            </text>

            {/* Grid tick marks */}
            {/* Origin */}
            <text
              x={paddingLeft - 10}
              y={chartHeight + paddingTop + 12}
              fill="#1A1A1A"
              className="text-[9px] font-mono"
            >
              0
            </text>

            {/* Pe (60) */}
            <text
              x={paddingLeft - 22}
              y={eqY + 3}
              fill="#1A1A1A"
              className="text-[9px] font-mono"
            >
              Pe
            </text>
            {/* Qe (40) */}
            <text
              x={eqX - 5}
              y={chartHeight + paddingTop + 14}
              fill="#1A1A1A"
              className="text-[9px] font-mono"
            >
              Qe
            </text>

            {/* Policy specific ticks */}
            {isEffective && (
              <g>
                {/* Pc Tick */}
                <text
                  x={paddingLeft - 22}
                  y={pcY + 3}
                  fill="#E11D48"
                  className="text-[9px] font-mono font-bold"
                >
                  Pc
                </text>
                {/* Pp Tick if different */}
                {pcY !== ppY && (
                  <text
                    x={paddingLeft - 22}
                    y={ppY + 3}
                    fill="#1A1A1A"
                    className="text-[9px] font-mono font-bold"
                  >
                    Pp
                  </text>
                )}
                {/* Qt Tick (only for non-quota policies, as quota has its own Qq tick) */}
                {policy !== "quota" && (
                  <text
                    x={transX - 5}
                    y={chartHeight + paddingTop + 14}
                    fill="#E11D48"
                    className="text-[9px] font-mono font-bold"
                  >
                    Q'
                  </text>
                )}
              </g>
            )}

            {/* Quota-specific ticks (always shown when policy is quota) */}
            {policy === "quota" && (
              <g id="quota-ticks">
                <text
                  x={quotaX - 5}
                  y={chartHeight + paddingTop + 14}
                  fill="#8B0000"
                  className="text-[9px] font-mono font-bold"
                >
                  Qq
                </text>
                {/* Tick mark line on the x-axis */}
                <line
                  x1={quotaX}
                  y1={chartHeight + paddingTop}
                  x2={quotaX}
                  y2={chartHeight + paddingTop + 4}
                  stroke="#8B0000"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] text-neutral-600 bg-neutral-50 p-4 rounded-none border border-black max-w-[400px] w-full font-serif">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#00008B] opacity-10 border border-[#00008B] block"></span>
            <span>Consumer Surplus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#8B0000] opacity-10 border border-[#8B0000] block"></span>
            <span>Producer Surplus</span>
          </div>
          {isEffective && dwl > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#E11D48] opacity-25 border border-[#E11D48] block"></span>
              <span className="font-sans font-bold text-red-600 uppercase text-[9px] tracking-wider">Deadweight Loss (DWL)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
