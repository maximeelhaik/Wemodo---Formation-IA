/**
 * Configuration des plateformes et de la navigation
 */

export type AppId = "quiz" | "hunter" | "hunter2" | "reviewer" | "generator" | "architect" | "training";

export interface AppDefinition {
  id: AppId;
  label: string;
  shortLabel: string;
  color: string;
  urlParam: string;
}

export const ALL_APPS: Record<AppId, AppDefinition> = {
  quiz: {
    id: "quiz",
    label: "QUIZ IA",
    shortLabel: "QUIZ IA",
    color: "bg-wemodo-yellow",
    urlParam: "quiz"
  },
  hunter: {
    id: "hunter",
    label: "CHASSE AUX HALLUCINATIONS",
    shortLabel: "HALLUCINATION",
    color: "bg-wemodo-pink",
    urlParam: "hunter"
  },
  hunter2: {
    id: "hunter2",
    label: "HUNTER ∞",
    shortLabel: "HUNTER ∞",
    color: "bg-wemodo-pink",
    urlParam: "hunter2"
  },
  reviewer: {
    id: "reviewer",
    label: "PROMPT PROF",
    shortLabel: "PROMPT PROF",
    color: "bg-wemodo-yellow",
    urlParam: "reviewer"
  },
  generator: {
    id: "generator",
    label: "MISSION IA",
    shortLabel: "MISSION IA",
    color: "bg-wemodo-purple text-white",
    urlParam: "mission"
  },
  architect: {
    id: "architect",
    label: "ARCHITECTE MJ",
    shortLabel: "MJ PROMPT",
    color: "bg-wemodo-pink",
    urlParam: "architect"
  },
  training: {
    id: "training",
    label: "QUIZ FORMATION",
    shortLabel: "QUIZ FORMATION",
    color: "bg-wemodo-yellow",
    urlParam: "training"
  }
};

// Définition des accès par plateforme
export const PLATFORMS_CONFIG = {
  external: {
    name: "Externe",
    apps: ["quiz", "hunter", "reviewer", "generator"] as AppId[]
  },
  internal: {
    name: "Interne",
    apps: ["training", "hunter", "reviewer", "generator", "architect"] as AppId[]
  }
};

/**
 * Détecte la plateforme actuelle basée sur l'URL ou les variables d'environnement
 */
export const getPlatform = (): "external" | "internal" => {
  // 1. Priorité : Variable d'environnement (déploiements Vercel)
  // On utilise une syntaxe sécurisée pour éviter les erreurs de type
  const envPlatform = (import.meta as any).env?.VITE_PLATFORM;
  
  if (envPlatform === "external" || envPlatform === "internal") {
    // Override via URL même si l'env est là
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const forcedMode = params.get("mode");
      if (forcedMode === "external" || forcedMode === "internal") return forcedMode;
    }
    return envPlatform;
  }

  if (typeof window === "undefined") return "internal";

  const pathname = window.location.pathname;
  const hostname = window.location.hostname;
  
  // 1. Détection via le chemin (ex: mon-app.vercel.app/apprenant)
  // PRIORITÉ : Si on est sur le chemin apprenant, on est en interne
  if (pathname.includes("/apprenant")) {
    return "internal";
  }

  const params = new URLSearchParams(window.location.search);
  const forcedMode = params.get("mode");
  
  // 2. Détection via paramètre URL (?mode=internal)
  if (forcedMode === "external" || forcedMode === "internal") {
    return forcedMode;
  }
  
  // 3. Détection via Hostname spécifique (si besoin)
  if (hostname.includes("votre-domaine-interne")) {
    return "internal";
  }

  // PAR DÉFAUT : On est sur la plateforme externe
  return "external";
};
