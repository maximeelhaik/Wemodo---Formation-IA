import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrutalistCard, BrutalistButton, BrutalistLoading } from "../../components/BrutalistUI";
import { Copy, Check, Wand2, Terminal } from "lucide-react";

interface MJPrompt {
  visual_prompt: string;
  parameters: string;
  summary: string;
  icon: string;
}

interface MJStyle {
  id: string;
  label: string;
  emoji: string;
}

const PREDEFINED_STYLES: MJStyle[] = [
  { id: "photorealistic", label: "Photoréalisme", emoji: "📸" },
  { id: "cinematic", label: "Cinématique", emoji: "🎬" },
  { id: "cyberpunk", label: "Cyberpunk", emoji: "🦾" },
  { id: "retro_80s", label: "Rétro 80s", emoji: "📼" },
  { id: "minimalist", label: "Minimaliste", emoji: "📐" },
  { id: "surrealist", label: "Surréaliste", emoji: "🎭" },
  { id: "oil_painting", label: "Peinture", emoji: "🎨" },
  { id: "watercolor", label: "Aquarelle", emoji: "🖌️" },
  { id: "brutalist", label: "Brutaliste", emoji: "🧱" },
  { id: "pastel", label: "Pastel", emoji: "🌈" },
  { id: "anime", label: "Anime", emoji: "🍣" },
  { id: "isometric", label: "Isométrique", emoji: "📦" },
  { id: "street_art", label: "Street Art", emoji: "🏢" },
  { id: "neon_noir", label: "Neon Noir", emoji: "🌃" },
  { id: "double_exposure", label: "Double Expo", emoji: "👥" },
  { id: "pixel_art", label: "Pixel Art", emoji: "👾" },
  { id: "architectural", label: "Architecture", emoji: "🏛️" },
  { id: "steampunk", label: "Steampunk", emoji: "⚙️" },
  { id: "pop_art", label: "Pop Art", emoji: "💥" },
  { id: "macro", label: "Macro", emoji: "🔍" },
  { id: "glitch", label: "Glitch Art", emoji: "📺" },
  { id: "clay", label: "Claymation", emoji: "🏺" },
  { id: "knitted", label: "Tricot", emoji: "🧶" },
  { id: "blueprint", label: "Blueprint", emoji: "📜" },
];

export const MidjourneyArchitect: React.FC = () => {
  const [intention, setIntention] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<MJPrompt[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev => 
      prev.includes(styleId) 
        ? prev.filter(s => s !== styleId) 
        : [...prev, styleId]
    );
  };

  const handleGenerate = async () => {
    if (!intention.trim()) return;

    setLoading(true);
    setError(null);
    setPrompts(null);
    setCopiedIdx(null);

    try {
      const response = await fetch('/api/midjourney', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          intention,
          styles: selectedStyles.map(id => PREDEFINED_STYLES.find(s => s.id === id)?.label).filter(Boolean)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur serveur" }));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const data = await response.json();
      
      const promptArray = Array.isArray(data) ? data : [data];
      
      // Nettoyage préventif des paramètres (déduplication)
      const sanitizedData = promptArray.map((p: any) => {
        const uniqueParams = p.parameters ? p.parameters.split('--')
          .map((s: string) => s.trim())
          .filter((s: string, i: number, arr: string[]) => s !== "" && arr.indexOf(s) === i)
          .map((s: string) => `--${s}`)
          .join(' ') : "";
        
        return { 
          visual_prompt: p.visual_prompt || "",
          parameters: uniqueParams,
          summary: p.summary || p.style_name || "Prompt",
          icon: p.icon || "✨"
        };
      });
      
      setPrompts(sanitizedData);

    } catch (err: any) {
      console.error("MJ Generation Error:", err);
      setError("Une erreur est survenue lors de la création des prompts. Réessaie dans quelques instants.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="space-y-3 px-4 md:px-0">
        <h1 className="font-display font-black text-4xl md:text-6xl uppercase italic tracking-tighter text-wemodo-navy leading-none">
          L'Architecte <span className="text-wemodo-purple text-outline">Midjourney.</span>
        </h1>
        <p className="font-bold text-wemodo-navy/70 uppercase text-xs md:text-sm tracking-widest max-w-2xl">
          Transforme tes idées en prompts Midjourney structurés, fidèles et optimisés.
        </p>
      </div>

      {/* Form Section */}
      <div className="px-4 md:px-0">
        <BrutalistCard className="bg-white border-wemodo-navy">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="font-black uppercase text-xs tracking-widest text-wemodo-purple">
                Ton intention visuelle
              </label>
              <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Ex : Un café parisien sous la pluie, ambiance cinématographique, vue de la rue..."
                className="w-full bg-wemodo-cream/20 border-2 border-wemodo-navy p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-wemodo-yellow/50 transition-all min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-black uppercase text-[10px] tracking-widest text-wemodo-navy/40">
                  Ajouter des influences de style (Facultatif)
                </label>
                {selectedStyles.length > 0 && (
                  <button 
                    onClick={() => setSelectedStyles([])}
                    className="text-[10px] font-black uppercase text-wemodo-purple hover:underline"
                  >
                    Effacer
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_STYLES.map((style) => {
                  const isSelected = selectedStyles.includes(style.id);
                  return (
                    <button
                      key={style.id}
                      onClick={() => toggleStyle(style.id)}
                      className={`
                        flex-grow flex items-center justify-center gap-2 px-3 py-2 border-2 font-black text-[10px] sm:text-xs uppercase transition-all
                        ${isSelected 
                          ? "bg-wemodo-purple text-white border-wemodo-navy -translate-y-1 shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]" 
                          : "bg-white text-wemodo-navy border-wemodo-navy/20 hover:border-wemodo-navy hover:bg-wemodo-navy/5"}
                      `}
                    >
                      <span className="text-base">{style.emoji}</span>
                      {style.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-end">
              <BrutalistButton 
                onClick={handleGenerate} 
                disabled={loading || !intention.trim()}
                className={`${loading ? "animate-pulse" : ""} w-full md:w-auto flex items-center gap-2`}
              >
                <Wand2 size={18} />
                {loading ? "GÉNÉRATION..." : "GÉNÉRER MES PROMPTS"}
              </BrutalistButton>
            </div>
          </div>
        </BrutalistCard>
      </div>

      {/* Results Section */}
      <div className="px-4 md:px-0 pb-12">
        <AnimatePresence mode="wait">
          {loading && (
            <BrutalistLoading key="loading" message="Calcul des structures visuelles..." />
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-wemodo-pink border-4 border-wemodo-navy p-6 shadow-[8px_8px_0px_0px_rgba(18,14,61,1)]"
            >
              <p className="font-black text-white text-center uppercase tracking-wider">{error}</p>
            </motion.div>
          )}

          {prompts && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-6"
            >
              {prompts.map((p, idx) => {
                const fullCommand = `${p.visual_prompt} ${p.parameters}`;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <BrutalistCard className="bg-white border-wemodo-navy overflow-hidden p-0">
                      <div className="flex flex-col md:flex-row divide-y-2 md:divide-y-0 md:divide-x-2 divide-wemodo-navy">
                        {/* Info Side */}
                        <div className="md:w-1/3 p-6 flex flex-col gap-4 bg-wemodo-yellow/10">
                          <div className="flex items-center gap-3">
                            <span className="text-4xl leading-none">{p.icon}</span>
                            <h3 className="font-black text-xl uppercase leading-tight text-wemodo-navy">
                              {p.summary}
                            </h3>
                          </div>
                          <div className="space-y-1">
                            <p className="font-black text-[11px] uppercase text-wemodo-purple tracking-widest">Paramètres :</p>
                            <div className="flex flex-wrap gap-1">
                                {p.parameters.split('--')
                                    .map(s => s.trim())
                                    .filter((s, i, arr) => s !== "" && arr.indexOf(s) === i)
                                    .map((param, i) => (
                                        <span key={i} className="bg-wemodo-navy text-white font-black text-xs px-2 py-1 uppercase mb-1">
                                            {param}
                                        </span>
                                    ))}
                            </div>
                          </div>
                        </div>

                        {/* Content Side */}
                        <div className="md:flex-1 p-6 flex flex-col gap-4">
                          <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <p className="font-black text-[10px] uppercase text-wemodo-navy/40 tracking-widest flex items-center gap-1">
                                    <Terminal size={12} /> Commande Midjourney
                                </p>
                                <button 
                                    onClick={() => copyToClipboard(fullCommand, idx)}
                                    className="flex items-center gap-1 text-[10px] font-black uppercase text-wemodo-purple hover:underline"
                                >
                                    {copiedIdx === idx ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                    {copiedIdx === idx ? "Copié !" : "Copier"}
                                </button>
                             </div>
                             <p className="bg-wemodo-cream/50 p-4 text-wemodo-navy border-2 border-wemodo-navy border-dashed font-mono text-lg leading-relaxed break-words select-all">
                                {p.visual_prompt} <span className="text-wemodo-purple font-black italic">{p.parameters}</span>
                             </p>
                          </div>
                        </div>
                      </div>
                    </BrutalistCard>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
