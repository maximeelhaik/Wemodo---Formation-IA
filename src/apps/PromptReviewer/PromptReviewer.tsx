import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrutalistCard, BrutalistButton, BrutalistLoading } from "../../components/BrutalistUI";

export const PromptReviewer: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);


    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur serveur" }));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const data = await response.json();

      if (typeof data.score !== 'number' || typeof data.feedback !== 'string') {
        throw new Error("Format de réponse inattendu.");
      }

      setResult(data);
    } catch (err: any) {
      console.error("Review Error:", err);
      setError(err.message || "Une erreur est survenue lors de l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full p-4 md:p-0 overflow-y-auto">
      <div className="space-y-2">
        <h1 className="font-display font-black text-4xl md:text-5xl uppercase italic tracking-tighter text-wemodo-navy leading-none">
          Prompt <span className="text-wemodo-purple">Reviewer</span>
        </h1>
        <p className="font-bold text-wemodo-navy/60 uppercase text-xs md:text-sm tracking-widest">
          Optimise la puissance de tes instructions
        </p>
      </div>

      <BrutalistCard className="flex-none flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-black uppercase text-xs tracking-widest text-wemodo-purple">
            Ton Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Écris ton prompt ici pour le faire analyser..."
            className="flex-1 w-full bg-wemodo-cream/30 border-2 border-wemodo-navy p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-wemodo-yellow/30 resize-none min-h-[150px] md:min-h-[200px]"
          />
        </div>

        <div className="flex justify-end">
          <BrutalistButton 
            onClick={handleReview} 
            disabled={loading || !prompt.trim()}
            className={loading ? "animate-pulse" : ""}
          >
            {loading ? "ANALYSE EN COURS..." : "VALIDER LE PROMPT"}
          </BrutalistButton>
        </div>
      </BrutalistCard>

      <AnimatePresence mode="wait">
        {loading && (
          <BrutalistLoading key="loading" message="Analyse du prompt en cours..." />
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-8"
          >
            <div className="md:col-span-1 bg-wemodo-yellow border-4 border-wemodo-navy p-6 shadow-[6px_6px_0px_0px_rgba(18,14,61,1)] flex flex-col items-center justify-center">
              <span className="font-black text-5xl text-wemodo-navy">
                {result.score}
              </span>
              <span className="font-black text-xs uppercase tracking-tighter">SUR 10</span>
            </div>
            
            <div className="md:col-span-3 bg-white border-4 border-wemodo-navy p-6 shadow-[6px_6px_0px_0px_rgba(18,14,61,1)] flex items-center">
              <p className="font-bold text-lg md:text-xl italic">
                {result.feedback}
              </p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-wemodo-pink border-4 border-wemodo-navy p-4 shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]">
              <p className="font-black text-white uppercase text-center">
                Erreur : {error}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
