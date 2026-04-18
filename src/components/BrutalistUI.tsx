import React from "react";
import { motion } from "motion/react";
import wemodoLogo from "../assets/logos/wemodo logo.svg";

interface BrutalistCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({ children, className = "", interactive = false, onClick }) => {
  const baseClass = interactive ? "brutalist-card-interactive" : "brutalist-card";
  return (
    <motion.div
      whileHover={interactive ? { scale: 1.01, transition: { type: "spring", stiffness: 300 } } : {}}
      whileTap={interactive ? { scale: 0.99, transition: { duration: 0.1 } } : {}}
      className={`${baseClass} p-4 md:p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

interface BrutalistButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
}

export const BrutalistButton: React.FC<BrutalistButtonProps> = ({ 
  children, 
  className = "", 
  onClick, 
  variant = "primary",
  disabled = false
}) => {
  const baseClass = variant === "primary" ? "brutalist-button" : "brutalist-button-outline";
  return (
    <motion.button 
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95, rotate: -1 }}
      className={`${baseClass} ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};



export const WemodoLogo = ({ variant = "dark", className = "" }: { variant?: "dark" | "light", className?: string }) => (
  <img 
    src={wemodoLogo} 
    alt="Wemodo Logo" 
    className={`h-6 md:h-8 w-auto ${variant === "light" ? "brightness-0 invert" : ""} ${className}`} 
  />
);

export const BrutalistLoading: React.FC<{ message?: string }> = ({ message = "CHARGEMENT..." }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="w-full bg-white border-4 border-wemodo-navy p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(18,14,61,1)] flex flex-col gap-6 my-4"
  >
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <h3 className="font-display font-black text-2xl md:text-3xl uppercase italic text-wemodo-navy leading-none">
          {message}
        </h3>
      </div>

      <div className="h-10 bg-wemodo-cream border-4 border-wemodo-navy relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-wemodo-yellow border-r-4 border-wemodo-navy"
          initial={{ width: "0%" }}
          animate={{ 
            width: ["0%", "35%", "55%", "75%", "90%", "98%"],
          }}
          transition={{ 
            duration: 15,
            times: [0, 0.1, 0.3, 0.5, 0.8, 1],
            ease: "linear"
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-wemodo-navy text-[10px] tracking-[0.3em] uppercase mix-blend-multiply">
            Veuillez patienter
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);
