import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrutalistCard, BrutalistButton, WemodoLogo } from "../../components/BrutalistUI";
import { Search, Info, CheckCircle2, XCircle, RotateCcw, PartyPopper } from "lucide-react";

type TargetType = "hallucination" | "cliche" | "none";

interface TextSegment {
  text: string;
  type: TargetType;
  explanation?: string;
}

const HUNTER_DATA: TextSegment[] = [
  { text: "Dans le monde moderne, ", type: "none" },
  { text: "l'intelligence artificielle générative ", type: "none" },
  { text: "est devenue ", type: "none" },
  { text: "un sujet incontournable. ", type: "none" },
  { text: "Elle n'est plus ", type: "none" },
  { text: "une simple curiosité technique ", type: "none" },
  { text: "mais ", type: "none" },
  { text: "une véritable révolution", type: "cliche", explanation: "L'expression 'Une véritable révolution' est un cliché d'IA omniprésent et souvent vide de sens. 📣" },
  { text: " qui impacte ", type: "none" },
  { text: "tous les secteurs ", type: "none" },
  { text: "d'activité, ", type: "none" },
  { text: "de la médecine ", type: "none" },
  { text: "à l'industrie lourde. ", type: "none" },
  { text: "Les experts s'accordent ", type: "none" },
  { text: "à dire que ", type: "none" },
  { text: "cette technologie offre ", type: "none" },
  { text: "un potentiel incalculable", type: "cliche", explanation: "Le mot 'incalculable' est un superlatif que l'IA utilise quand elle manque de précision. 📈" },
  { text: " pour résoudre ", type: "none" },
  { text: "les défis les plus ", type: "none" },
  { text: "complexes de notre siècle. ", type: "none" },
  { text: "En effet, l'IA ", type: "none" },
  { text: "ouvre de nouveaux horizons", type: "cliche", explanation: "L'image des 'nouveaux horizons' est une métaphore poétique dont les LLM abusent. 🌅" },
  { text: " pour la recherche scientifique, ", type: "none" },
  { text: "permettant de traiter ", type: "none" },
  { text: "des volumes de données ", type: "none" },
  { text: "massifs en un temps record. ", type: "none" },
  { text: "Sur le plan technique, ", type: "none" },
  { text: "les avancées ", type: "none" },
  { text: "sont vertigineuses. ", type: "none" },
  { text: "Récemment, un laboratoire ", type: "none" },
  { text: "a prétendu avoir ", type: "none" },
  { text: "développé ", type: "none" },
  { text: "un processeur alimenté par l'eau", type: "hallucination", explanation: "Physiquement impossible. Les processeurs consomment de l'énergie, ils n'en génèrent pas. ⚡" },
  { text: ", capable de fonctionner ", type: "none" },
  { text: "sans électricité conventionnelle. ", type: "none" },
  { text: "Cette annonce a surpris ", type: "none" },
  { text: "la communauté, ", type: "none" },
  { text: "tout comme la rumeur ", type: "none" },
  { text: "affirmant que ", type: "none" },
  { text: "GPT-5 aurait atteint ", type: "none" },
  { text: "98% de précision émotionnelle", type: "hallucination", explanation: "Chiffre inventé. La 'précision émotionnelle' n'est pas une mesure technique standard. 🧠" },
  { text: " lors de tests cliniques secrets. ", type: "none" },
  { text: "Ces chiffres sont ", type: "none" },
  { text: "souvent partagés ", type: "none" },
  { text: "sans vérification, ", type: "none" },
  { text: "tout comme le concept ", type: "none" },
  { text: "flou du ", type: "none" },
  { text: "test de Turing quantique", type: "hallucination", explanation: "Expression pseudoscientifique sans fondement réel dans le domaine de l'IA. 🤖" },
  { text: " qui circule sur ", type: "none" },
  { text: "les réseaux sociaux. ", type: "none" },
  { text: "Pourtant, l'IA reste ", type: "none" },
  { text: "au cœur de l'innovation", type: "cliche", explanation: "L'IA se positionne toujours 'au cœur' de tout. Une figure de style automatique. 🎯" },
  { text: " numérique mondiale. ", type: "none" },
  { text: "Socialement, l'impact ", type: "none" },
  { text: "est profond. ", type: "none" },
  { text: "Certains affirment ", type: "none" },
  { text: "que l'IA peut ", type: "none" },
  { text: "façonner l'avenir", type: "cliche", explanation: "Le verbe 'façonner' (shape) est l'un des tics de traduction les plus fréquents des IA. 🛠️" },
  { text: " de l'éducation ", type: "none" },
  { text: "en créant ", type: "none" },
  { text: "une synergie parfaite", type: "cliche", explanation: "Le mot 'synergie' est le cliché corporate par excellence, très apprécié des chatbots. 🤝" },
  { text: " entre l'enseignant ", type: "none" },
  { text: "et la machine. ", type: "none" },
  { text: "C'est ", type: "none" },
  { text: "un témoignage éclatant", type: "cliche", explanation: "L'IA 'témoigne' de façon 'éclatante' dans presque tous ses textes formels. ✨" },
  { text: " de notre capacité ", type: "none" },
  { text: "à intégrer ces outils. ", type: "none" },
  { text: "Toutefois, des ", type: "none" },
  { text: "régulations strictes émergent. ", type: "none" },
  { text: "Selon une fausse ", type: "none" },
  { text: "information virale, ", type: "none" },
  { text: "l'ONU a banni les algorithmes", type: "hallucination", explanation: "Hallucination politique. L'ONU ne bannit pas les algorithmes de cette manière. ⚖️" },
  { text: " de recommandation ", type: "none" },
  { text: "dans toute l'Asie ", type: "none" },
  { text: "pour protéger ", type: "none" },
  { text: "la jeunesse. ", type: "none" },
  { text: "À l'inverse, ", type: "none" },
  { text: "des start-ups promettent ", type: "none" },
  { text: "de ", type: "none" },
  { text: "générer de l'or numérique", type: "hallucination", explanation: "Métaphore trompeuse. Le logiciel ne crée pas de matière précieuse physique. 🪙" },
  { text: " à partir de ", type: "none" },
  { text: "simples lignes de code, ", type: "none" },
  { text: "une promesse qui ", type: "none" },
  { text: "ressemble fort à ", type: "none" },
  { text: "une hallucination économique. ", type: "none" },
  { text: "En fin de compte, ", type: "none" },
  { text: "nous devons ", type: "none" },
  { text: "transformer le paradigme", type: "cliche", explanation: "Le 'paradigme' est le mot favori de l'IA pour paraître intellectuelle et sérieuse. 📚" },
  { text: " actuel. ", type: "none" },
  { text: "L'objectif est de ", type: "none" },
  { text: "libérer la créativité", type: "cliche", explanation: "L'IA promet toujours de 'libérer' (unlock) quelque chose. Un pur cliché marketing. 🔑" },
  { text: " des utilisateurs ", type: "none" },
  { text: "tout en restant ", type: "none" },
  { text: "vigilants face aux dérives. ", type: "none" },
  { text: "Nous naviguons dans ", type: "none" },
  { text: "un paysage en mutation", type: "cliche", explanation: "Le fameux 'landscape' ! L'image de marque indissociable des contenus générés. 🏔️" },
  { text: " où la frontière ", type: "none" },
  { text: "entre le réel ", type: "none" },
  { text: "et le généré devient ", type: "none" },
  { text: "de plus en plus poreuse. ", type: "none" },
  { text: "Il appartient à chacun ", type: "none" },
  { text: "de cultiver ", type: "none" },
  { text: "son esprit critique ", type: "none" },
  { text: "pour ne pas ", type: "none" },
  { text: "se laisser submerger. ", type: "none" }
];

export const HallucinationHunter: React.FC = () => {
  const [foundIds, setFoundIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<TextSegment | null>(null);

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
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-0 md:p-4 bg-wemodo-navy transition-colors duration-500"
      >
        <div className="mb-6">
          <WemodoLogo variant="light" className="h-10 md:h-14" />
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-8xl md:text-9xl mb-4 md:mb-6"
        >
          🕵️✨
        </motion.div>
        
        <div className="max-w-md w-full flex flex-col gap-6 p-8 md:p-10 bg-white text-wemodo-navy md:shadow-[16px_16px_0px_0px_rgba(244,255,126,1)] md:border-4 border-wemodo-navy h-full md:h-auto items-center justify-center">
          <h2 className="font-display font-black text-4xl md:text-5xl uppercase italic tracking-tighter text-center md:text-left">
            Expert dénicheur !
          </h2>
          <p className="text-xl md:text-2xl font-black leading-tight border-b-8 md:border-b-0 md:border-l-8 border-wemodo-navy pb-4 md:pb-0 md:pl-4 md:py-2 text-center md:text-left">
            Tu as débusqué les {totalTargets} pièges du texte ! L'IA ne pourra plus te berner.
          </p>

          <BrutalistButton 
            onClick={resetGame} 
            className="mt-8 md:mt-4 flex items-center justify-center gap-4 bg-wemodo-pink text-wemodo-navy border-wemodo-navy h-16 md:h-20 text-xl md:text-2xl w-full shadow-[4px_4px_0px_0px_rgba(18,14,61,1)] md:shadow-[6px_6px_0px_0px_rgba(18,14,61,1)]"
          >
            <RotateCcw size={32} /> Recommencer
          </BrutalistButton>
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
            Identifie les <span className="text-red-600">points à vérifier</span> et les <span className="text-wemodo-purple">clichés d'IA</span>.
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
        <div className="text-xl md:text-2xl font-bold leading-relaxed text-wemodo-navy">
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
                  rotate: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 0.5,
                  backgroundColor: "rgba(26, 27, 31, 0.1)" 
                } : {}}
                whileTap={!isFound ? { scale: 0.95 } : {}}
                className={`
                  inline-block px-1 cursor-pointer
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
              <div className="bg-wemodo-navy text-white p-2 shrink-0">
                <Info size={24} />
              </div>
              <div className="flex-1">
                <p className="font-black text-wemodo-navy text-lg leading-tight uppercase italic mb-1">
                  {selectedInfo.type === 'hallucination' ? 'À vérifier !' : 'Cliché IA !'}
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
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};
