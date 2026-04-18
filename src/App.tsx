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
import { GEN_AI_QUESTIONS, GEN_AI_QUESTIONS_L2 } from "./constants";

export default function App() {
  const [view, setView] = useState<"quiz" | "hunter" | "reviewer" | "generator">("quiz");
  const [level, setLevel] = useState<1 | 2>(1);

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
    } else {
      setView("quiz");
      if (lvlParam === "2") {
        setLevel(2);
      } else {
        setLevel(1);
      }
    }
  }, []);

  const switchApp = (newView: "quiz" | "hunter" | "reviewer" | "generator", newLvl: 1 | 2 = 1) => {
    setView(newView);
    setLevel(newLvl);
    
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
      {/* Header - Hidden on mobile as per user request */}
      <header className="hidden md:block border-b-4 border-wemodo-navy p-3 md:p-4 bg-white z-50 shrink-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <WemodoLogo />
            <div className="hidden lg:block h-8 w-1 bg-wemodo-navy/10 mx-2" />
            <div className="font-display font-black text-xs md:text-sm italic uppercase tracking-tighter text-wemodo-purple">
              {view === "quiz" ? `Quiz Niveau ${level}` : view === "hunter" ? "Hallucination Hunter" : view === "reviewer" ? "Gemini Reviewer" : "Mission Booster"}
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            {/* Dev Navigation - Buttons to switch apps */}
            <div className="flex gap-2 bg-wemodo-navy/5 p-1">
              <button 
                onClick={() => switchApp("quiz", 1)}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "quiz" && level === 1 ? 'bg-wemodo-yellow shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                Q1
              </button>
              <button 
                onClick={() => switchApp("quiz", 2)}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "quiz" && level === 2 ? 'bg-wemodo-purple text-white shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                Q2
              </button>
              <button 
                onClick={() => switchApp("hunter")}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "hunter" ? 'bg-wemodo-pink shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                Hunt
              </button>
              <button 
                onClick={() => switchApp("reviewer")}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "reviewer" ? 'bg-wemodo-yellow shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                Gemini
              </button>
              <button 
                onClick={() => switchApp("generator")}
                className={`text-[10px] font-black px-2 py-1 border-2 border-wemodo-navy transition-all ${view === "generator" ? 'bg-wemodo-purple text-white shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]' : 'bg-white opacity-50'}`}
              >
                Mission
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
      </header>

      {/* Main Content - Full screen on mobile */}
      <main className="flex-1 overflow-y-auto px-0 md:px-4 py-0 md:py-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto h-full w-full">
          {view === "quiz" ? (
            <AIQuiz 
              key={`quiz-${level}`} 
              questions={level === 1 ? GEN_AI_QUESTIONS : GEN_AI_QUESTIONS_L2} 
            />
          ) : view === "hunter" ? (
            <HallucinationHunter key="hunter" />
          ) : view === "reviewer" ? (
            <PromptReviewer key="reviewer" />
          ) : (
            <UseCaseGenerator key="generator" />
          )}
        </div>
      </main>
    </div>
  );
}
