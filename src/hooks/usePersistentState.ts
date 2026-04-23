import { useState, useEffect, useRef } from "react";

/**
 * Un hook qui se comporte comme useState mais persiste la valeur dans le localStorage.
 * Parfait pour conserver l'état entre les sessions ou lors de la navigation entre apps.
 * 
 * @param key La clé unique sous laquelle stocker la donnée
 * @param initialValue La valeur par défaut si rien n'est stocké
 */
export function usePersistentState<T>(key: string, initialValue: T) {
  // On utilise une ref pour éviter de déclencher des effets si la clé change (peu probable ici)
  const keyRef = useRef(key);

  // État initial chargé depuis le localStorage
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    
    try {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn(`Erreur lors du chargement de ${key} depuis le localStorage:`, e);
    }
    return initialValue;
  });

  // Sauvegarde automatique lors des changements
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.warn(`Erreur lors de la sauvegarde de ${key} dans le localStorage:`, e);
    }
  }, [key, state]);

  return [state, setState] as const;
}
