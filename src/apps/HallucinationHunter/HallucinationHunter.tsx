import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrutalistCard, BrutalistButton, WemodoLogo } from "../../components/BrutalistUI";
import { Search, RotateCcw } from "lucide-react";
import { usePersistentState } from "../../hooks/usePersistentState";

// For later restitution of the leaderboard
// import { useLeaderboard } from "../../hooks/useLeaderboard";
// import { Leaderboard } from "../../components/Leaderboard";

const RANDOM_THEMES = [
  { theme: "Critique gastronomique d'un restaurant de Paris", persona: "un blogueur culinaire un peu familier" },
  { theme: "Récit d'aventure sur l'ascension d'un sommet", persona: "un alpiniste écrivant son carnet de bord" },
  { theme: "Article de blog sur la psychologie d'un animal au choix", persona: "un comportementaliste animalier" },
  { theme: "Analyse d'une oeuvre d'art contemporaine", persona: "un critique d'art" },
  { theme: "Brève historique sur l'invention d'un objet du quotidien", persona: "un historien passionné" },
  { theme: "Conseils de jardinage urbain pour débutants", persona: "une voisine bienveillante" },
  { theme: "Portrait d'un musicien des années 50 à 80", persona: "un journaliste musical" },
  { theme: "Explication scientifique sur la formation d'un phénomène naturel (au choix)", persona: "un chercheur enthousiaste" },
  { theme: "Chronique culturelle sur le renouveau du cinéma d'animation", persona: "un cinéphile" },
  { theme: "Guide de voyage sur une ville d'Europe (au choix)", persona: "un guide touristique enthousiaste" },
  { theme: "Essai sur l'impact d'un type de musique (au choix)", persona: "un étudiant en psychologie" },
  { theme: "Compte-rendu d'un match de sport", persona: "un commentateur sportif survolté" },
  { theme: "Réflexion philosophique sur un concept non physique", persona: "un philosophe contemporain" },
  { theme: "Newsletter sur les tendances de la mode éco-responsable", persona: "une influenceuse mode engagée" },
  { theme: "Fait divers sur une découverte archéologique", persona: "un journaliste de presse locale" },
  { theme: "Texte descriptif d'un marché traditionnel ", persona: "un habitant local fier de son terroir et très descriptif" },
  { theme: "Introduction à la mythologie nordique et ses symboles", persona: "un historien passionné de récits épiques" },
  { theme: "Critique de film sur une saga de science-fiction célèbre", persona: "un fan de SF  critique sur la cohérence scientifique" },
  { theme: "Billet d'humeur sur la vie sans smartphone pendant une semaine", persona: "un technophobe assumé et un peu provocateur" },
  { theme: "Vulgarisation sur le fonctionnement d'un concept scientifique", persona: "un physicien qui utilise beaucoup d'analogies" },
];

type TargetType = "hallucination" | "cliche" | "none";

interface TextSegment {
  text: string;
  type: TargetType;
  explanation?: string;
}

// Level 1 Static Data: 1 Cliché, 1 Hallucination, ~100 words
const HUNTER_DATA: TextSegment[] = [
  { text: "Franchement, si vous traînez un peu sur les blogs en ce moment, vous avez forcément remarqué ce truc. ", type: "none" },
  { text: "Une sorte de nappe de brouillard sémantique qui envahit tout. ", type: "none" },
  { text: "Il est indéniable que", type: "cliche", explanation: "Transition lourde et péremptoire, typique du 'style robot' qui cherche à imposer une vérité sans nuance." },
  { text: " l'IA va nous faire gagner un temps fou, mais ce qu'on voit surtout, c'est une uniformisation flippante des contenus. ", type: "none" },
  { text: "Selon un rapport de ", type: "none" },
  { text: "l’Institut européen de la Data Digital", type: "hallucination", explanation: "Cet institut n'existe pas. C'est une invention crédible qui profite du flou institutionnel autour du numérique." },
  { text: ", près de la moitié des articles web actuels contiendraient déjà des traces de génération automatisée. ", type: "none" },
  { text: "Moi, quand j'écris, j'aime bien quand ça gratte, quand il y a une tournure un peu bancale ", type: "none" },
  { text: "qui prouve que je ne suis pas un algorithme. ", type: "none" },
  { text: "Le problème, c'est que la tentation du bouton 'générer' est forte, surtout pour plaire aux moteurs de recherche. ", type: "none" },
  { text: "On finit par perdre cette petite étincelle humaine ", type: "none" },
  { text: "qui fait qu'on a envie de lire un article jusqu'au bout sans soupirer.", type: "none" }
];

export const HallucinationHunter: React.FC = () => {
  const [totalScore, setTotalScore] = usePersistentState("wemodo-hunter-score", 0);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [roundsData, setRoundsData] = usePersistentState<TextSegment[][]>("wemodo-hunter-rounds", [HUNTER_DATA]);
  const [currentLevel, setCurrentLevel] = usePersistentState("wemodo-hunter-level", 0);

  const [foundIds, setFoundIds] = usePersistentState<number[]>("wemodo-hunter-found", []);
  const [errorIndices, setErrorIndices] = useState<number[]>([]);
  const [isErrorFlash, setIsErrorFlash] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<TextSegment | null>(null);
  const [prefetchError, setPrefetchError] = useState<boolean>(false);

  const [startTime, setStartTime] = useState<number | null>(null);

  const currentData = roundsData[currentLevel];
  const targets = useMemo(() => currentData?.filter(s => s.type !== "none") || [], [currentData]);
  const totalTargets = targets.length;

  const stats = useMemo(() => {
    const halls = currentData?.filter(s => s.type === "hallucination") || [];
    const cliches = currentData?.filter(s => s.type === "cliche") || [];
    const foundHallsCount = foundIds.filter(id => currentData[id]?.type === "hallucination").length;
    const foundClichesCount = foundIds.filter(id => currentData[id]?.type === "cliche").length;

    return {
      totalHalls: halls.length,
      totalCliches: cliches.length,
      foundHalls: foundHallsCount,
      foundCliches: foundClichesCount
    };
  }, [currentData, foundIds]);

  // 💡 Background Prefetching Logic
  // We want to always have 2 levels ready ahead of the current one
  useEffect(() => {
    // If we're not already loading and not generating a custom theme
    // Buffer limit: currentLevel + 2 means we have current level + 1 upcoming level ready
    if (!isLoadingNext && !prefetchError && roundsData.length < currentLevel + 2) {
      const fetchRound = async () => {
        setIsLoadingNext(true);
        const levelToFetch = roundsData.length + 1;
        const entry = RANDOM_THEMES[Math.floor(Math.random() * RANDOM_THEMES.length)];
        const theme = entry.theme;
        const persona = entry.persona;

        console.log(`[Hunter] 📡 Prefetching level ${levelToFetch} (Theme: ${theme})...`);

        try {
          // Difficulty scaling matches the dynamic loop
          const halls = Math.floor(levelToFetch / 2);
          const cliches = Math.ceil(levelToFetch / 2);
          const words = 60 + levelToFetch * 20;

          const res = await fetch("/api/hunt-generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              theme,
              persona,
              hallsCount: halls,
              clichesCount: cliches,
              maxWords: words
            })
          });

          if (!res.ok) throw new Error(`API returned ${res.status}`);

          const data = await res.json();
          if (data.segments && data.segments.length > 0) {
            setRoundsData(prev => {
              // Double check to avoid duplicates during race conditions
              if (prev.length >= levelToFetch) return prev;
              return [...prev, data.segments];
            });
            setPrefetchError(false);
            console.log(`[Hunter] ✅ Level ${levelToFetch} cached.`);
          }
        } catch (err) {
          console.error(`[Hunter] ❌ Failed to prefetch level ${levelToFetch}:`, err);
          setPrefetchError(true); // Stop retrying this level until currentLevel changes or success
        } finally {
          setIsLoadingNext(false);
        }
      };

      fetchRound();
    }
  }, [roundsData.length, currentLevel, isLoadingNext]);

  const advanceToNextRound = useCallback((roundScore: number) => {
    setTotalScore(prev => prev + roundScore);
    setFoundIds([]);
    setErrorIndices([]);
    setIsErrorFlash(false);
    setSelectedInfo(null);
    setStartTime(null);
    setPrefetchError(false); // Reset error on round change to allow new prefetch attempt
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

  const resetToStart = () => {
    setCurrentLevel(0);
    setRoundsData([HUNTER_DATA]);
    setFoundIds([]);
    setErrorIndices([]);
    setIsErrorFlash(false);
    setSelectedInfo(null);
    setStartTime(null);
    setTotalScore(0);
    setPrefetchError(false);
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
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-5xl mx-auto bg-transparent py-4 md:py-12">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto space-y-4 px-4 md:px-0 mt-4 md:mt-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-3">
          <button 
            onClick={resetToStart}
            className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-wemodo-navy/50 hover:text-wemodo-purple transition-colors mb-2"
          >
            <RotateCcw size={14} /> Recommencer à zéro (Niv. 1)
          </button>
          <h1 className="font-display font-black text-5xl md:text-7xl uppercase italic tracking-tighter text-wemodo-navy leading-none mb-2">
            CHASSE AUX <span className="text-wemodo-purple">HALLUCINATIONS</span>
          </h1>
          <p className="font-bold text-wemodo-navy/70 uppercase text-xs md:text-sm tracking-widest max-w-xl">
            Identifie les hallucinations et les pièges cachés par l'IA.
          </p>
        </div>
      </div>

      {/* Stats Info */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white border-b-4 md:border-4 border-wemodo-navy p-4 md:shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] shrink-0 mx-4 md:mx-0">
        <div className="flex items-center gap-4 md:gap-8 flex-wrap">
          {/* Hallucinations counter */}
          <div className="flex flex-col pr-4 md:pr-8">
            <span className="text-[10px] md:text-xs font-black uppercase text-red-600/60">🚨 Hallucinations</span>
            <span className="text-3xl md:text-4xl font-black italic text-red-600 leading-none">
              {stats.foundHalls} <span className="text-lg not-italic text-wemodo-navy/30">/ {stats.totalHalls}</span>
            </span>
          </div>

          {/* Clichés counter */}
          <div className="flex flex-col border-l-2 border-wemodo-navy/10 pl-4 md:pl-8">
            <span className="text-[10px] md:text-xs font-black uppercase text-wemodo-purple/60">🎭 Clichés IA</span>
            <span className="text-3xl md:text-4xl font-black italic text-wemodo-purple leading-none">
              {stats.foundCliches} <span className="text-lg not-italic text-wemodo-navy/30">/ {stats.totalCliches}</span>
            </span>
          </div>

          {/* Score & Level */}
          <div className="flex flex-col border-l-2 border-wemodo-navy/10 pl-4 md:pl-8">
            <span className="text-[10px] md:text-xs font-black uppercase text-wemodo-navy/40">Total Score</span>
            <span className="text-3xl md:text-4xl font-black italic text-wemodo-navy leading-none">
              {totalScore}
            </span>
          </div>

          <div className="flex flex-col border-l-2 border-wemodo-navy/10 pl-4 md:pl-8 hidden md:flex">
            <span className="text-[10px] md:text-xs font-black uppercase text-wemodo-navy/40">Manche</span>
            <span className="text-3xl md:text-4xl font-black italic text-wemodo-navy leading-none">
              {currentLevel + 1}
            </span>
          </div>
        </div>

        <div className="hidden lg:block flex-1 max-w-[200px] w-full h-8 bg-wemodo-navy/5 border-2 border-wemodo-navy relative overflow-hidden ml-4">
          <motion.div
            className="h-full bg-wemodo-yellow"
            animate={{ width: `${totalTargets > 0 ? Math.min(100, (foundIds.length / totalTargets) * 100) : 0}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black uppercase text-wemodo-navy tracking-tighter">Progression</span>
          </div>
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
