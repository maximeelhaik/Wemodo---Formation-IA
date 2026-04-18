import { useState, useEffect } from "react";
import { LeaderboardEntry } from "../types";

const STORAGE_KEY = "wemodo-ia-lab-leaderboard";

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Load local backup first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLeaderboard(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local leaderboard", e);
      }
    }

    // Try to fetch global scores
    fetch("/api/scores")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("API not available");
      })
      .then((data) => {
        setLeaderboard(data);
        // Sync local storage with global data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      })
      .catch((err) => {
        console.warn("Using local leaderboard only:", err.message);
      });
  }, []);

  const saveScore = async (entry: Omit<LeaderboardEntry, "date">) => {
    const newEntry: LeaderboardEntry = {
      ...entry,
      date: new Date().toISOString(),
    };

    // 1. Update state immediately for UI responsiveness
    const updated = [newEntry, ...leaderboard]
      .sort((a, b) => {
        const scoreDiff = (b.score / b.total) - (a.score / a.total);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 50);

    setLeaderboard(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 2. Try to save to KV via API
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        const globalData = await res.json();
        setLeaderboard(globalData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(globalData));
      }
    } catch (err) {
      console.error("Failed to save global score:", err);
    }
  };

  const getAppLeaderboard = (appId: string) => {
    return leaderboard.filter((e) => e.appId === appId);
  };

  return { leaderboard, saveScore, getAppLeaderboard };
};
