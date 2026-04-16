/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { WemodoLogo } from "./components/BrutalistUI";
import { AIQuiz } from "./apps/AIQuiz/AIQuiz";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-wemodo-white">
      {/* Header */}
      <header className="border-b-4 border-wemodo-black p-6 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <WemodoLogo />
          <div className="hidden md:block font-display font-black text-xs uppercase tracking-widest text-wemodo-black/50">
            Laboratoire d'expérimentation IA
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 md:py-12">
        <div className="max-w-7xl mx-auto">
          <AIQuiz />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-wemodo-black p-8 bg-wemodo-black text-wemodo-white mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-display font-black text-2xl italic">WEMODO.</div>
          <p className="font-bold text-center md:text-left">
            Formation IA Génératives — Boostez votre carrière 🚀
          </p>
          <div className="flex gap-4">
            <a href="https://wemodo.com" className="hover:text-wemodo-yellow transition-colors font-bold uppercase text-xs border-2 border-white px-3 py-1">
              Site Web
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
