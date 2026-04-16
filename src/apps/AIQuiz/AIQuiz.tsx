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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="relative"
        >
          <Award size={140} className="text-wemodo-yellow stroke-[4px] fill-wemodo-yellow/20" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-4 border-dashed border-wemodo-purple rounded-full opacity-30"
          />
        </motion.div>
        
        <BrutalistCard className="max-w-md w-full text-center flex flex-col gap-6 p-10 bg-wemodo-purple text-white shadow-[12px_12px_0px_0px_rgba(18,14,61,1)]">
          <h2 className="font-display font-black text-5xl uppercase italic tracking-tighter">Bilan !</h2>
          <div className="flex flex-col gap-3">
            <span className="text-8xl font-black bg-wemodo-yellow text-wemodo-navy py-4 outline-4 outline-wemodo-navy shadow-none">
              {state.score}/{GEN_AI_QUESTIONS.length}
            </span>
            <p className="text-2xl font-bold italic mt-4 leading-tight">{comment}</p>
          </div>
          <BrutalistButton onClick={resetQuiz} className="mt-4 flex items-center justify-center gap-3 bg-white text-wemodo-navy h-16 text-xl">
            <RotateCcw size={24} /> Recommencer
          </BrutalistButton>
        </BrutalistCard>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-8">
      {/* Progress Header */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end px-1">
          <span className="font-display font-black text-2xl italic uppercase tracking-tight">
            Question {state.currentQuestionIndex + 1}
          </span>
          <span className="font-bold text-wemodo-purple bg-wemodo-purple/10 px-3 py-1 border-2 border-wemodo-navy">
             Score: {state.score}
          </span>
        </div>
        <div className="w-full h-8 border-4 border-wemodo-navy bg-white shadow-[4px_4px_0px_0px_rgba(18,14,61,1)] overflow-hidden">
          <motion.div 
            className="h-full bg-wemodo-yellow border-r-4 border-wemodo-navy"
            initial={{ width: 0 }}
            animate={{ width: `${((state.currentQuestionIndex + 1) / GEN_AI_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentQuestionIndex}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="flex flex-col gap-8"
        >
          <BrutalistCard className="bg-wemodo-yellow py-10">
            <h1 className="text-3xl md:text-4xl font-black leading-[1.1] text-wemodo-navy tracking-tight">
              {currentQuestion.text}
            </h1>
          </BrutalistCard>

          <div className="grid grid-cols-1 gap-5">
            {currentQuestion.options.map((option, index) => {
              const isSelected = state.selectedOption === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const isWrongSelection = isSelected && !isCorrect;

              let customStyles = "";
              let icon = null;

              if (state.hasValidated) {
                if (isCorrect) {
                  customStyles = "bg-[#4ADE80] text-wemodo-navy border-wemodo-navy scale-[1.02] shadow-[8px_8px_0px_0px_rgba(18,14,61,1)]";
                  icon = <CheckCircle2 size={32} className="shrink-0" />;
                } else if (isWrongSelection) {
                  customStyles = "bg-[#F87171] text-white border-wemodo-navy opacity-100";
                  icon = <XCircle size={32} className="shrink-0" />;
                } else {
                  customStyles = "opacity-40 grayscale";
                }
              } else if (isSelected) {
                customStyles = "bg-wemodo-purple text-white shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] -translate-x-1 -translate-y-1";
              }

              return (
                <div 
                  key={index} 
                  onClick={() => handleOptionSelect(index)}
                  className={`brutalist-card-interactive p-6 text-left font-black text-xl flex items-center justify-between transition-all duration-200 ${customStyles}`}
                >
                  <span className="flex gap-4">
                    <span className="opacity-40">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </span>
                  {icon}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="min-h-[140px] flex flex-col justify-center gap-4">
        {!state.hasValidated ? (
          <BrutalistButton 
            onClick={handleValidate} 
            disabled={state.selectedOption === null}
            className="w-full text-2xl h-20 shadow-[8px_8px_0px_0px_rgba(18,14,61,1)]"
          >
            Valider <span className="ml-2">👉</span>
          </BrutalistButton>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="flex flex-col gap-6 w-full"
          >
            <BrutalistCard className="bg-wemodo-pink border-4 p-8 relative overflow-hidden">
              <div className="flex items-start gap-4">
                 <div className="bg-wemodo-navy text-white p-2 shrink-0">
                    <Award size={24} />
                 </div>
                 <div className="flex flex-col gap-1">
                    <p className="font-black uppercase text-xs tracking-widest opacity-60">Le saviez-vous ?</p>
                    <p className="text-lg font-bold leading-snug">
                       {currentQuestion.explanation}
                    </p>
                 </div>
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

            <BrutalistButton 
              onClick={handleNext} 
              className="w-full text-2xl flex items-center justify-center gap-4 bg-wemodo-navy text-white h-20"
            >
              Suivant ({timeLeft}s) <ChevronRight size={32} />
            </BrutalistButton>
          </motion.div>
        )}
      </div>
    </div>
  );
};
