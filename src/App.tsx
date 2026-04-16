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
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <WemodoLogo />
          <div className="hidden md:block font-display font-black text-[10px] uppercase tracking-widest text-wemodo-navy/40">
            Laboratoire IA Génératives
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:py-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto h-full">
          <AIQuiz />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-wemodo-navy p-4 bg-wemodo-navy text-white shrink-0">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-4">
          <div className="font-display font-black text-xl italic tracking-tighter">Wemodo.</div>
          <p className="font-bold text-[10px] md:text-sm text-center">
            Formation IA Génératives 🚀
          </p>
          <a href="https://wemodo.com" className="hover:text-wemodo-yellow transition-colors font-bold uppercase text-[10px] border-2 border-white px-2 py-1 shrink-0">
            Wemodo.com
          </a>
        </div>
      </footer>
    </div>
  );
}
