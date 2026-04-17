import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GEN_AI_QUESTIONS, GEN_AI_QUESTIONS_L2 } from "../../constants";
import { QuizState, Question } from "../../types";
import { BrutalistCard, BrutalistButton, WemodoLogo } from "../../components/BrutalistUI";
import { ChevronRight, RotateCcw, Award, CheckCircle2, XCircle, Timer } from "lucide-react";

interface AIQuizProps {
  questions: Question[];
}

export const AIQuiz: React.FC<AIQuizProps> = ({ questions }) => {
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
    const isLastQuestion = state.currentQuestionIndex === questions.length - 1;
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
    const percentage = (state.score / questions.length) * 100;
    
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
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-0 md:p-4 ${bgColor} transition-colors duration-500`}
      >
        <div className="mb-6">
          <WemodoLogo variant="light" className="h-10 md:h-14" />
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="text-8xl md:text-[12rem] mb-4 md:mb-6 drop-shadow-[6px_6px_0_rgba(18,14,61,1)] md:drop-shadow-[8px_8px_0_rgba(18,14,61,1)]"
        >
          {emoji}
        </motion.div>
        
        <div className="max-w-md w-full flex flex-col gap-6 md:gap-8 p-8 md:p-10 bg-white text-wemodo-navy md:shadow-[16px_16px_0px_0px_rgba(18,14,61,1)] md:border-4 border-wemodo-navy h-full md:h-auto items-center justify-center md:block">
          <div className="flex flex-col gap-2 md:scale-110 mb-6 md:mb-0">
            <h2 className="font-display font-black text-5xl md:text-6xl uppercase italic tracking-tighter text-center md:text-left">
              Bilan !
            </h2>
            <div className="h-2 w-24 bg-wemodo-navy mb-4 mx-auto md:mx-0" />
          </div>

          <div className="flex flex-col gap-6 md:gap-4 items-center md:items-start text-center md:text-left">
            <div className="relative">
              <span className="block text-8xl md:text-9xl font-black italic tracking-tighter leading-none">
                {state.score}
                <span className="text-4xl md:text-5xl opacity-30 not-italic ml-2">/ {questions.length}</span>
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-black leading-tight border-b-8 md:border-b-0 md:border-l-8 border-wemodo-navy pb-4 md:pb-0 md:pl-4 md:py-2">
              {comment}
            </p>
          </div>

          <BrutalistButton 
            onClick={resetQuiz} 
            className="mt-8 md:mt-4 flex items-center justify-center gap-4 bg-wemodo-navy text-white hover:bg-wemodo-purple border-wemodo-navy h-16 md:h-20 text-2xl md:text-3xl w-full shadow-[4px_4px_0px_0px_rgba(18,14,61,1)] md:shadow-[6px_6px_0px_0px_rgba(244,255,126,1)]"
          >
            <RotateCcw size={32} /> Recommencer
          </BrutalistButton>
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="hidden md:block mt-8 font-black uppercase tracking-widest text-wemodo-navy text-sm md:text-base bg-white px-4 py-2 border-2 border-wemodo-navy shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]"
        >
          Prêt pour un nouveau défi ?
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-full md:min-h-full gap-0 md:gap-5 py-0 md:py-1 bg-white md:bg-transparent">
      {/* Progress Header */}
      <div className="flex flex-col gap-1.5 shrink-0 px-4 md:px-1 py-4 md:py-0 bg-wemodo-cream md:bg-transparent border-b-4 md:border-b-0 border-wemodo-navy">
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-display font-black text-xl md:text-2xl italic uppercase tracking-tighter">
            Question {state.currentQuestionIndex + 1}
          </span>
          <span className="font-bold text-wemodo-purple bg-white px-3 py-0.5 border-2 border-wemodo-navy text-sm md:text-base shadow-[2px_2px_0px_0px_rgba(18,14,61,1)] md:shadow-none">
             Score: {state.score} / {questions.length}
          </span>
        </div>
        <div className="w-full h-3 md:h-5 border-2 border-wemodo-navy bg-white shadow-[2px_2px_0px_0px_rgba(18,14,61,1)] md:shadow-[3px_3px_0px_0px_rgba(18,14,61,1)] overflow-hidden">
          <motion.div 
            className="h-full bg-wemodo-yellow border-r-2 border-wemodo-navy"
            initial={{ width: 0 }}
            animate={{ width: `${((state.currentQuestionIndex + 1) / questions.length) * 100}%` }}
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
          <div className="bg-wemodo-yellow p-6 md:p-8 md:border-4 border-b-4 border-wemodo-navy md:shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] shrink-0">
            <h1 className="text-2xl md:text-3xl font-black leading-[1.1] text-wemodo-navy tracking-tight">
              {currentQuestion.text}
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
            <div className="grid grid-cols-1 gap-4 md:gap-5">
              {currentQuestion.options.map((option, index) => {
                const isSelected = state.selectedOption === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const isWrongSelection = isSelected && !isCorrect;

                let customStyles = "bg-white text-wemodo-navy"; // Default
                let icon = null;

                if (state.hasValidated) {
                  if (isCorrect) {
                    customStyles = "!bg-[#4ADE80] !text-wemodo-navy border-wemodo-navy scale-[1.01] shadow-[4px_4px_0px_0px_rgba(18,14,61,1)] z-10";
                    icon = <CheckCircle2 size={24} className="shrink-0" />;
                  } else if (isWrongSelection) {
                    customStyles = "!bg-[#F87171] !text-white border-wemodo-navy opacity-100 shadow-[4px_4px_0px_0px_rgba(18,14,61,1)] z-10";
                    icon = <XCircle size={24} className="shrink-0" />;
                  } else {
                    customStyles = "opacity-30 grayscale";
                  }
                }

                return (
                  <motion.div 
                    key={index} 
                    onClick={() => handleOptionSelect(index)}
                    whileHover={!state.hasValidated ? { 
                      scale: 1.02, 
                      rotate: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 0.5 
                    } : {}}
                    whileTap={!state.hasValidated ? { scale: 0.98 } : {}}
                    className={`brutalist-card-interactive-mobile md:brutalist-card-interactive p-6 md:p-6 text-left font-black text-xl md:text-xl flex items-center justify-between border-4 border-wemodo-navy ${customStyles}`}
                  >
                    <span className="flex gap-4 items-center">
                      <span className="opacity-40 text-xs md:text-sm">{String.fromCharCode(65 + index)}.</span>
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
            className="fixed inset-0 z-[100] flex items-center justify-center md:p-4 bg-wemodo-navy/95 md:bg-wemodo-navy/80 md:backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full md:h-auto md:max-w-lg"
            >
              {(() => {
                const isCorrect = state.selectedOption === currentQuestion.correctAnswer;
                return (
                  <div className={`h-full flex flex-col items-center justify-center p-8 md:p-10 relative overflow-hidden text-wemodo-navy ${isCorrect ? 'bg-[#4ADE80]' : 'bg-[#FF4D4D]'} md:border-4 md:shadow-[12px_12px_0px_0px_rgba(18,14,61,1)]`}>
                    <div className="flex flex-col items-center text-center gap-6 max-w-sm">
                       <div className="text-8xl md:text-8xl mb-2 animate-bounce">
                          {isCorrect ? "🎉" : "🧐"}
                       </div>
                       <div className="flex flex-col gap-3">
                          <h3 className="font-display font-black text-4xl md:text-4xl uppercase italic tracking-tighter">
                            {isCorrect ? "Bravo !" : "Dommage !"}
                          </h3>
                          <p className="font-black uppercase text-sm md:text-sm tracking-widest opacity-80">
                            {isCorrect ? "C'était la bonne réponse !" : `La réponse était : ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                          </p>
                          <div className="h-0.5 bg-wemodo-navy/20 w-full my-2" />
                          <p className="text-xl md:text-xl font-black leading-[1.2]">
                             {currentQuestion.explanation}
                          </p>
                       </div>
                       <BrutalistButton 
                        onClick={handleNext}
                        className="mt-4 bg-wemodo-navy text-white px-8 py-5 text-xl flex items-center gap-3 w-full justify-center shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] md:shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]"
                       >
                         Suivant <ChevronRight size={28} />
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
