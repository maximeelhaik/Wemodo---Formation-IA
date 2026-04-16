/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WemodoLogo } from "./components/BrutalistUI";
import { AIQuiz } from "./apps/AIQuiz/AIQuiz";

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-wemodo-cream overflow-hidden">
      {/* Header */}
      <header className="border-b-4 border-wemodo-navy p-3 md:p-4 bg-white z-50 shrink-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <WemodoLogo />
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:block font-display font-black text-[10px] uppercase tracking-widest text-wemodo-navy/40">
              Laboratoire IA Génératives
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:py-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto h-full">
          <AIQuiz />
        </div>
      </main>
    </div>
  );
}
