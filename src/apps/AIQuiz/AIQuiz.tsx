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
    setState((prev) => ({ ...prev, selectedOption: index }));
  };

  const handleValidate = () => {
    if (state.selectedOption === null || state.hasValidated) return;
    
    const isCorrect = state.selectedOption === currentQuestion.correctAnswer;
    setState((prev) => ({
      ...prev,
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
    if (percentage >= 50) comment = "Pas mal ! Tu as de bonnes bases. 👍";
    if (percentage >= 80) comment = "Excellent ! Tu es un vrai expert de l'IA ! 🚀";
    if (percentage === 100) comment = "INCROYABLE ! Zéro faute, tu es le futur de l'IA ! 🤖👑";

    return (
      <div className="flex flex-col items-center justify-center min-h-full gap-6 p-4 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="relative shrink-0 mb-4"
        >
          <Award size={120} className="text-wemodo-yellow md:w-[160px] md:h-[160px] stroke-[4px] fill-wemodo-yellow/20" />
        </motion.div>
        
        <BrutalistCard className="max-w-md w-full flex flex-col gap-6 md:gap-8 p-8 bg-wemodo-navy text-white shadow-[12px_12px_0px_0px_rgba(107,60,226,1)] border-wemodo-purple">
          <h2 className="font-display font-black text-5xl md:text-6xl uppercase italic tracking-tighter text-white">Bilan !</h2>
          <div className="flex flex-col gap-4">
            <span className="text-7xl md:text-8xl font-black bg-wemodo-yellow text-wemodo-navy py-4 outline-4 outline-wemodo-navy shadow-none">
              {state.score}/{GEN_AI_QUESTIONS.length}
            </span>
            <p className="text-2xl md:text-3xl font-bold italic mt-2 leading-tight text-white">{comment}</p>
          </div>
          <BrutalistButton onClick={resetQuiz} className="mt-4 flex items-center justify-center gap-3 bg-wemodo-pink text-wemodo-navy border-white h-16 md:h-20 text-xl md:text-2xl">
            <RotateCcw size={28} /> Recommencer
          </BrutalistButton>
        </BrutalistCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col min-h-full gap-6 py-2">
      {/* Progress Header */}
      <div className="flex flex-col gap-2 shrink-0 px-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-display font-black text-2xl md:text-3xl italic uppercase tracking-tighter">
            Question {state.currentQuestionIndex + 1}
          </span>
          <span className="font-bold text-wemodo-purple bg-white px-4 py-1 border-2 border-wemodo-navy text-base md:text-lg">
             Score: {state.score}
          </span>
        </div>
        <div className="w-full h-5 md:h-6 border-[3px] border-wemodo-navy bg-white shadow-[4px_4px_0px_0px_rgba(18,14,61,1)] overflow-hidden">
          <motion.div 
            className="h-full bg-wemodo-yellow border-r-[3px] border-wemodo-navy"
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
          className="flex flex-col gap-6"
        >
          <BrutalistCard className="bg-wemodo-yellow p-6 md:p-10 shrink-0">
            <h1 className="text-2xl md:text-4xl font-black leading-[1.1] text-wemodo-navy tracking-tight">
              {currentQuestion.text}
            </h1>
          </BrutalistCard>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = state.selectedOption === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const isWrongSelection = isSelected && !isCorrect;

              let customStyles = "bg-white text-wemodo-navy"; // Default
              let icon = null;

              if (state.hasValidated) {
                if (isCorrect) {
                  customStyles = "!bg-[#4ADE80] !text-wemodo-navy border-wemodo-navy scale-[1.01] shadow-[6px_6px_0px_0px_rgba(18,14,61,1)]";
                  icon = <CheckCircle2 size={32} className="shrink-0" />;
                } else if (isWrongSelection) {
                  customStyles = "!bg-[#F87171] !text-white border-wemodo-navy opacity-100 shadow-[6px_6px_0px_0px_rgba(18,14,61,1)]";
                  icon = <XCircle size={32} className="shrink-0" />;
                } else {
                  customStyles = "opacity-30 grayscale";
                }
              } else if (isSelected) {
                customStyles = "!bg-wemodo-navy !text-white shadow-[8px_8px_0px_0px_rgba(107,60,226,1)] -translate-x-1 -translate-y-1";
              }

              return (
                <div 
                  key={index} 
                  onClick={() => handleOptionSelect(index)}
                  className={`brutalist-card-interactive p-5 md:p-8 text-left font-black text-xl md:text-2xl flex items-center justify-between transition-all duration-200 ${customStyles}`}
                >
                  <span className="flex gap-4 items-center">
                    <span className="opacity-40 text-sm md:text-base">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </span>
                  {icon}
                </div>
              );
            })}
          </div>

          {/* Validation & Next Buttons below the questions */}
          <div className="flex flex-col gap-4 mt-2">
            {!state.hasValidated ? (
              <BrutalistButton 
                onClick={handleValidate} 
                disabled={state.selectedOption === null}
                className="w-full text-2xl md:text-3xl h-16 md:h-24 shadow-[8px_8px_0px_0px_rgba(18,14,61,1)]"
              >
                Valider <span className="ml-2">👉</span>
              </BrutalistButton>
            ) : (
              <BrutalistButton 
                onClick={handleNext} 
                className="w-full text-2xl md:text-3xl flex items-center justify-center gap-4 bg-wemodo-navy text-white h-16 md:h-24 shadow-[8px_8px_0px_0px_rgba(107,60,226,1)]"
              >
                Suivant ({timeLeft}s) <ChevronRight size={32} />
              </BrutalistButton>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Explanation Overlay (separate panel to avoid layout jumping) */}
      <AnimatePresence>
        {state.hasValidated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-wemodo-navy/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="w-full max-w-xl"
            >
              <BrutalistCard className="bg-wemodo-pink border-4 p-8 md:p-12 relative overflow-hidden shadow-[16px_16px_0px_0px_rgba(18,14,61,1)]">
                <div className="flex flex-col items-center text-center gap-6">
                   <div className="bg-wemodo-navy text-white p-4 rounded-full">
                      <Award size={40} md:size={50} />
                   </div>
                   <div className="flex flex-col gap-2">
                      <p className="font-black uppercase text-sm md:text-base tracking-widest text-wemodo-navy opacity-60">Le saviez-vous ?</p>
                      <p className="text-xl md:text-2xl font-black leading-tight text-wemodo-navy">
                         {currentQuestion.explanation}
                      </p>
                   </div>
                   <BrutalistButton 
                    onClick={handleNext}
                    className="mt-4 bg-wemodo-navy text-white px-10 py-4 text-xl"
                   >
                     J'ai compris !
                   </BrutalistButton>
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
              </BrutalistCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
