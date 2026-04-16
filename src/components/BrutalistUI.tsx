import React from "react";
import { motion } from "motion/react";

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
    <button 
      className={`${baseClass} ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const WemodoLogo = () => (
  <div className="flex items-center gap-2 font-sans font-black text-3xl md:text-5xl tracking-tighter text-wemodo-navy select-none">
    Wemodo
  </div>
);
