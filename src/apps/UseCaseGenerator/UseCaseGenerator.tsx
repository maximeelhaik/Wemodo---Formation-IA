import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrutalistCard, BrutalistButton, BrutalistLoading } from "../../components/BrutalistUI";

interface UseCase {
  title: string;
  timeSaved: string;
  action: string;
  prompt: string;
  icon: string;
}

export const UseCaseGenerator: React.FC = () => {
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [useCases, setUseCases] = useState<UseCase[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!mission.trim()) return;

    setLoading(true);
    setError(null);
    setUseCases(null);

    try {
      // Utilisation de la route API locale /api/generate (sécurisée pour production)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur serveur" }));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error("Format de réponse inattendu");
      }
      
      setUseCases(data);

    } catch (err: any) {
      console.error("Generation Error details:", err);
      
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
    <div className="flex flex-col gap-6 md:gap-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="space-y-3 px-4 md:px-0">
        <h1 className="font-display font-black text-4xl md:text-6xl uppercase italic tracking-tighter text-wemodo-navy leading-none">
          L'ia dans <span className="text-wemodo-purple">mon metier.</span>
        </h1>
        <p className="font-bold text-wemodo-navy/70 uppercase text-xs md:text-sm tracking-widest max-w-2xl">
          Explore 5 cas d'usage concrets de l'IA adaptés à ta profession — avec un exemple de prompt pour chacun.
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
        <AnimatePresence mode="wait">
          {loading && (
            <BrutalistLoading key="loading" message="Chargement des cas d'usage..." />
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-wemodo-pink border-4 border-wemodo-navy p-6 shadow-brutalist"
            >
              <p className="font-black text-white text-center uppercase tracking-wider">{error}</p>
            </motion.div>
          )}

          {useCases && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {useCases.map((useCase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
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

                    <div className="mt-auto pt-4 border-t-2 border-wemodo-navy/10">
                      <p className="font-black text-[10px] uppercase text-wemodo-purple mb-2 tracking-widest">
                        Exemple de prompt :
                      </p>
                      <p className="bg-wemodo-cream/40 p-3 border border-wemodo-navy text-xs font-mono font-bold italic break-words whitespace-pre-wrap select-all cursor-copy">
                        "{useCase.prompt}"
                      </p>
                    </div>
                  </BrutalistCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
