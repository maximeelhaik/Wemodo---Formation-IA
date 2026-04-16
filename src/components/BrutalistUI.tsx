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
      whileHover={interactive ? { scale: 1.02, transition: { type: "spring", stiffness: 300 } } : {}}
      whileTap={interactive ? { scale: 0.98, transition: { duration: 0.1 } } : {}}
      className={`${baseClass} p-6 ${className}`}
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
  <div className="flex items-center gap-2 font-display font-black text-4xl tracking-tighter italic text-wemodo-navy">
    Wemodo
  </div>
);
