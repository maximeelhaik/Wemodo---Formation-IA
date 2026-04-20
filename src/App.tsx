/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { WemodoLogo } from "./components/BrutalistUI";
import { AIQuiz } from "./apps/AIQuiz/AIQuiz";
import { HallucinationHunter } from "./apps/HallucinationHunter/HallucinationHunter";
import { HallucinationHunter2 } from "./apps/HallucinationHunter/HallucinationHunter2";
import { PromptReviewer } from "./apps/PromptReviewer/PromptReviewer";
import { UseCaseGenerator } from "./apps/UseCaseGenerator/UseCaseGenerator";
import { MidjourneyArchitect } from "./apps/MidjourneyArchitect/MidjourneyArchitect";
import { AIQuizTraining } from "./apps/AIQuizTraining/AIQuizTraining";
import { ALL_APPS, PLATFORMS_CONFIG, getPlatform, AppId } from "./config/navigation";


export default function App() {
  const [view, setView] = useState<AppId>("quiz");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Détecter la plateforme actuelle
  const platform = useMemo(() => getPlatform(), []);
  
  // Apps visibles dans le menu pour cette plateforme
  const visibleApps = useMemo(() => {
    return PLATFORMS_CONFIG[platform].apps.map(id => ALL_APPS[id]);
  }, [platform]);

  // Sync state with URL for development/deployment access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const appParam = params.get("app");

    // Trouver l'app qui correspond au paramètre URL
    const foundApp = Object.values(ALL_APPS).find(app => app.urlParam === appParam);
    
    if (foundApp) {
      setView(foundApp.id);
    } else {
      // App par défaut selon la plateforme
      setView(PLATFORMS_CONFIG[platform].apps[0] || "quiz");
    }
  }, [platform]);

  const switchApp = (newView: AppId) => {
    setView(newView);
    setIsMobileMenuOpen(false);
    
    const url = new URL(window.location.href);
    url.searchParams.delete("level");
    url.searchParams.set("app", ALL_APPS[newView].urlParam);
    
    window.history.pushState({}, "", url);
  };

  const currentApp = ALL_APPS[view] || ALL_APPS.quiz;

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
                {currentApp.label}
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
            {/* dynamic Navigation */}
            <div className="flex gap-1 bg-wemodo-navy/5 p-1">
              {visibleApps.map((app) => (
                <button 
                  key={app.id}
                  onClick={() => switchApp(app.id)}
                  className={`text-[9px] font-black px-3 py-1 border-2 border-wemodo-navy transition-all ${
                    view === app.id 
                    ? `${app.color} shadow-[1px_1px_0px_0px_rgba(18,14,61,1)]` 
                    : 'bg-white opacity-50 hover:opacity-100'
                  }`}
                >
                  {app.shortLabel}
                </button>
              ))}
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b-4 border-b border-wemodo-navy p-4 flex flex-col gap-2 z-50 shadow-2xl">
            {visibleApps.map((app) => (
              <button 
                key={app.id}
                onClick={() => switchApp(app.id)}
                className={`text-xs font-black p-3 border-2 border-wemodo-navy text-left ${
                  view === app.id 
                  ? `${app.color} shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]` 
                  : 'bg-white'
                }`}
              >
                {app.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto h-full w-full px-4 py-4 md:py-6">
          {view === "quiz" ? (
            <AIQuiz key="ai-quiz" />
          ) : view === "hunter" ? (
            <HallucinationHunter key="hunter" />
          ) : view === "hunter2" ? (
            <HallucinationHunter2 key="hunter2" />
          ) : view === "reviewer" ? (
            <PromptReviewer key="reviewer" />
          ) : view === "architect" ? (
            <MidjourneyArchitect key="architect" />
          ) : view === "training" ? (
            <AIQuizTraining key="training" />
          ) : (
            <UseCaseGenerator key="generator" />
          )}
        </div>
      </main>
    </div>
  );
}
