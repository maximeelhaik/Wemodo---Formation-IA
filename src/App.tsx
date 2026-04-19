/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { WemodoLogo } from "./components/BrutalistUI";
import { AIQuiz } from "./apps/AIQuiz/AIQuiz";
import { HallucinationHunter } from "./apps/HallucinationHunter/HallucinationHunter";
import { PromptReviewer } from "./apps/PromptReviewer/PromptReviewer";
import { UseCaseGenerator } from "./apps/UseCaseGenerator/UseCaseGenerator";
import { MidjourneyArchitect } from "./apps/MidjourneyArchitect/MidjourneyArchitect";
import { GEN_AI_QUESTIONS, GEN_AI_QUESTIONS_L2 } from "./constants";

export default function App() {
  const [view, setView] = useState<"quiz" | "hunter" | "reviewer" | "generator" | "architect">("quiz");
  const [level, setLevel] = useState<1 | 2>(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync state with URL for development/deployment access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const appParam = params.get("app");
    const lvlParam = params.get("level");

    if (appParam === "hunter") {
      setView("hunter");
    } else if (appParam === "reviewer") {
      setView("reviewer");
    } else if (appParam === "mission") {
      setView("generator");
    } else if (appParam === "architect") {
      setView("architect");
    } else {
      setView("quiz");
      if (lvlParam === "2") {
        setLevel(2);
      } else {
        setLevel(1);
      }
    }
  }, []);

  const switchApp = (newView: "quiz" | "hunter" | "reviewer" | "generator" | "architect", newLvl: 1 | 2 = 1) => {
    setView(newView);
    setLevel(newLvl);
    setIsMobileMenuOpen(false);
    
    const url = new URL(window.location.href);
    url.searchParams.delete("level");
    const appValue = newView === "generator" ? "mission" : newView;
    url.searchParams.set("app", appValue);
    
    if (newView === "quiz") {
      url.searchParams.set("level", newLvl.toString());
    } else {
      url.searchParams.delete("level");
    }
    
    window.history.pushState({}, "", url);
  };

  return (
    <div className="h-screen flex flex-col bg-wemodo-cream overflow-hidden">
      {/* Header */}
      <header className="border-b-4 border-wemodo-navy p-3 md:p-4 bg-white z-50 shrink-0 relative">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 md:w-auto w-full justify-between">
            <div className="flex items-center">
              <WemodoLogo />
              <div className="hidden lg:block h-8 w-1 bg-wemodo-navy/10 mx-2" />
              <div className="font-display font-black text-xs md:text-sm italic uppercase tracking-tighter text-wemodo-purple ml-2">
                {view === "quiz" ? `QUIZ ${level}` : view === "hunter" ? "HALLUCINATION" : view === "reviewer" ? "PROMPT PROF" : view === "generator" ? "MISSION IA" : "ARCHITECTE MJ"}
              </div>
            </div>
            {/* Hamburger Button for mobile */}
            <button 
              className="md:hidden border-2 border-wemodo-navy bg-wemodo-yellow text-[10px] font-black px-3 py-2 uppercase shadow-[2px_2px_0px_0px_rgba(18,14,61,1)] active:shadow-none active:translate-y-0.5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              MENU
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-4 md:gap-6">
            {/* Dev Navigation - Buttons to switch apps */}
            <div className="flex gap-2 bg-wemodo-navy/5 p-1">
              <button 
                onClick={() => switchApp("quiz", 1)}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "quiz" && level === 1 ? 'bg-wemodo-yellow shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                QUIZ 1
              </button>
              <button 
                onClick={() => switchApp("quiz", 2)}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "quiz" && level === 2 ? 'bg-wemodo-purple text-white shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                QUIZ 2
              </button>
              <button 
                onClick={() => switchApp("hunter")}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "hunter" ? 'bg-wemodo-pink shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                HALLUCINATION
              </button>
              <button 
                onClick={() => switchApp("reviewer")}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "reviewer" ? 'bg-wemodo-yellow shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                PROMPT PROF
              </button>
              <button 
                onClick={() => switchApp("generator")}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "generator" ? 'bg-wemodo-purple text-white shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                MISSION IA
              </button>
              <button 
                onClick={() => switchApp("architect")}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "architect" ? 'bg-wemodo-pink shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                MJ PROMPT
              </button>
            </div>

            <a 
              href="https://wemodo.com" 
              target="_blank" 
              rel="noreferrer"
              className="bg-wemodo-navy text-white hover:bg-wemodo-purple transition-colors font-black uppercase text-[10px] md:text-xs border-2 border-wemodo-navy px-4 py-2 shadow-[2px_2px_0px_0px_rgba(244,255,126,1)]"
            >
              Wemodo.com
            </a>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b-4 border-b border-wemodo-navy p-4 flex flex-col gap-2 z-50">
             <button 
               onClick={() => switchApp("quiz", 1)}
               className={`text-xs font-black p-3 border-2 border-wemodo-navy text-left ${view === "quiz" && level === 1 ? 'bg-wemodo-yellow shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]' : 'bg-white'}`}
             >
               QUIZ NIVEAU 1
             </button>
             <button 
               onClick={() => switchApp("quiz", 2)}
               className={`text-xs font-black p-3 border-2 border-wemodo-navy text-left ${view === "quiz" && level === 2 ? 'bg-wemodo-purple text-white shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]' : 'bg-white'}`}
             >
               QUIZ NIVEAU 2
             </button>
             <button 
               onClick={() => switchApp("hunter")}
               className={`text-xs font-black p-3 border-2 border-wemodo-navy text-left ${view === "hunter" ? 'bg-wemodo-pink shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]' : 'bg-white'}`}
             >
               HALLUCINATION HUNTER
             </button>
             <button 
               onClick={() => switchApp("reviewer")}
               className={`text-xs font-black p-3 border-2 border-wemodo-navy text-left ${view === "reviewer" ? 'bg-wemodo-yellow shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]' : 'bg-white'}`}
             >
               PROMPT PROF
             </button>
             <button 
               onClick={() => switchApp("generator")}
               className={`text-xs font-black p-3 border-2 border-wemodo-navy text-left ${view === "generator" ? 'bg-wemodo-purple text-white shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]' : 'bg-white'}`}
             >
               MISSION IA
             </button>
             <button 
               onClick={() => switchApp("architect")}
               className={`text-xs font-black p-3 border-2 border-wemodo-navy text-left ${view === "architect" ? 'bg-wemodo-pink shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]' : 'bg-white'}`}
             >
               ARCHITECTE MJ
             </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden px-4 md:px-4 py-4 md:py-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto h-full w-full">
          {view === "quiz" ? (
            <AIQuiz 
              key={`quiz-${level}`} 
              questions={level === 1 ? GEN_AI_QUESTIONS : GEN_AI_QUESTIONS_L2} 
              level={level}
            />
          ) : view === "hunter" ? (
            <HallucinationHunter key="hunter" />
          ) : view === "reviewer" ? (
            <PromptReviewer key="reviewer" />
          ) : view === "architect" ? (
            <MidjourneyArchitect key="architect" />
          ) : (
            <UseCaseGenerator key="generator" />
          )}
        </div>
      </main>
    </div>
  );
}
