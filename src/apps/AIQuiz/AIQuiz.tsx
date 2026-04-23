import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getQuizData } from "../../data/quizzes";
import { QuizState, Question } from "../../types";
import { BrutalistCard, BrutalistButton, WemodoLogo } from "../../components/BrutalistUI";
import { ChevronRight, RotateCcw, Award, CheckCircle2, XCircle, Timer, User, Zap, Brain, ArrowLeft } from "lucide-react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { usePersistentState } from "../../hooks/usePersistentState";
import { Leaderboard } from "../../components/Leaderboard";

interface AIQuizProps {
  questions?: Question[];
  initialLevel?: number;
}

export const AIQuiz: React.FC<AIQuizProps> = ({ questions: propQuestions, initialLevel = 1 }) => {
  const [currentLevel, setCurrentLevel] = usePersistentState<number | null>("wemodo-quiz-current-level", null);
  const [gameStarted, setGameStarted] = usePersistentState("wemodo-quiz-game-started", false);
  const [questions, setQuestions] = usePersistentState<Question[]>("wemodo-quiz-questions", propQuestions || []);
  const [isLoading, setIsLoading] = useState(false);
  
  const [state, setState] = usePersistentState<QuizState>("wemodo-quiz-state", {
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    isFinished: false,
    selectedOption: null,
    hasValidated: false,
  });

  const [timeLeft, setTimeLeft] = useState(10);
  const [username, setUsername] = useState("");
  const [hasSaved, setHasSaved] = useState(false);
  const [isTransitioningToScore, setIsTransitioningToScore] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { saveScore, getAppLeaderboard } = useLeaderboard();

  // Determine app ID for leaderboard
  const appId = `quiz-v2-level-${currentLevel}`;

  const currentQuestion = questions[state.currentQuestionIndex];

  // Handle automatic progression after validation
  useEffect(() => {
    if (state.hasValidated && !state.isFinished) {
      setTimeLeft(10);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleNext();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.hasValidated, state.currentQuestionIndex]);

  const handleLevelSelect = async (level: number) => {
    setIsLoading(true);
    setCurrentLevel(level);
    
    // Lazy load the questions
    const chapterId = `level${level}`;
    const loadedQuestions = await getQuizData('GEN_AI', chapterId);
    setQuestions(loadedQuestions);
    
    setIsLoading(false);
    setGameStarted(true);
    resetQuiz();
  };

  const handleOptionSelect = (index: number) => {
    if (state.hasValidated || state.selectedOption !== null) return;
    
    const isCorrect = index === currentQuestion.correctAnswer;
    
    // First step: highlight the selection
    setState((prev) => ({ 
      ...prev, 
      selectedOption: index,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    // Second step: show overlay after a short delay
    setTimeout(() => {
      setState(prev => ({ ...prev, hasValidated: true }));
    }, 800);
  };

  const handleNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const isLastQuestion = state.currentQuestionIndex === questions.length - 1;
    if (isLastQuestion) {
      setIsTransitioningToScore(true);
      setState((prev) => ({ ...prev, hasValidated: false })); // Hide explanation
      setTimeout(() => {
        setState((prev) => ({ ...prev, isFinished: true }));
        setIsTransitioningToScore(false);
      }, 1000);
    } else {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedOption: null,
        hasValidated: false,
      }));
    }
  };

  const resetQuiz = () => {
    setState({
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isFinished: false,
      selectedOption: null,
      hasValidated: false,
    });
    setHasSaved(false);
  };

  const handleSaveScore = () => {
    if (!username.trim()) return;
    saveScore({
      username: username.trim(),
      score: state.score,
      total: questions.length,
      appId
    });
    setHasSaved(true);
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-wemodo-navy text-white">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mb-8"
        >
          <Brain size={80} className="text-wemodo-yellow" />
        </motion.div>
        <h2 className="font-display font-black text-4xl mt-4 uppercase italic tracking-tighter">
          Chargement du <span className="text-wemodo-purple">Quiz...</span>
        </h2>
        <div className="mt-8 w-48 h-2 bg-white/20 border-2 border-white overflow-hidden">
          <motion.div 
            className="h-full bg-wemodo-yellow"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  // Level Selection Screen
  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-8 py-4 md:py-8 px-4">
        <div className="space-y-4">
          <h1 className="font-display font-black text-5xl md:text-7xl uppercase italic tracking-tighter text-wemodo-navy leading-none">
            QUIZ <span className="text-wemodo-purple">IA</span>
          </h1>
          <p className="font-bold text-wemodo-navy/70 uppercase text-sm md:text-base tracking-widest max-w-2xl">
            Choisis ton niveau et teste tes connaissances sur l'IA Générative.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <motion.div 
            whileHover={{ scale: 1.02, rotate: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLevelSelect(1)}
            className="group cursor-pointer"
          >
            <div className="h-full bg-wemodo-yellow border-4 border-wemodo-navy p-8 md:p-10 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(18,14,61,1)]">
              <div className="bg-white border-4 border-wemodo-navy w-16 h-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]">
                <Zap size={32} className="text-wemodo-purple fill-wemodo-purple" />
              </div>
              <div>
                <h2 className="font-display font-black text-4xl uppercase italic tracking-tighter leading-none mb-2">Niveau 1</h2>
                <p className="font-black uppercase text-xs tracking-widest text-wemodo-navy/60 mb-4">BASES & FONDATIONS</p>
                <p className="text-lg font-bold leading-tight">
                  Comprendre ce qu'est l'IA générative, les outils essentiels et les premiers concepts clés pour bien démarrer.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2 font-black uppercase text-sm group-hover:gap-4 transition-all">
                DÉMARRER <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLevelSelect(2)}
            className="group cursor-pointer"
          >
            <div className="h-full bg-wemodo-pink border-4 border-wemodo-navy p-8 md:p-10 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(18,14,61,1)]">
              <div className="bg-white border-4 border-wemodo-navy w-16 h-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]">
                <Brain size={32} className="text-wemodo-purple fill-wemodo-purple" />
              </div>
              <div>
                <h2 className="font-display font-black text-4xl uppercase italic tracking-tighter leading-none mb-2">Niveau 2</h2>
                <p className="font-black uppercase text-xs tracking-widest text-wemodo-navy/60 mb-4">MÉTHODES & USAGES</p>
                <p className="text-lg font-bold leading-tight">
                  Maîtriser les méthodes ROCIF, les 3R et les bonnes pratiques de feedback pour devenir vraiment productif au quotidien.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2 font-black uppercase text-sm group-hover:gap-4 transition-all">
                DÉMARRER <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, rotate: -0.5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLevelSelect(3)}
            className="group cursor-pointer"
          >
            <div className="h-full bg-wemodo-purple text-white border-4 border-wemodo-navy p-8 md:p-10 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(18,14,61,1)]">
              <div className="bg-white border-4 border-wemodo-navy w-16 h-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]">
                <Zap size={32} className="text-wemodo-purple fill-wemodo-purple" />
              </div>
              <div>
                <h2 className="font-display font-black text-4xl uppercase italic tracking-tighter leading-none mb-2">Niveau 3</h2>
                <p className="font-black uppercase text-xs tracking-widest text-white/60 mb-4">MAÎTRISE & RISQUES</p>
                <p className="text-lg font-bold leading-tight">
                   Fonctionnement technique, sécurité des données et enjeux éthiques. Pour ceux qui veulent aller au-delà de la surface.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2 font-black uppercase text-sm group-hover:gap-4 transition-all">
                DÉMARRER <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, rotate: 0.5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLevelSelect(4)}
            className="group cursor-pointer"
          >
            <div className="h-full bg-wemodo-navy text-white border-4 border-wemodo-navy p-8 md:p-10 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(18,14,61,1)]">
              <div className="bg-white border-4 border-wemodo-navy w-16 h-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]">
                <Zap size={32} className="text-wemodo-purple fill-wemodo-purple" />
              </div>
              <div>
                <h2 className="font-display font-black text-4xl uppercase italic tracking-tighter leading-none mb-2">Niveau 4</h2>
                <p className="font-black uppercase text-xs tracking-widest text-white/60 mb-4">STRATÉGIE & EXPERTISE</p>
                <p className="text-lg font-bold leading-tight">
                  Transformers, RAG, IA Act et vision stratégique métier. Le défi ultime pour les futurs experts de l'IA.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2 font-black uppercase text-sm group-hover:gap-4 transition-all">
                DÉMARRER <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Finished Screen
  if (state.isFinished) {
    const percentage = (state.score / questions.length) * 100;
    let comment = "Ouch ! Il va falloir réviser un peu... 😅";
    let bgColor = "bg-[#FF4D4D]";
    if (percentage >= 50) { comment = "Pas mal ! Tu as de bonnes bases. 👍"; bgColor = "bg-wemodo-pink"; }
    if (percentage >= 80) { comment = "Excellent ! Tu es un vrai expert ! 🚀"; bgColor = "bg-wemodo-purple"; }
    if (percentage === 100) { comment = "INCROYABLE ! Zéro faute, tu es un génie ! 🤖👑"; bgColor = "bg-[#4ADE80]"; }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-start overflow-y-auto p-4 md:p-10 ${bgColor} transition-colors duration-500`}
      >
        <div className="mb-6 shrink-0">
          <WemodoLogo variant="light" className="h-10 md:h-14" />
        </div>

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-6 p-8 md:p-10 bg-white text-wemodo-navy md:shadow-[16px_16px_0px_0px_rgba(18,14,61,1)] md:border-4 border-wemodo-navy items-center md:items-start"
          >
            <div className="flex flex-col gap-2 mb-2">
              <h2 className="font-display font-black text-5xl md:text-6xl uppercase italic tracking-tighter text-center md:text-left leading-none">
                Bilan !
              </h2>
              <div className="h-2 w-24 bg-wemodo-navy mx-auto md:mx-0" />
            </div>

            <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
              <div className="relative">
                <span className="block text-8xl md:text-9xl font-black italic tracking-tighter leading-none">
                  {state.score}
                  <span className="text-4xl md:text-5xl opacity-30 not-italic ml-2">/ {questions.length}</span>
                </span>
              </div>
              <p className="text-2xl font-black leading-tight border-b-8 md:border-b-0 md:border-l-8 border-wemodo-navy pb-4 md:pb-0 md:pl-4 md:py-2">
                {comment}
              </p>
            </div>

            {!hasSaved ? (
              <div className="w-full flex flex-col gap-3 mt-4 bg-wemodo-cream/50 p-4 border-2 border-wemodo-navy border-dashed">
                <p className="font-black text-xs uppercase tracking-widest text-wemodo-navy/60 text-center md:text-left">
                  Enregistre ton score ?
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ton pseudo..."
                    className="flex-1 px-4 py-2 border-2 border-wemodo-navy font-bold focus:outline-none focus:ring-2 focus:ring-wemodo-pink"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveScore()}
                  />
                  <button 
                    onClick={handleSaveScore}
                    disabled={!username.trim()}
                    className="bg-wemodo-navy text-white px-4 py-2 font-black uppercase text-xs border-2 border-wemodo-navy hover:bg-wemodo-purple disabled:opacity-50 transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full py-4 px-6 bg-wemodo-yellow border-4 border-wemodo-navy flex items-center gap-3">
                <Award size={24} className="animate-bounce" />
                <span className="font-black uppercase italic tracking-tighter text-lg">Score enregistré !</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 w-full mt-4">
              <BrutalistButton 
                onClick={resetQuiz} 
                className="flex items-center justify-center gap-4 bg-wemodo-navy text-white hover:bg-wemodo-purple border-wemodo-navy h-14 text-xl w-full shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]"
              >
                <RotateCcw size={20} /> Recommencer
              </BrutalistButton>
              <BrutalistButton 
                onClick={() => setGameStarted(false)} 
                className="flex items-center justify-center gap-4 bg-white text-wemodo-navy hover:bg-wemodo-yellow border-wemodo-navy h-14 text-xl w-full shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]"
              >
                <ArrowLeft size={20} /> Retour aux niveaux
              </BrutalistButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Leaderboard entries={getAppLeaderboard(appId)} />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Gameplay Screen
  return (
    <div className="max-w-2xl mx-auto flex flex-col min-h-full gap-6 md:gap-8 py-0 md:py-1 bg-transparent">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 md:px-0 mt-4 md:mt-0">
        <div className="space-y-1">
          <button 
            onClick={() => setGameStarted(false)}
            className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-wemodo-navy/50 hover:text-wemodo-purple transition-colors mb-2"
          >
            <ArrowLeft size={14} /> Sommaire des niveaux
          </button>
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase italic tracking-tighter text-wemodo-navy leading-none">
            Quiz <span className="text-wemodo-purple">Niveau {currentLevel}</span>
          </h1>
        </div>
        <div className="shrink-0 flex items-center gap-3 bg-white border-4 border-wemodo-navy p-3 shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]">
          <div className="flex flex-col">
            <span className="font-black uppercase text-[10px] text-wemodo-navy/50 leading-none mb-1">Score Actuel</span>
            <span className="font-display font-black text-2xl italic leading-none">{state.score} / {questions.length}</span>
          </div>
          <div className="h-8 w-1 bg-wemodo-navy/10" />
          <div className="flex flex-col">
            <span className="font-black uppercase text-[10px] text-wemodo-navy/50 leading-none mb-1">Progression</span>
            <span className="font-display font-black text-2xl italic leading-none">{Math.round(((isTransitioningToScore ? state.currentQuestionIndex + 1 : state.currentQuestionIndex) / questions.length) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 md:px-0">
        <div className="w-full h-4 border-4 border-wemodo-navy bg-white shadow-[4px_4px_0px_0px_rgba(18,14,61,1)] overflow-hidden">
          <motion.div 
            className="h-full bg-wemodo-yellow border-r-4 border-wemodo-navy"
            initial={{ width: 0 }}
            animate={{ width: `${((isTransitioningToScore ? state.currentQuestionIndex + 1 : state.currentQuestionIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentQuestionIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="flex-1 flex flex-col gap-0 md:gap-5 overflow-hidden"
        >
          <div className="bg-wemodo-yellow p-8 md:p-10 border-4 border-wemodo-navy shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] shrink-0 mx-4 md:mx-0">
            <h1 className="text-2xl md:text-4xl font-black leading-[1.1] text-wemodo-navy tracking-tight">
              {currentQuestion.text}
            </h1>
          </div>

          <div className="px-4 md:px-0 py-6 md:py-4">
            <div className="grid grid-cols-1 gap-4 md:gap-5">
              {currentQuestion.options.map((option, index) => {
                const isSelected = state.selectedOption === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const isWrongSelection = isSelected && !isCorrect;

                let customStyles = "bg-white text-wemodo-navy";
                let icon = null;

                if (state.selectedOption !== null) {
                  if (index === currentQuestion.correctAnswer) {
                    customStyles = "!bg-[#4ADE80] !text-wemodo-navy border-wemodo-navy scale-[1.01] shadow-[4px_4px_0px_0px_rgba(18,14,61,1)] z-10";
                    icon = <CheckCircle2 size={24} className="shrink-0" />;
                  } else if (index === state.selectedOption) {
                    customStyles = "!bg-[#F87171] !text-white border-wemodo-navy opacity-100 shadow-[4px_4px_0px_0px_rgba(18,14,61,1)] z-10";
                    icon = <XCircle size={24} className="shrink-0" />;
                  } else if (state.hasValidated) {
                    customStyles = "opacity-30 grayscale";
                  }
                }

                return (
                  <motion.div 
                    key={index} 
                    onClick={() => handleOptionSelect(index)}
                    whileHover={!state.hasValidated ? { 
                      scale: 1.02, 
                      rotate: 0.5 
                    } : {}}
                    whileTap={!state.hasValidated ? { scale: 0.98 } : {}}
                    className={`brutalist-card-interactive-mobile md:brutalist-card-interactive p-6 text-left font-black text-xl flex items-center justify-between border-4 border-wemodo-navy cursor-pointer ${customStyles}`}
                  >
                    <span className="flex gap-4 items-center">
                      <span className="opacity-40 text-sm">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </span>
                    {icon}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Explanation Overlay */}
      <AnimatePresence>
        {state.hasValidated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-wemodo-navy/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg"
            >
              {(() => {
                const isCorrect = state.selectedOption === currentQuestion.correctAnswer;
                return (
                  <div className={`flex flex-col items-center justify-center p-8 md:p-10 relative overflow-hidden text-wemodo-navy bg-white border-4 border-wemodo-navy shadow-[12px_12px_0px_0px_rgba(18,14,61,1)]`}>
                    {/* Visual accent top */}
                    <div className={`absolute top-0 left-0 right-0 h-4 ${isCorrect ? 'bg-[#4ADE80]' : 'bg-[#FF4D4D]'}`} />
                    
                    <div className="flex flex-col items-center text-center gap-4 max-w-sm mt-2">
                       <div className="text-8xl mb-2 animate-bounce">
                          {isCorrect ? "🎉" : "🧐"}
                       </div>
                       <div className="flex flex-col gap-2">
                          <h3 className={`font-display font-black text-5xl uppercase italic tracking-tighter ${isCorrect ? 'text-[#36ae5f]' : 'text-[#e53e3e]'}`}>
                            {isCorrect ? "Bravo !" : "Dommage..."}
                          </h3>
                          <p className="font-black uppercase text-[10px] tracking-widest opacity-60">
                            {isCorrect ? "C'est une excellente réponse !" : `La réponse était : ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                          </p>
                          
                          <div className={`h-2 w-20 mx-auto ${isCorrect ? 'bg-[#4ADE80]' : 'bg-[#FF4D4D]'}`} />

                          <p className="text-xl font-black leading-[1.2] mt-2">
                             {currentQuestion.explanation}
                          </p>
                       </div>
                       
                       <BrutalistButton 
                        onClick={handleNext}
                        className="mt-4 bg-wemodo-navy text-white px-8 py-5 text-xl flex items-center gap-3 w-full justify-center shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]"
                       >
                         Question suivante <ChevronRight size={28} />
                       </BrutalistButton>
                       <span className="text-sm font-bold opacity-60 uppercase tracking-widest mt-2">Passage automatique dans {timeLeft}s...</span>
                    </div>
                    {/* Timer Bar */}
                    <div className="absolute bottom-0 left-0 h-3 bg-wemodo-navy w-full transform origin-left">
                      <motion.div 
                        className="h-full bg-white"
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 10, ease: "linear" }}
                      />
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
