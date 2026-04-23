import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrutalistCard, BrutalistButton, BrutalistLoading } from "../../components/BrutalistUI";
import { usePersistentState } from "../../hooks/usePersistentState";
import { Copy, Check } from "lucide-react";

interface UseCase {
  title: string;
  timeSaved: string;
  action: string;
  icon: string;
}

export const UseCaseGenerator: React.FC = () => {
  const [mission, setMission] = usePersistentState("usecase_mission", "");
  const [loading, setLoading] = useState(false);
  const [useCases, setUseCases] = usePersistentState<UseCase[] | null>("usecase_results", null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    if (!mission.trim()) return;

    const startTime = performance.now();
    console.log("🚀 [FRONT] Clic Bouton");

    setLoading(true);
    setError(null);
    setUseCases([]); 

    try {
      console.log("📤 [FRONT] Envoi Requête...");
      const fetchStartTime = performance.now();
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission })
      });

      const modelUsed = response.headers.get('X-Model-Used');
      console.log(`🤖 [FRONT] Modèle: ${modelUsed}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur serveur" }));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Le flux de réponse est indisponible.");

      const decoder = new TextDecoder();
      let buffer = "";
      let firstChunkReceived = false;
      let casesCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (!firstChunkReceived) {
          firstChunkReceived = true;
          console.log(`📥 [FRONT] Début Réception (+${Math.round(performance.now() - fetchStartTime)}ms)`);
        }

        buffer += decoder.decode(value, { stream: true });

        // Gestion des erreurs injectées dans le flux
        if (buffer.includes('---ERROR---')) {
          const errorMsg = buffer.split('---ERROR---')[1];
          throw new Error(errorMsg || "Erreur de génération");
        }

        const parts = buffer.split('---END_OF_CASE---');
        
        for (let i = 0; i < parts.length - 1; i++) {
          const content = parts[i].trim();
          if (content) {
            try {
              const cleanContent = content.replace(/```json|```/g, "").trim();
              if (cleanContent) {
                const useCase = JSON.parse(cleanContent);
                casesCount++;
                console.log(`✨ [FRONT] Cas #${casesCount} créé (+${Math.round(performance.now() - fetchStartTime)}ms)`);
                setUseCases(prev => [...(prev || []), useCase]);
              }
            } catch (e) {
              console.warn("Échec du parsing d'un fragment:", e);
            }
          }
        }
        buffer = parts[parts.length - 1];
      }

      const finalContent = buffer.trim().replace(/```json|```/g, "").trim();
      if (finalContent && finalContent.startsWith('{') && finalContent.endsWith('}')) {
        try {
          const useCase = JSON.parse(finalContent);
          casesCount++;
          console.log(`✨ [FRONT] Cas #${casesCount} créé (final) (+${Math.round(performance.now() - fetchStartTime)}ms)`);
          setUseCases(prev => {
            if (prev?.some(uc => uc.title === useCase.title)) return prev;
            return [...(prev || []), useCase];
          });
        } catch (e) {}
      }

      console.log(`🏁 [FRONT] Flux Terminé | Total: ${Math.round(performance.now() - startTime)}ms`);

    } catch (err: any) {
      console.error("❌ [FRONT] Erreur:", err);
      
      const errorMessage = err.message || "";
      if (errorMessage.includes("high demand") || errorMessage.includes("Too Many Requests") || errorMessage.includes("503") || errorMessage.includes("500")) {
        setError("Le service est actuellement très sollicité. Merci de réessayer dans quelques instants.");
      } else {
        setError("Une erreur est survenue lors de la génération. Merci de réessayer plus tard.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-5xl mx-auto w-full py-4 md:py-12">
      <div className="space-y-4 px-4 md:px-0 mt-4 md:mt-0">
        <h1 className="font-display font-black text-5xl md:text-7xl uppercase italic tracking-tighter text-wemodo-navy leading-none mb-2">
          GÉNÉRATEUR <span className="text-wemodo-purple">DE CAS D'USAGE</span>
        </h1>
        <p className="font-bold text-wemodo-navy/70 uppercase text-xs md:text-sm tracking-widest max-w-2xl">
          Trouve des idées concrètes d'application de l'IA pour ton métier.
        </p>
      </div>

      {/* Form Section */}
      <div className="px-4 md:px-0">
        <BrutalistCard className="bg-white border-wemodo-navy">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="font-black uppercase text-xs tracking-widest text-wemodo-purple">
                Ton métier ou ton domaine
              </label>
              <input
                type="text"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Ex : Chargé de communication, Graphiste, Rédacteur freelance..."
                className="w-full bg-wemodo-cream/20 border-2 border-wemodo-navy p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-wemodo-yellow/50 transition-all"
              />
            </div>
            
            <div className="flex justify-end">
              <BrutalistButton 
                onClick={handleGenerate} 
                disabled={loading || !mission.trim()}
                className={`${loading ? "animate-pulse" : ""} w-full md:w-auto`}
              >
                {loading ? "GÉNÉRATION..." : "GÉNÉRER MES CAS D'USAGE"}
              </BrutalistButton>
            </div>
          </div>
        </BrutalistCard>
      </div>

      {/* Results Section */}
      <div className="px-4 md:px-0 pb-12">
        <AnimatePresence mode="popLayout">
          {loading && useCases && useCases.length === 0 && (
            <BrutalistLoading key="loading" message="Analyse de votre mission..." />
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-wemodo-pink border-4 border-wemodo-navy p-6 shadow-brutalist flex flex-col items-center gap-4"
            >
              <p className="font-black text-white text-center uppercase tracking-wider">{error}</p>
              <BrutalistButton 
                onClick={handleGenerate}
                className="bg-white text-wemodo-navy border-2 border-wemodo-navy text-xs px-4 py-2"
              >
                RÉESSAYER MAINTENANT
              </BrutalistButton>
            </motion.div>
          )}

          {useCases && useCases.length > 0 && (
            <div key="results-container" className="space-y-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {useCases.map((useCase, idx) => (
                  <motion.div
                    key={`${useCase.title}-${idx}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="group"
                  >
                    <BrutalistCard className="h-full flex flex-col gap-4 bg-white hover:bg-wemodo-yellow transition-colors duration-300">
                      <div className="flex justify-between items-start">
                        <span className="text-4xl">{useCase.icon}</span>
                        <span className="bg-wemodo-navy text-white font-black text-[10px] px-2 py-1 uppercase tracking-widest">
                          ⏱ {useCase.timeSaved}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-black text-xl uppercase leading-tight text-wemodo-navy">
                          {useCase.title}
                        </h3>
                        <p className="font-bold text-sm text-wemodo-navy/80 italic">
                          {useCase.action}
                        </p>
                      </div>

                      <div className="mt-auto pt-4">
                        <button
                          onClick={() => handleCopy(useCase.action, `${useCase.title}-${idx}`)}
                          className="w-full flex items-center justify-center gap-2 bg-wemodo-navy text-white font-black text-[10px] py-2 uppercase tracking-widest hover:bg-wemodo-purple transition-colors"
                        >
                          {copiedId === `${useCase.title}-${idx}` ? (
                            <>
                              <Check size={12} /> COPIÉ !
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> COPIER L'ACTION
                            </>
                          )}
                        </button>
                      </div>
                    </BrutalistCard>
                  </motion.div>
                ))}
              </motion.div>
              
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center gap-3 bg-wemodo-purple/10 border-2 border-dashed border-wemodo-purple p-4"
                >
                  <div className="w-4 h-4 border-2 border-wemodo-purple border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-black uppercase text-[10px] tracking-widest text-wemodo-purple">
                    Génération des prochains cas d'usage...
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
