import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrutalistCard, BrutalistButton, WemodoLogo } from "../../components/BrutalistUI";
import { Search } from "lucide-react";

// For later restitution of the leaderboard
// import { useLeaderboard } from "../../hooks/useLeaderboard";
// import { Leaderboard } from "../../components/Leaderboard";

const RANDOM_THEMES = [
  "Critique gastronomique d'un nouveau restaurant de street-food",
  "Récit d'aventure sur l'ascension d'un sommet méconnu",
  "Article de blog sur la psychologie des chats domestiques",
  "Analyse d'une oeuvre d'art contemporaine controversée",
  "Brève historique sur l'invention de la machine à écrire",
  "Conseils de jardinage urbain pour débutants",
  "Portrait d'un musicien de jazz fictif des années 50",
  "Explication scientifique sur la formation des aurores boréales",
  "Chronique culturelle sur le renouveau du cinéma d'animation",
  "Guide de voyage sur une ville futuriste imaginaire",
  "Essai sur l'impact de la musique lo-fi sur la concentration",
  "Compte-rendu d'un match de sport insolite",
  "Réflexion philosophique sur le concept du temps",
  "Newsletter sur les tendances de la mode éco-responsable",
  "Fait divers sur une incroyable découverte archéologique",
  "Texte descriptif d'un marché traditionnel en Provence",
  "Introduction à la mythologie nordique et ses symboles",
  "Critique de film sur une saga de science-fiction",
  "Billet d'humeur sur la vie sans smartphone pendant une semaine",
  "Vulgarisation sur le fonctionnement des trous noirs",
];

type TargetType = "hallucination" | "cliche" | "none";

interface TextSegment {
  text: string;
  type: TargetType;
  explanation?: string;
}

// V2 — Email de consultant rédigé par IA
// Hallucinations : stats crédibles mais inventées, fausses citations, acquisitions bidonnées
// Clichés : formules LinkedIn, transitions automatiques, buzzwords vides
// Level 1 Static Data: 1 Cliché, 0 Hallucinations, ~80 words
const HUNTER_DATA: TextSegment[] = [
  { text: "L'intelligence artificielle transforme ", type: "none" },
  { text: "radicalement de nombreux ", type: "none" },
  { text: "secteurs d'activité aujourd'hui.\n\n", type: "none" },
  { text: "ChatGPT a franchi une ", type: "none" },
  { text: "étape historique en démontrant ", type: "none" },
  { text: "l'étendue des capacités de ", type: "none" },
  { text: "traitement du langage naturel. ", type: "none" },
  { text: "Il est indéniable que", type: "cliche", explanation: "Formule d'autorité bateau très souvent utilisée par les IA pour conclure une phrase sans avancer la moindre preuve." },
  { text: " cette technologie redessinera ", type: "none" },
  { text: "le monde du travail ", type: "none" },
  { text: "de demain. Les entreprises ", type: "none" },
  { text: "intègrent de plus en ", type: "none" },
  { text: "plus ces modèles pour ", type: "none" },
  { text: "automatiser leurs tâches, ", type: "none" },
  { text: "réinventant notre futur.", type: "none" },
];

export const HallucinationHunter: React.FC = () => {
  const [roundsData, setRoundsData] = useState<TextSegment[][]>([HUNTER_DATA]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [customTheme, setCustomTheme] = useState("");
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  const [foundIds, setFoundIds] = useState<number[]>([]);
  const [errorIndices, setErrorIndices] = useState<number[]>([]);
  const [isErrorFlash, setIsErrorFlash] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<TextSegment | null>(null);

  const [startTime, setStartTime] = useState<number | null>(null);

  const currentData = roundsData[currentLevel];
  const targets = useMemo(() => currentData?.filter(s => s.type !== "none") || [], [currentData]);
  const totalTargets = targets.length;

  useEffect(() => {
    // Generate next round in the background if we don't have at least 2 rounds ahead
    if (roundsData.length <= currentLevel + 2 && !isLoadingNext && !isGeneratingCustom) {
      const fetchRound = async () => {
        setIsLoadingNext(true);
        try {
          const nextLevelIndex = roundsData.length;
          const levelNum = nextLevelIndex + 1;
          const theme = RANDOM_THEMES[Math.floor(Math.random() * RANDOM_THEMES.length)];

          // Difficulty scaling formulas
          const halls = Math.floor(levelNum / 2);
          const cliches = Math.ceil(levelNum / 2);
          const words = 60 + levelNum * 20;

          const res = await fetch("/api/hunt-generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              theme,
              hallsCount: halls,
              clichesCount: cliches,
              maxWords: words
            })
          });
          const data = await res.json();
          if (data.segments && data.segments.length > 0) {
            setRoundsData(prev => [...prev, data.segments]);
          }
        } catch (err) {
          console.error("Failed to prefetch next round", err);
        } finally {
          setIsLoadingNext(false);
        }
      };
      fetchRound();
    }
  }, [roundsData.length, currentLevel, isLoadingNext, isGeneratingCustom]);

  const advanceToNextRound = useCallback((roundScore: number) => {
    setTotalScore(prev => prev + roundScore);
    setFoundIds([]);
    setErrorIndices([]);
    setIsErrorFlash(false);
    setSelectedInfo(null);
    setStartTime(null);
    setCurrentLevel(prev => prev + 1);
  }, []);

  // Monitor round completion
  useEffect(() => {
    if (totalTargets > 0 && foundIds.length === totalTargets) {
      const endTime = Date.now();
      const duration = Math.floor((endTime - (startTime || endTime)) / 1000);
      // Base score increases slightly with level difficulty
      const basePoints = 1000 + (currentLevel * 200);
      const roundScore = Math.max(100, basePoints - duration * 5);

      const timer = setTimeout(() => {
        advanceToNextRound(roundScore);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [foundIds.length, totalTargets, startTime, advanceToNextRound]);

  const triggerMiss = (index?: number) => {
    setIsErrorFlash(true);
    setTimeout(() => setIsErrorFlash(false), 200);
    if (index !== undefined) {
      setErrorIndices(prev => [...prev, index]);
      setTimeout(() => setErrorIndices(prev => prev.filter(id => id !== index)), 800);
    }
  };

  const handleSegmentClick = (index: number, segment: TextSegment, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!startTime) setStartTime(Date.now());

    if (segment.type !== "none") {
      if (!foundIds.includes(index)) {
        setFoundIds(prev => [...prev, index]);
        setSelectedInfo(segment);
      } else {
        setSelectedInfo(segment);
      }
    } else {
      triggerMiss(index);
    }
  };

  const handleContainerClick = () => {
    if (!startTime) setStartTime(Date.now());
    triggerMiss();
  };

  const handleGenerateCustom = async () => {
    if (!customTheme.trim()) return;
    setIsGeneratingCustom(true);
    try {
      const res = await fetch("/api/hunt-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: customTheme })
      });
      const data = await res.json();
      if (data.segments && data.segments.length > 0) {
        setRoundsData(prev => {
          const newRounds = prev.slice(0, currentLevel + 1);
          newRounds.push(data.segments);
          return newRounds;
        });
        setCustomTheme("");
        advanceToNextRound(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  if (!currentData || currentData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 w-full">
        <WemodoLogo variant="dark" className="h-10 md:h-14 animate-pulse opacity-50" />
        <p className="font-black text-wemodo-navy/50 uppercase tracking-widest animate-pulse">Génération de la prochaine manche...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-5xl mx-auto p-0 md:p-2 bg-transparent w-full">
      {/* Header and custom generator */}
      <div className="space-y-4 px-4 md:px-0 mt-4 md:mt-0 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-3">
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase italic tracking-tighter text-wemodo-navy leading-none">
            CHASSE AUX <span className="text-wemodo-purple">HALLUCINATIONS</span>
          </h1>
          <p className="font-bold text-wemodo-navy/70 uppercase text-xs md:text-sm tracking-widest max-w-xl">
            Trouve l'hallucination et le cliché cachés dans ce texte. <br />
            <span className="text-wemodo-purple italic">Le score dépend de ta rapidité !</span>
          </p>
        </div>

        {/* Custom Subject Generator (secondary) */}
        <div className="flex flex-col gap-2 shrink-0 bg-white p-3 border-2 border-wemodo-navy bg-wemodo-cream/30 w-full md:w-auto min-w-[250px] shadow-[4px_4px_0_rgba(18,14,61,1)]">
          <span className="text-[10px] font-black uppercase text-wemodo-navy/50 tracking-widest">Sujet sur mesure (optionnel)</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
              placeholder="Ex: Startups..."
              className="flex-1 px-2 py-1 text-sm border-2 border-wemodo-navy bg-white focus:outline-none focus:ring-2 focus:ring-wemodo-purple min-w-0"
              disabled={isGeneratingCustom}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustom()}
            />
            <BrutalistButton
              onClick={handleGenerateCustom}
              disabled={isGeneratingCustom || !customTheme.trim()}
              className="h-auto py-1 px-3 text-xs"
            >
              Go
            </BrutalistButton>
          </div>
          {isGeneratingCustom && <span className="text-[10px] text-wemodo-purple font-bold">Génération en cours...</span>}
        </div>
      </div>

      {/* Stats Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border-b-4 md:border-4 border-wemodo-navy p-4 md:shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] shrink-0 mx-4 md:mx-0">
        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-start">
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs font-black uppercase text-wemodo-navy/40">Éléments trouvés</span>
            <span className="text-3xl md:text-4xl font-black italic text-wemodo-purple leading-none">
              {foundIds.length} <span className="text-lg not-italic text-wemodo-navy/30">/ {totalTargets}</span>
            </span>
          </div>

          <div className="flex flex-col text-right md:text-left border-l-2 border-wemodo-navy/10 pl-4 md:pl-6">
            <span className="text-[10px] md:text-xs font-black uppercase text-wemodo-navy/40">Score Cumulative</span>
            <span className="text-3xl md:text-4xl font-black italic text-wemodo-navy leading-none">
              {totalScore} <span className="text-sm md:text-lg not-italic text-wemodo-navy/30">pts</span>
            </span>
          </div>

          <div className="flex flex-col text-right md:text-left border-l-2 border-wemodo-navy/10 pl-4 md:pl-6 hidden md:flex">
            <span className="text-[10px] md:text-xs font-black uppercase text-wemodo-navy/40">Manche</span>
            <span className="text-3xl md:text-4xl font-black italic text-wemodo-navy leading-none">
              {currentLevel + 1}
            </span>
          </div>
        </div>

        <div className="hidden md:block flex-1 max-w-md w-full h-4 bg-wemodo-navy/10 border-2 border-wemodo-navy overflow-hidden ml-4">
          <motion.div
            className="h-full bg-wemodo-yellow"
            animate={{ width: `${totalTargets > 0 ? Math.min(100, (foundIds.length / totalTargets) * 100) : 0}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Loading overlay indicator for background generation */}
      {(isLoadingNext && roundsData.length <= currentLevel + 1) && (
        <div className="text-right mx-4 md:mx-0 -mt-2 -mb-2">
          <span className="text-xs font-bold text-wemodo-navy/40 italic">Préparation de la manche suivante...</span>
        </div>
      )}

      {/* Main Text Area */}
      <div
        className={`bg-white p-6 md:p-10 md:border-4 border-wemodo-navy md:shadow-[12px_12px_0px_0px_rgba(18,14,61,1)] relative cursor-crosshair overflow-hidden mx-4 md:mx-0 transition-colors duration-300 ${isErrorFlash ? 'bg-red-50 border-red-500' : 'border-wemodo-navy'}`}
        onClick={handleContainerClick}
      >
        <AnimatePresence>
          {isErrorFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 bg-red-500/10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="text-xl md:text-2xl font-bold leading-relaxed text-wemodo-navy whitespace-pre-wrap relative z-10 pb-48">
          {currentData.map((segment, idx) => {
            const isFound = foundIds.includes(idx);
            const isError = errorIndices.includes(idx);

            return (
              <motion.span
                key={`${currentLevel}-${idx}`}
                onClick={(e) => handleSegmentClick(idx, segment, e)}
                animate={isFound ? {
                  backgroundColor: segment.type === 'hallucination' ? '#EF4444' : '#6634D9',
                  color: '#FFFFFF',
                  scale: 0.95,
                  opacity: 0.5,
                } : {
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  scale: 1,
                  opacity: 1,
                }}
                whileHover={!isFound ? {
                  scale: 1.05,
                  backgroundColor: "rgba(26, 27, 31, 0.1)"
                } : {}}
                whileTap={!isFound ? { scale: 0.95 } : {}}
                className={`
                  inline cursor-pointer transition-all duration-200 rounded-sm
                  ${isError ? 'bg-red-500 text-white animate-shake' : ''}
                  ${isFound ? 'px-1' : 'px-0'}
                `}
              >
                {segment.text}
              </motion.span>
            );
          })}
        </div>
      </div>

      {/* Explanation Tooltip */}
      <AnimatePresence mode="wait">
        {selectedInfo && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl"
          >
            <BrutalistCard className="bg-wemodo-yellow p-4 border-4 border-wemodo-navy shadow-[8px_8px_0_rgba(18,14,61,1)] flex items-start gap-4">
              <div className={`p-2 shrink-0 ${selectedInfo.type === 'hallucination' ? 'bg-red-600' : 'bg-wemodo-purple'} text-white`}>
                <Search size={24} />
              </div>
              <div className="flex-1">
                <p className="font-black text-wemodo-navy text-lg leading-tight uppercase italic mb-1">
                  {selectedInfo.type === 'hallucination' ? '🚨 Hallucination !' : '🎭 Cliché IA !'}
                </p>
                <p className="font-bold text-wemodo-navy leading-tight">
                  {selectedInfo.explanation}
                </p>
              </div>
            </BrutalistCard>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { left: 0; }
          25% { left: -4px; }
          75% { left: 4px; }
        }
        .animate-shake {
          position: relative;
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};
