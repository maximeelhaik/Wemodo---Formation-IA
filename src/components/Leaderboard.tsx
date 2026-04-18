import React from "react";
import { motion } from "motion/react";
import { LeaderboardEntry } from "../types";
import { Trophy, Clock, User } from "lucide-react";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, title = "Classement Local", className = "" }) => {
  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      <div className="flex items-center gap-3 bg-wemodo-yellow p-4 border-4 border-wemodo-navy shadow-[4px_4px_0px_0px_rgba(18,14,61,1)]">
        <Trophy className="text-wemodo-navy" size={24} />
        <h3 className="font-display font-black text-xl md:text-2xl uppercase italic tracking-tighter">
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
        {entries.length === 0 ? (
          <div className="p-8 text-center bg-white border-2 border-dashed border-wemodo-navy/30 font-bold opacity-50">
            Aucun score enregistré pour le moment... Sois le premier ! 🚀
          </div>
        ) : (
          entries.map((entry, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={`${entry.date}-${index}`}
              className={`flex items-center justify-between p-3 border-2 border-wemodo-navy bg-white shadow-[2px_2px_0px_0px_rgba(18,14,61,1)]`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-8 h-8 font-black text-sm border-2 border-wemodo-navy ${
                  index === 0 ? 'bg-wemodo-yellow' : 
                  index === 1 ? 'bg-wemodo-cream' : 
                  index === 2 ? 'bg-wemodo-purple text-white' : 'bg-white'
                }`}>
                  {index + 1}
                </span>
                <div className="flex flex-col">
                  <span className="font-black text-sm uppercase truncate max-w-[120px] md:max-w-none">
                    {entry.username}
                  </span>
                  <span className="text-[10px] opacity-50 font-bold flex items-center gap-1">
                    <Clock size={10} /> {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="font-black text-xl italic tracking-tighter text-wemodo-purple leading-none">
                    {entry.score}<span className="text-xs not-italic opacity-30 ml-0.5">/{entry.total}</span>
                  </span>
                  <div className="w-16 h-1 bg-wemodo-navy/10 mt-1">
                    <div 
                      className="h-full bg-wemodo-yellow" 
                      style={{ width: `${(entry.score / entry.total) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
