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
