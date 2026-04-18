import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrutalistCard, BrutalistButton, BrutalistLoading } from "../../components/BrutalistUI";

export const PromptReviewer: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const [streamingFeedback, setStreamingFeedback] = useState("");
  const [streamingScore, setStreamingScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setStreamingFeedback("");
    setStreamingScore(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("Clé API non trouvée dans l'environnement local.");
      }

      // Utilisation du modèle gemini-flash-latest (recommandé pour stabilité/vitesse)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey 
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Tu es un expert en ingénierie de prompt. 
            Analyse ce prompt : "${prompt}"
            Donne une note sur 10 (pertinence, clarté, contexte) et un conseil de correction ultra-actionnable et pro.
            IMPORTANT: Réponds UNIQUEMENT au format JSON strict: {"score": number, "feedback": "string"}` }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur API: ${errorData.error?.message || response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Impossible de lire le flux de réponse.");

      const decoder = new TextDecoder();
      let rawAccumulator = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        rawAccumulator += decoder.decode(value, { stream: true });
        
        const textMatches = [...rawAccumulator.matchAll(/"text":\s*"((?:[^"\\]|\\.)*)"/g)];
        let currentFullText = "";
        
        for (const match of textMatches) {
          currentFullText += match[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        }

        // REGEX AMÉLIORÉE : Capte le début de la chaîne même sans le guillemet fermant
        const feedbackMatch = currentFullText.match(/"feedback":\s*"([^"]*)/);
        if (feedbackMatch && feedbackMatch[1]) {
          const cleanFeedback = feedbackMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
          setStreamingFeedback(cleanFeedback);
        }

        const scoreMatch = currentFullText.match(/"score":\s*(\d+)/);
        if (scoreMatch) {
          setStreamingScore(parseInt(scoreMatch[1]));
        }
      }

      // Finalisation
      try {
        const textMatches = [...rawAccumulator.matchAll(/"text":\s*"((?:[^"\\]|\\.)*)"/g)];
        let finalFullText = "";
        for (const match of textMatches) {
          finalFullText += match[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        }
        
        const finalValues = JSON.parse(finalFullText.trim());
        setResult(finalValues);
      } catch (e) {
        if (streamingFeedback) {
          setResult({ score: streamingScore || 0, feedback: streamingFeedback });
        } else {
          throw new Error("Erreur de formatage de la réponse IA.");
        }
      }
    } catch (err: any) {
      console.error("Review Error details:", err);
      
      const errorMessage = err.message || "";
      if (errorMessage.includes("high demand") || errorMessage.includes("Too Many Requests") || errorMessage.includes("503") || errorMessage.includes("500")) {
        setError("Le service est actuellement très sollicité. Merci de réessayer dans quelques instants.");
      } else {
        setError("Une erreur est survenue lors de l'analyse. Merci de réessayer plus tard.");
      }
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
        {loading && !streamingFeedback && (
          <BrutalistLoading key="loading" message="Analyse du prompt en cours..." />
        )}

        {(result || (loading && (streamingFeedback || streamingScore))) && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-8"
          >
            <div className="md:col-span-1 bg-wemodo-yellow border-4 border-wemodo-navy p-6 shadow-[6px_6px_0px_0px_rgba(18,14,61,1)] flex flex-col items-center justify-center relative overflow-hidden">
              <span className="font-black text-5xl text-wemodo-navy">
                {result?.score ?? streamingScore ?? "?"}
              </span>
              <span className="font-black text-xs uppercase tracking-tighter">SUR 10</span>
              {loading && !result && (
                <motion.div 
                  className="absolute inset-0 bg-wemodo-purple/10"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>
            
            <div className="md:col-span-3 bg-white border-4 border-wemodo-navy p-6 shadow-[6px_6px_0px_0px_rgba(18,14,61,1)] flex items-center relative">
              <p className="font-bold text-lg md:text-xl italic">
                {result?.feedback || streamingFeedback}
                {loading && !result && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-6 bg-wemodo-purple ml-1 align-middle"
                  />
                )}
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
