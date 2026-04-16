import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GEN_AI_QUESTIONS } from "../../constants";
import { QuizState } from "../../types";
import { BrutalistCard, BrutalistButton } from "../../components/BrutalistUI";
import { ChevronRight, RotateCcw, Award, CheckCircle2, XCircle, Timer } from "lucide-react";

export const AIQuiz = () => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    isFinished: false,
    selectedOption: null,
    hasValidated: false,
  });

  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = GEN_AI_QUESTIONS[state.currentQuestionIndex];

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

  const handleOptionSelect = (index: number) => {
    if (state.hasValidated) return;
    
    const isCorrect = index === currentQuestion.correctAnswer;
    setState((prev) => ({ 
      ...prev, 
      selectedOption: index,
      hasValidated: true,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const isLastQuestion = state.currentQuestionIndex === GEN_AI_QUESTIONS.length - 1;
    if (isLastQuestion) {
      setState((prev) => ({ ...prev, isFinished: true }));
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
  };

  if (state.isFinished) {
    const percentage = (state.score / GEN_AI_QUESTIONS.length) * 100;
    
    let comment = "Ouch ! Il va falloir réviser un peu... 😅";
    let emoji = "😱";
    let bgColor = "bg-[#FF4D4D]"; // Red for low score

    if (percentage >= 50) {
      comment = "Pas mal ! Tu as de bonnes bases. 👍";
      emoji = "😎";
      bgColor = "bg-wemodo-pink";
    }
    if (percentage >= 80) {
      comment = "Excellent ! Tu es un vrai expert ! 🚀";
      emoji = "🔥";
      bgColor = "bg-wemodo-purple";
    }
    if (percentage === 100) {
      comment = "INCROYABLE ! Zéro faute, tu es un génie ! 🤖👑";
      emoji = "👑";
      bgColor = "bg-[#4ADE80]"; // Green for perfect score
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 ${bgColor} transition-colors duration-500`}
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="text-9xl md:text-[12rem] mb-6 drop-shadow-[8px_8px_0_rgba(18,14,61,1)]"
        >
          {emoji}
        </motion.div>
        
        <BrutalistCard className="max-w-md w-full flex flex-col gap-6 md:gap-8 p-10 bg-white text-wemodo-navy shadow-[16px_16px_0px_0px_rgba(18,14,61,1)] border-4 border-wemodo-navy">
          <div className="flex flex-col gap-2 scale-110">
            <h2 className="font-display font-black text-5xl md:text-6xl uppercase italic tracking-tighter">
              Bilan !
            </h2>
            <div className="h-2 w-24 bg-wemodo-navy mb-4" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative">
              <span className="block text-8xl md:text-9xl font-black italic tracking-tighter leading-none">
                {state.score}
                <span className="text-4xl md:text-5xl opacity-30 not-italic ml-2">/ {GEN_AI_QUESTIONS.length}</span>
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-black leading-tight border-l-8 border-wemodo-navy pl-4 py-2">
              {comment}
            </p>
          </div>

          <BrutalistButton 
            onClick={resetQuiz} 
            className="mt-4 flex items-center justify-center gap-4 bg-wemodo-navy text-white hover:bg-wemodo-purple border-wemodo-navy h-16 md:h-20 text-2xl md:text-3xl shadow-[6px_6px_0px_0px_rgba(244,255,126,1)]"
          >
            <RotateCcw size={32} /> Recommencer
          </BrutalistButton>
        </BrutalistCard>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 font-black uppercase tracking-widest text-wemodo-navy text-sm md:text-base bg-white px-4 py-2 border-2 border-wemodo-navy shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]"
        >
          Prêt pour un nouveau défi ?
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col min-h-full gap-5 py-1">
      {/* Progress Header */}
      <div className="flex flex-col gap-1.5 shrink-0 px-1">
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-display font-black text-xl md:text-2xl italic uppercase tracking-tighter">
            Question {state.currentQuestionIndex + 1}
          </span>
          <span className="font-bold text-wemodo-purple bg-white px-3 py-0.5 border-2 border-wemodo-navy text-sm md:text-base">
             Score: {state.score}
          </span>
        </div>
        <div className="w-full h-4 md:h-5 border-[2px] border-wemodo-navy bg-white shadow-[3px_3px_0px_0px_rgba(18,14,61,1)] overflow-hidden">
          <motion.div 
            className="h-full bg-wemodo-yellow border-r-[2px] border-wemodo-navy"
            initial={{ width: 0 }}
            animate={{ width: `${((state.currentQuestionIndex + 1) / GEN_AI_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentQuestionIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="flex flex-col gap-5"
        >
          <BrutalistCard className="bg-wemodo-yellow p-5 md:p-8 shrink-0">
            <h1 className="text-xl md:text-3xl font-black leading-[1.1] text-wemodo-navy tracking-tight">
              {currentQuestion.text}
            </h1>
          </BrutalistCard>

          <div className="grid grid-cols-1 gap-3.5">
            {currentQuestion.options.map((option, index) => {
              const isSelected = state.selectedOption === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const isWrongSelection = isSelected && !isCorrect;

              let customStyles = "bg-white text-wemodo-navy"; // Default
              let icon = null;

              if (state.hasValidated) {
                if (isCorrect) {
                  customStyles = "!bg-[#4ADE80] !text-wemodo-navy border-wemodo-navy scale-[1.01] shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]";
                  icon = <CheckCircle2 size={24} className="shrink-0" />;
                } else if (isWrongSelection) {
                  customStyles = "!bg-[#F87171] !text-white border-wemodo-navy opacity-100 shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]";
                  icon = <XCircle size={24} className="shrink-0" />;
                } else {
                  customStyles = "opacity-30 grayscale";
                }
              }

              return (
                <div 
                  key={index} 
                  onClick={() => handleOptionSelect(index)}
                  className={`brutalist-card-interactive p-4 md:p-6 text-left font-black text-lg md:text-xl flex items-center justify-between transition-all duration-200 ${customStyles}`}
                >
                  <span className="flex gap-3 items-center">
                    <span className="opacity-40 text-xs md:text-sm">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </span>
                  {icon}
                </div>
              );
            })}
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-wemodo-navy/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="w-full max-w-lg"
            >
              {(() => {
                const isCorrect = state.selectedOption === currentQuestion.correctAnswer;
                return (
                  <BrutalistCard className={`${isCorrect ? 'bg-[#4ADE80]' : 'bg-[#FF4D4D]'} border-4 p-8 md:p-10 relative overflow-hidden shadow-[12px_12px_0px_0px_rgba(18,14,61,1)] text-wemodo-navy`}>
                    <div className="flex flex-col items-center text-center gap-5">
                       <div className="text-7xl md:text-8xl mb-2 animate-bounce">
                          {isCorrect ? "🎉" : "🧐"}
                       </div>
                       <div className="flex flex-col gap-2">
                          <h3 className="font-display font-black text-3xl md:text-4xl uppercase italic tracking-tighter">
                            {isCorrect ? "Bravo !" : "Dommage !"}
                          </h3>
                          <p className="font-black uppercase text-xs md:text-sm tracking-widest opacity-70">
                            {isCorrect ? "C'était bien la bonne réponse !" : `La réponse était : ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                          </p>
                          <div className="h-0.5 bg-wemodo-navy/20 w-full my-2" />
                          <p className="text-lg md:text-xl font-black leading-tight">
                             {currentQuestion.explanation}
                          </p>
                       </div>
                       <BrutalistButton 
                        onClick={handleNext}
                        className="mt-2 bg-wemodo-navy text-white px-8 py-3 text-lg md:text-xl flex items-center gap-3"
                       >
                         Question suivante <ChevronRight size={24} />
                       </BrutalistButton>
                       <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Passage automatique dans {timeLeft}s...</span>
                    </div>
                    {/* Timer Bar */}
                    <div className="absolute bottom-0 left-0 h-2 bg-wemodo-navy w-full transform origin-left">
                      <motion.div 
                        className="h-full bg-white"
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 10, ease: "linear" }}
                      />
                    </div>
                  </BrutalistCard>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
