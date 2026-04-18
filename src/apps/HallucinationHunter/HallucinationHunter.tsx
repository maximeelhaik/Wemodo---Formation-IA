import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrutalistCard, BrutalistButton, WemodoLogo } from "../../components/BrutalistUI";
import { Search, Info, RotateCcw, Award } from "lucide-react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { Leaderboard } from "../../components/Leaderboard";

type TargetType = "hallucination" | "cliche" | "none";

interface TextSegment {
  text: string;
  type: TargetType;
  explanation?: string;
}

// V2 — Email de consultant rédigé par IA
// Hallucinations : stats crédibles mais inventées, fausses citations, acquisitions bidonnées
// Clichés : formules LinkedIn, transitions automatiques, buzzwords vides
const HUNTER_DATA: TextSegment[] = [
  { text: "Chers collègues,\n\n", type: "none" },
  { text: "Je souhaitais ", type: "none" },
  { text: "prendre un moment pour vous partager ", type: "cliche", explanation: "\"Prendre un moment pour partager\" est l'ouverture n°1 des emails professionnels générés par IA. Elle simule une attention humaine tout en évitant d'aller droit au but. ✉️" },
  { text: "quelques réflexions suite à notre dernier comité. ", type: "none" },
  { text: "L'IA générative représente ", type: "none" },
  { text: "un tournant décisif ", type: "cliche", explanation: "\"Tournant décisif\" (ou \"moment charnière\") est l'une des 10 expressions les plus produites par les LLM en contexte professionnel. Elle dramatise sans informer. 🔄" },
  { text: "pour nos organisations. ", type: "none" },
  { text: "Selon une étude récente de McKinsey, ", type: "none" },
  { text: "73 % des dirigeants européens ", type: "hallucination", explanation: "Ce chiffre précis n'existe pas dans les rapports McKinsey publiés. Les LLM hallucinent souvent des statistiques crédibles avec des décimales — c'est le type d'hallucination le plus dangereux car le plus difficile à détecter. 📊" },
  { text: "considèrent l'IA comme priorité absolue pour 2025. ", type: "none" },
  { text: "Ce constat nous invite à ", type: "none" },
  { text: "repenser de fond en comble ", type: "cliche", explanation: "\"Repenser de fond en comble\" est une formule d'appel à l'action vague très utilisée par les IA pour introduire un changement sans en décrire le contenu réel. Elle sonne décisive mais ne dit rien. 🏗️" },
  { text: "notre approche du numérique. ", type: "none" },
  { text: "Il convient de noter que ", type: "cliche", explanation: "\"Il convient de noter\" est une balise rhétorique automatique des LLM pour simuler une voix académique. Souvent inutile — tout ce qu'il \"convient de noter\" pourrait simplement être dit directement. 📝" },
  { text: "les modèles de langage actuels ont été entraînés sur ", type: "none" },
  { text: "plus de 8 000 milliards de tokens, ", type: "hallucination", explanation: "Chiffre inventé. Les données d'entraînement de GPT-4 ne sont pas publiques — OpenAI n'a divulgué aucun chiffre officiel. Les LLM confondent souvent paramètres, données et tokens pour paraître précis. 🤖" },
  { text: "contre seulement 300 milliards pour les modèles de 2020. ", type: "none" },
  { text: "Dans cette optique, ", type: "cliche", explanation: "\"Dans cette optique\" est l'une des transitions automatiques préférées des LLM — elle semble logique mais relie souvent deux idées sans lien réel. Cherchez la transition, vous trouverez souvent le vide. 🔗" },
  { text: "notre équipe s'est appuyée sur ", type: "none" },
  { text: "le rapport Altman-LeCun de mars 2024, ", type: "hallucination", explanation: "Ce rapport n'existe pas. Sam Altman et Yann LeCun sont des personnalités réelles mais en désaccord public permanent — ils n'ont jamais co-signé un rapport. Les LLM associent des noms réels pour créer une autorité fictive. ⚠️" },
  { text: "qui préconisait une gouvernance hybride de l'IA. ", type: "none" },
  { text: "Force est de constater que ", type: "cliche", explanation: "\"Force est de constater\" est une formule quasi-systématique dans les textes formels générés par IA. Elle donne une impression de rigueur sans apporter de preuve — c'est du faux académisme. 🎓" },
  { text: "les biais algorithmiques restent un défi majeur. ", type: "none" },
  { text: "Une étude publiée dans Nature Machine Intelligence ", type: "none" },
  { text: "a montré que GPT-4 produit des réponses biaisées dans 34 % des cas ", type: "hallucination", explanation: "Ce chiffre précis n'existe pas dans ce journal. Aucune étude avec ce taux n'a été publiée dans Nature MI. Les LLM inventent facilement des sources scientifiques — vérifiez toujours le DOI ou l'abstract. 🔬" },
  { text: "impliquant des profils minoritaires. ", type: "none" },
  { text: "C'est précisément là que réside l'enjeu fondamental ", type: "cliche", explanation: "\"C'est précisément là que réside l'enjeu\" est une formule dramatique très appréciée des LLM pour conclure un paragraphe. Elle sonne profond mais ne dit rien d'actionnable. 🎭" },
  { text: "de notre stratégie de déploiement. ", type: "none" },
  { text: "Nous devons donc adopter ", type: "none" },
  { text: "une approche holistique ", type: "cliche", explanation: "\"Holistique\" est le cliché roi des LLM en contexte business — il signifie \"on prend tout en compte\" sans préciser quoi ni comment. Présent dans 1 email sur 3 généré par ChatGPT. 🌐" },
  { text: "qui intègre les enjeux éthiques, techniques et organisationnels. ", type: "none" },
  { text: "Par ailleurs, Meta AI a finalisé en janvier 2025 ", type: "none" },
  { text: "le rachat de Mistral AI pour 4,2 milliards d'euros. ", type: "hallucination", explanation: "Cette acquisition n'a pas eu lieu. Mistral AI est une société indépendante française. Les LLM inventent des opérations financières entre acteurs tech réels — toujours vérifier sur des sources primaires récentes. 🏢" },
  { text: "Cette consolidation reflète la pression croissante sur les start-ups européennes. ", type: "none" },
  { text: "En somme, ", type: "cliche", explanation: "\"En somme\" est l'une des transitions de clôture les plus automatiques des LLM — avec \"En conclusion\" et \"En définitive\". Elle apparaît même quand il n'y a rien à résumer. 📦" },
  { text: "je reste convaincu que ", type: "none" },
  { text: "nous avons toutes les cartes en main ", type: "cliche", explanation: "\"Avoir toutes les cartes en main\" est une métaphore narrative typique des LLM en fin de mémo — elle exprime un optimisme générique sans aucune preuve concrète. 🃏" },
  { text: "pour réussir cette transition. ", type: "none" },
  { text: "N'hésitez pas à revenir vers moi pour tout ", type: "none" },
  { text: "échange constructif.\n\n", type: "cliche", explanation: "\"Échange constructif\" est le closing par excellence des emails écrits par IA — présent dans presque tous les mails de consultants ou RH rédigés par un LLM. Il garantit l'absence totale d'engagement concret. ✉️" },
  { text: "Cordialement,\n", type: "none" },
  { text: "L'IA du département stratégie\n\n", type: "none" },
  { text: "P.S. : Lors du sommet de Davos 2024, ", type: "none" },
  { text: "António Guterres aurait déclaré ", type: "none" },
  { text: "que \"l'IA détruira 40 % des emplois d'ici 2027 en Europe\".", type: "hallucination", explanation: "Guterres n'a jamais dit cela dans ce format précis. C'est une déformation d'un rapport de l'OIT sur les risques d'automatisation. Les LLM fabriquent de fausses citations de personnes réelles — l'un des patterns les plus trompeurs. 🗣️" },
];

export const HallucinationHunter: React.FC = () => {
  const [foundIds, setFoundIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<TextSegment | null>(null);
  const [username, setUsername] = useState("");
  const [hasSaved, setHasSaved] = useState(false);

  const { saveScore, getAppLeaderboard } = useLeaderboard();
  const appId = "hallucination-hunter";

  const targets = useMemo(() => HUNTER_DATA.filter(s => s.type !== "none"), []);
  const totalTargets = targets.length;

  const handleSegmentClick = (index: number, segment: TextSegment) => {
    if (isFinished) return;
    if (segment.type !== "none") {
      if (!foundIds.includes(index)) {
        setFoundIds(prev => {
          const next = [...prev, index];
          if (next.length === totalTargets) setIsFinished(true);
          return next;
        });
        setSelectedInfo(segment);
      }
    } else {
      setErrors(prev => [...prev, index]);
      setTimeout(() => setErrors(prev => prev.filter(id => id !== index)), 1000);
    }
  };

  const resetGame = () => {
    setFoundIds([]);
    setErrors([]);
    setIsFinished(false);
    setSelectedInfo(null);
    setHasSaved(false);
  };

  const handleSaveScore = () => {
    if (!username.trim()) return;
    saveScore({
      username: username.trim(),
      score: totalTargets - errors.length > 0 ? totalTargets - errors.length : 0, // Score penalized by errors
      total: totalTargets,
      appId
    });
    setHasSaved(true);
  };

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-start overflow-y-auto p-4 md:p-10 bg-wemodo-navy transition-colors duration-500"
      >
        <div className="mb-6 shrink-0">
          <WemodoLogo variant="light" className="h-10 md:h-14" />
        </div>

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-6 p-8 md:p-10 bg-white text-wemodo-navy md:shadow-[16px_16px_0px_0px_rgba(244,255,126,1)] md:border-4 border-wemodo-navy items-center md:items-start"
          >
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase italic tracking-tighter text-center md:text-left leading-none">
              Expert dénicheur !
            </h2>
            <p className="text-xl md:text-2xl font-black leading-tight border-b-8 md:border-b-0 md:border-l-8 border-wemodo-navy pb-4 md:pb-0 md:pl-4 md:py-2 text-center md:text-left">
              Tu as débusqué les {totalTargets} pièges du texte ! L'IA ne pourra plus te berner.
            </p>

            {/* Persistence Form */}
            {!hasSaved ? (
              <div className="w-full flex flex-col gap-3 mt-4 bg-wemodo-cream/50 p-4 border-2 border-wemodo-navy border-dashed">
                <p className="font-black text-xs uppercase tracking-widest text-wemodo-navy/60 text-center md:text-left">
                  Enregistre ton pseudo ?
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ton pseudo..."
                    className="flex-1 px-4 py-2 border-2 border-wemodo-navy font-bold focus:outline-none focus:ring-2 focus:ring-wemodo-purple"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveScore()}
                  />
                  <button
                    onClick={handleSaveScore}
                    disabled={!username.trim()}
                    className="bg-wemodo-navy text-white px-4 py-2 font-black uppercase text-xs border-2 border-wemodo-navy hover:bg-wemodo-purple disabled:opacity-50 transition-colors"
                  >
                    OK
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full py-4 px-6 bg-wemodo-yellow border-4 border-wemodo-navy flex items-center gap-3">
                <Award size={24} className="animate-bounce text-wemodo-navy" />
                <span className="font-black uppercase italic tracking-tighter text-lg text-wemodo-navy">Score enregistré !</span>
              </div>
            )}

            <BrutalistButton
              onClick={resetGame}
              className="mt-4 flex items-center justify-center gap-4 bg-wemodo-pink text-wemodo-navy border-wemodo-navy h-14 md:h-16 text-xl w-full shadow-[4px_4px_0px_0px_rgba(18,14,61,1)] md:shadow-[6px_6px_0px_0px_rgba(18,14,61,1)]"
            >
              <RotateCcw size={24} /> Recommencer
            </BrutalistButton>
          </motion.div>

          {/* Leaderboard Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Leaderboard entries={getAppLeaderboard(appId)} title="Chasseurs Élite" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto h-full p-0 md:p-2 bg-white md:bg-transparent">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-wemodo-cream md:bg-white border-b-4 md:border-4 border-wemodo-navy p-4 md:shadow-[8px_8px_0px_0px_rgba(18,14,61,1)]">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl italic uppercase tracking-tighter text-wemodo-navy flex items-center gap-3">
            <Search className="text-wemodo-purple" /> Hallucination Hunter
          </h1>
          <p className="font-bold text-wemodo-navy/60 text-xs md:text-sm">
            Un email de consultant. Trouve les <span className="text-red-600">hallucinations</span> et les <span className="text-wemodo-purple">clichés IA</span>.
          </p>
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0">
          <span className="text-3xl md:text-4xl font-black italic text-wemodo-purple">
            {foundIds.length} <span className="text-lg not-italic text-wemodo-navy/30">/ {totalTargets}</span>
          </span>
          <div className="w-32 h-2.5 md:h-3 bg-wemodo-navy/10 border-2 border-wemodo-navy mt-1">
            <motion.div
              className="h-full bg-wemodo-yellow"
              animate={{ width: `${(foundIds.length / totalTargets) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Text Area */}
      <div className="flex-1 bg-white p-6 md:p-10 md:border-4 border-wemodo-navy md:shadow-[12px_12px_0px_0px_rgba(18,14,61,1)] relative overflow-y-auto">
        <div className="text-xl md:text-2xl font-bold leading-relaxed text-wemodo-navy whitespace-pre-wrap">
          {HUNTER_DATA.map((segment, idx) => {
            const isFound = foundIds.includes(idx);
            const isError = errors.includes(idx);

            return (
              <motion.span
                key={idx}
                onClick={() => handleSegmentClick(idx, segment)}
                animate={isFound ? {
                  backgroundColor: segment.type === 'hallucination' ? '#EF4444' : '#6634D9',
                  color: '#FFFFFF',
                  scale: 0.95,
                  opacity: 0.5,
                } : {
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  scale: 1,
                  opacity: 1,
                }}
                whileHover={!isFound ? {
                  scale: 1.05,
                  backgroundColor: "rgba(26, 27, 31, 0.1)"
                } : {}}
                whileTap={!isFound ? { scale: 0.95 } : {}}
                className={`
                  inline px-1 cursor-pointer
                  ${isError ? 'bg-red-200 animate-shake' : ''}
                `}
              >
                {segment.text}
              </motion.span>
            );
          })}
        </div>
      </div>

      {/* Explanation Tooltip */}
      <AnimatePresence mode="wait">
        {selectedInfo && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl"
          >
            <BrutalistCard className="bg-wemodo-yellow p-4 border-4 border-wemodo-navy shadow-[8px_8px_0_rgba(18,14,61,1)] flex items-start gap-4">
              <div className={`p-2 shrink-0 ${selectedInfo.type === 'hallucination' ? 'bg-red-600' : 'bg-wemodo-purple'} text-white`}>
                <Search size={24} />
              </div>
              <div className="flex-1">
                <p className="font-black text-wemodo-navy text-lg leading-tight uppercase italic mb-1">
                  {selectedInfo.type === 'hallucination' ? '🚨 Hallucination !' : '🎭 Cliché IA !'}
                </p>
                <p className="font-bold text-wemodo-navy leading-tight">
                  {selectedInfo.explanation}
                </p>
              </div>
            </BrutalistCard>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { left: 0; }
          25% { left: -4px; }
          75% { left: 4px; }
        }
        .animate-shake {
          position: relative;
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};
