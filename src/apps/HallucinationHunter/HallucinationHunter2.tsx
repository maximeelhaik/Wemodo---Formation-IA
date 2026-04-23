import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrutalistCard, BrutalistButton, WemodoLogo } from "../../components/BrutalistUI";
import { Search, Info, RotateCcw, Award, Sparkles, Loader2 } from "lucide-react";
import { usePersistentState } from "../../hooks/usePersistentState";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { Leaderboard } from "../../components/Leaderboard";

type TargetType = "hallucination" | "cliche" | "none";

interface TextSegment {
  text: string;
  type: TargetType;
  explanation?: string;
}

const RANDOM_THEMES = [
  { theme: "Critique gastronomique d'un restaurant de Paris", persona: "un blogueur culinaire un peu familier" },
  { theme: "Récit d'aventure sur l'ascension d'un sommet", persona: "un alpiniste écrivant son carnet de bord" },
  { theme: "Article de blog sur la psychologie d'un animal au choix", persona: "un comportementaliste animalier" },
  { theme: "Analyse d'une oeuvre d'art contemporaine", persona: "un critique d'art" },
  { theme: "Brève historique sur l'invention d'un objet du quotidien", persona: "un historien passionné" },
  { theme: "Conseils de jardinage urbain pour débutants", persona: "une voisine bienveissante" },
  { theme: "Portrait d'un musicien des années 50 à 80", persona: "un journaliste musical" },
  { theme: "Explication scientifique sur la formation d'un phénomène naturel", persona: "un chercheur enthousiaste" },
  { theme: "Chronique culturelle sur le renouveau du cinéma d'animation", persona: "un cinéphile" },
  { theme: "Guide de voyage sur une ville d'Europe", persona: "un guide touristique enthousiaste" },
  { theme: "Essai sur l'impact d'un type de musique", persona: "un étudiant en psychologie" },
  { theme: "Compte-rendu d'un match de sport", persona: "un commentateur sportif survolté" },
];

export const HallucinationHunter2: React.FC = () => {
  const [segments, setSegments] = usePersistentState<TextSegment[]>("wemodo-hunter-inf-segments", []);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [currentLevel, setCurrentLevel] = usePersistentState("wemodo-hunter-inf-level", 1);
  const [gameStarted, setGameStarted] = usePersistentState("wemodo-hunter-inf-started", false);
  const [foundIds, setFoundIds] = usePersistentState<number[]>("wemodo-hunter-inf-found", []);
  const [errorIndices, setErrorIndices] = useState<number[]>([]);
  const [isErrorFlash, setIsErrorFlash] = useState(false);
  const [isFinished, setIsFinished] = usePersistentState("wemodo-hunter-inf-finished", false);
  const [selectedInfo, setSelectedInfo] = useState<TextSegment | null>(null);
  const [username, setUsername] = useState("");
  const [hasSaved, setHasSaved] = useState(false);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const { saveScore, getAppLeaderboard } = useLeaderboard();
  const appId = "hallucination-hunter-v2";

  const hallucinations = useMemo(() => segments.filter(s => s.type === "hallucination"), [segments]);
  const cliches = useMemo(() => segments.filter(s => s.type === "cliche"), [segments]);

  const foundHallucinations = useMemo(() =>
    foundIds.filter(id => segments[id]?.type === "hallucination"),
    [foundIds, segments]);

  const foundCliches = useMemo(() =>
    foundIds.filter(id => segments[id]?.type === "cliche"),
    [foundIds, segments]);

  const totalTargets = segments.filter(s => s.type !== "none").length;

  const duration = useMemo(() => {
    if (startTime && endTime) {
      return Math.floor((endTime - startTime) / 1000);
    }
    return 0;
  }, [startTime, endTime]);

  const finalScore = useMemo(() => {
    if (!duration) return 0;
    return Math.max(100, (1000 + (currentLevel * 200)) - duration * 5);
  }, [duration, currentLevel]);

  const fetchGameData = async (targetTheme?: string) => {
    setIsLoading(true);
    setSegments([]);
    setFoundIds([]);
    setIsFinished(false);
    setSelectedInfo(null);
    setStartTime(null);
    setEndTime(null);
    setHasSaved(false);

    let finalTheme = targetTheme || theme;
    let finalPersona = "un rédacteur professionnel au style neutre";

    // Random iteration if no theme provided
    if (!finalTheme) {
      const entry = RANDOM_THEMES[Math.floor(Math.random() * RANDOM_THEMES.length)];
      finalTheme = entry.theme;
      finalPersona = entry.persona;
    }

    try {
      const res = await fetch('/api/hunt-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          theme: finalTheme,
          persona: finalPersona,
          hallsCount: Math.max(1, Math.floor(currentLevel / 2) + 1),
          clichesCount: Math.max(1, Math.ceil(currentLevel / 2)),
          maxWords: 150 + (currentLevel * 10)
        })
      });
      const data = await res.json();
      if (data.segments) {
        setSegments(data.segments);
        setGameStarted(true);
      }
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (isFinished) return;

    if (!startTime) setStartTime(Date.now());

    if (segment.type !== "none") {
      if (!foundIds.includes(index)) {
        setFoundIds(prev => {
          const next = [...prev, index];
          if (next.length === totalTargets) {
            setEndTime(Date.now());
            setTimeout(() => setIsFinished(true), 1000);
          }
          return next;
        });
        setSelectedInfo(segment);
      } else {
        setSelectedInfo(segment);
      }
    } else {
      triggerMiss(index);
    }
  };

  const resetToHome = () => {
    setGameStarted(false);
    setSegments([]);
    setFoundIds([]);
    setIsFinished(false);
    setSelectedInfo(null);
    setCurrentLevel(1);
  };

  const nextRound = () => {
    setCurrentLevel(prev => prev + 1);
    // The useEffect or manual call below will refresh context
  };

  useEffect(() => {
    if (currentLevel > 1 && gameStarted && isFinished === false && segments.length === 0) {
      fetchGameData();
    }
  }, [currentLevel]);

  const handleSaveScore = async () => {
    if (!username.trim()) return;
    await saveScore({
      username: username.trim(),
      score: finalScore,
      total: totalTargets,
      time: duration,
      appId
    });
    setHasSaved(true);
  };

  // Start Screen
  if (!gameStarted && !isLoading) {
    return (
      <div className="flex flex-col gap-8 max-w-2xl mx-auto py-10 px-4">
        <div className="text-center space-y-4">
          <div className="inline-block p-3 bg-wemodo-purple text-white mb-4">
            <Sparkles size={40} />
          </div>
          <h1 className="font-display font-black text-5xl md:text-6xl uppercase italic tracking-tighter text-wemodo-navy leading-none">
            Hunter <span className="text-wemodo-purple text-4xl">Infinity</span>
          </h1>
          <p className="font-bold text-wemodo-navy/60 uppercase text-sm tracking-widest leading-relaxed">
            Chaque partie est unique. L'IA génère un texte truffé de pièges.<br />
            Serez-vous capable de tous les débusquer ?
          </p>
        </div>

        <BrutalistCard className="bg-white p-8 border-4 border-wemodo-navy shadow-[12px_12px_0px_0px_rgba(18,14,61,1)]">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="font-black uppercase text-xs text-wemodo-navy/60">Choisis ton thème (optionnel)</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ex: Le futur de la médecine, L'histoire de Napoléon..."
                className="w-full p-4 border-4 border-wemodo-navy font-bold text-lg focus:outline-none focus:ring-4 ring-wemodo-purple/20"
              />
            </div>
            <BrutalistButton
              onClick={() => fetchGameData()}
              className="bg-wemodo-yellow text-wemodo-navy border-wemodo-navy h-16 text-xl shadow-[6px_6px_0px_0px_rgba(18,14,61,1)]"
            >
              Générer la partie
            </BrutalistButton>
          </div>
        </BrutalistCard>

        <div className="mt-8">
          <Leaderboard entries={getAppLeaderboard(appId)} title="Légendes de l'IA" />
        </div>
      </div>
    );
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Loader2 size={64} className="animate-spin text-wemodo-purple" />
        <div className="text-center animate-pulse">
          <p className="font-black text-2xl uppercase italic text-wemodo-navy">L'IA prépare tes pièges...</p>
          <p className="text-wemodo-navy/40 font-bold">Invention des fausses stats en cours</p>
        </div>
      </div>
    );
  }

  // Game Finished Screen
  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-start overflow-y-auto p-4 md:p-10 bg-wemodo-navy transition-colors duration-500"
      >
        <div className="mb-6 shrink-0">
          <WemodoLogo variant="light" className="h-10 md:h-14" />
        </div>

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-6 p-8 md:p-10 bg-white text-wemodo-navy md:shadow-[16px_16px_0px_0px_rgba(244,255,126,1)] md:border-4 border-wemodo-navy items-center md:items-start"
          >
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase italic tracking-tighter text-center md:text-left leading-none">
              Impressionnant !
            </h2>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-xl md:text-2xl font-black leading-tight border-b-8 md:border-b-0 md:border-l-8 border-wemodo-navy pb-4 md:pb-0 md:pl-4 md:py-2 text-center md:text-left">
                Tu as débusqué les {totalTargets} pièges générés par l'IA !
              </p>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex justify-center md:justify-start gap-4 font-black">
                  <span className="bg-wemodo-purple text-white px-3 py-1">🎯 {totalTargets}/{totalTargets} Trouvés</span>
                  <span className="bg-wemodo-yellow text-wemodo-navy px-3 py-1">⏱️ {duration}s</span>
                </div>
                <div className="bg-wemodo-navy text-wemodo-yellow p-4 text-center md:text-left border-4 border-wemodo-navy">
                  <span className="text-xs uppercase block opacity-70">Ton Score Final</span>
                  <span className="text-4xl font-black">{finalScore} pts</span>
                </div>
              </div>
            </div>

            {!hasSaved ? (
              <div className="w-full flex flex-col gap-3 mt-4 bg-wemodo-cream/50 p-4 border-2 border-wemodo-navy border-dashed text-wemodo-navy">
                <p className="font-black text-xs uppercase tracking-widest opacity-60">Enregistre ton exploit ?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ton pseudo..."
                    className="flex-1 px-4 py-2 border-2 border-wemodo-navy font-bold focus:outline-none"
                  />
                  <button
                    onClick={handleSaveScore}
                    disabled={!username.trim()}
                    className="bg-wemodo-navy text-white px-4 py-2 font-black uppercase text-xs"
                  >
                    OK
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full py-4 px-6 bg-wemodo-yellow border-4 border-wemodo-navy flex items-center gap-3">
                <Award size={24} className="text-wemodo-navy" />
                <span className="font-black uppercase italic tracking-tighter text-lg text-wemodo-navy">Score immortalisé !</span>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full mt-4">
              <BrutalistButton
                onClick={nextRound}
                className="bg-wemodo-yellow text-wemodo-navy border-wemodo-navy h-14 md:h-16 text-xl w-full shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]"
              >
                Manche Suivante
              </BrutalistButton>
              <BrutalistButton
                onClick={resetToHome}
                className="bg-white text-wemodo-navy border-wemodo-navy h-12 text-sm w-full"
              >
                <RotateCcw size={16} /> Retour au menu
              </BrutalistButton>
            </div>
          </motion.div>
          <Leaderboard entries={getAppLeaderboard(appId)} title="Top Chasseurs" />
        </div>
      </motion.div>
    );
  }

  // Game UI (Main)
  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto p-0 md:p-2 bg-transparent w-full">
      <div className="space-y-3 px-4 md:px-0 mt-4 md:mt-0 flex justify-between items-end">
        <div>
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase italic tracking-tighter text-wemodo-navy leading-none">
            Chasse <span className="text-wemodo-purple">Infinie !</span>
          </h1>
          <p className="font-bold text-wemodo-navy/70 uppercase text-xs tracking-widest mt-2 px-1 border-l-4 border-wemodo-purple">
            Manche {currentLevel} • Mode Dynamique
          </p>
        </div>
        <BrutalistButton
          onClick={resetToHome}
          className="bg-white text-wemodo-navy border-2 border-wemodo-navy px-3 py-1 text-xs shadow-none hover:bg-red-50"
        >
          Quitter
        </BrutalistButton>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border-b-4 md:border-4 border-wemodo-navy p-4 md:shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] mx-4 md:mx-0">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs font-black uppercase text-wemodo-navy/40">🚨 Hallucinations</span>
            <span className="text-2xl md:text-3xl font-black italic text-red-500 leading-none">
              {foundHallucinations.length} <span className="text-sm not-italic text-wemodo-navy/30">/ {hallucinations.length}</span>
            </span>
          </div>
          <div className="flex flex-col border-l-2 border-wemodo-navy/10 pl-8">
            <span className="text-[10px] md:text-xs font-black uppercase text-wemodo-navy/40">🎭 Clichés IA</span>
            <span className="text-2xl md:text-3xl font-black italic text-wemodo-purple leading-none">
              {foundCliches.length} <span className="text-sm not-italic text-wemodo-navy/30">/ {cliches.length}</span>
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md w-full gap-1 h-3">
          <div className="flex-1 bg-wemodo-navy/10 border border-wemodo-navy overflow-hidden relative">
            <motion.div
              className="h-full bg-red-400"
              initial={{ width: 0 }}
              animate={{ width: `${(foundHallucinations.length / (hallucinations.length || 1)) * 100}%` }}
            />
          </div>
          <div className="flex-1 bg-wemodo-navy/10 border border-wemodo-navy overflow-hidden">
            <motion.div
              className="h-full bg-wemodo-purple"
              initial={{ width: 0 }}
              animate={{ width: `${(foundCliches.length / (cliches.length || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div
        className={`bg-white p-6 md:p-10 md:border-4 border-wemodo-navy md:shadow-[12px_12px_0px_0px_rgba(18,14,61,1)] relative cursor-crosshair overflow-hidden mx-4 md:mx-0 transition-colors duration-300 ${isErrorFlash ? 'bg-red-50 border-red-500' : 'border-wemodo-navy'}`}
        onClick={() => !isFinished && triggerMiss()}
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
          {segments.map((segment, idx) => {
            const isFound = foundIds.includes(idx);
            const isError = errorIndices.includes(idx);

            return (
              <motion.span
                key={idx}
                onClick={(e) => handleSegmentClick(idx, segment, e)}
                animate={isFound ? {
                  backgroundColor: segment.type === 'hallucination' ? '#EF4444' : '#6634D9',
                  color: '#FFFFFF',
                  scale: 0.95,
                  opacity: 0.5,
                } : {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  color: 'inherit',
                  scale: 1,
                  opacity: 1,
                }}
                whileHover={!isFound ? {
                  scale: 1.05,
                  backgroundColor: "rgba(26, 27, 31, 0.1)"
                } : {}}
                whileTap={!isFound ? { scale: 0.95 } : {}}
                className={`inline px-1 cursor-pointer transition-colors duration-200 rounded ${isError ? 'bg-red-500 text-white animate-shake' : ''}`}
              >
                {segment.text}
              </motion.span>
            );
          })}
        </div>
      </div>

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
              <div className="flex-1 text-wemodo-navy">
                <p className="font-black text-lg leading-tight uppercase italic mb-1">
                  {selectedInfo.type === 'hallucination' ? '🚨 Hallucination !' : '🎭 Cliché IA !'}
                </p>
                <p className="font-bold leading-tight">{selectedInfo.explanation}</p>
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
