import { Question } from "./types";

export const GEN_AI_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "ChatGPT a été créé par quelle entreprise ?",
    options: [
      "Microsoft",
      "OpenAI",
      "Google",
      "Apple"
    ],
    correctAnswer: 1,
    explanation: "C'est bien OpenAI ! Fondée en 2015, l'entreprise a révolutionné le monde avec ChatGPT fin 2022. 🚀"
  },
  {
    id: 2,
    text: "Quel emoji représente le mieux l'IA dans nos conversations ?",
    options: [
      "🤖",
      "👽",
      "👻",
      "🧠"
    ],
    correctAnswer: 0,
    explanation: "Le petit robot est devenu l'icône universelle de l'intelligence artificielle ! 🤖"
  },
  {
    id: 3,
    text: "Vrai ou Faux : L'IA a des sentiments comme la joie ou la tristesse.",
    options: [
      "Vrai, elle est sensible",
      "Faux, c'est un programme informatique"
    ],
    correctAnswer: 1,
    explanation: "Même si elle est très polie, l'IA ne ressent rien. Ce n'est qu'un calcul mathématique très complexe ! 🧮"
  },
  {
    id: 4,
    text: "Si je veux créer une image d'un chat astronaute, quel outil j'utilise ?",
    options: [
      "Excel",
      "Midjourney",
      "Word",
      "Hinge"
    ],
    correctAnswer: 1,
    explanation: "Midjourney (ou DALL-E) sont les rois de la création d'images à partir de texte ! 🎨🐱‍🚀"
  },
  {
    id: 5,
    text: "Quelle est la couleur principale du logo de ChatGPT ?",
    options: [
      "Bleu",
      "Rose",
      "Vert (ou Noir)",
      "Rouge"
    ],
    correctAnswer: 2,
    explanation: "Le logo original est un vert émeraude foncé sur fond blanc, ou l'inverse ! 🟢"
  },
  {
    id: 6,
    text: "Quand l'IA invente des faits qui n'existent pas, on dit qu'elle...",
    options: [
      "Dort",
      "Rêve",
      "Hallucine",
      "Blague"
    ],
    correctAnswer: 2,
    explanation: "On appelle ça une 'hallucination'. C'est pour ça qu'il faut toujours vérifier ce qu'elle dit ! 😵‍💫"
  },
  {
    id: 7,
    text: "Lequel de ces noms est un assistant IA très connu ?",
    options: [
      "Claude",
      "Gérard",
      "Bernard",
      "Thierry"
    ],
    correctAnswer: 0,
    explanation: "Claude est l'IA développée par Anthropic. Il est très apprécié pour sa plume ! ✍️"
  },
  {
    id: 8,
    text: "Une 'IA générative' peut créer...",
    options: [
      "Du texte uniquement",
      "Des images uniquement",
      "Du texte, des images, du son et de la vidéo",
      "Des pizzas"
    ],
    correctAnswer: 2,
    explanation: "Elle peut presque tout créer de façon numérique ! Pour les pizzas, il faudra encore attendre... 🍕❌"
  },
  {
    id: 9,
    text: "Quel animal rigolo est le logo des modèles de Meta (Facebook) ?",
    options: [
      "Un Lion",
      "Un Lama",
      "Une Girafe",
      "Un Chat"
    ],
    correctAnswer: 1,
    explanation: "C'est le modèle Llama ! Un petit clin d'œil poilu au monde de l'Open Source. 🦙"
  },
  {
    id: 10,
    text: "Prompt Engineering, c'est quoi au juste ?",
    options: [
      "Réparer l'ordinateur",
      "L'art de bien parler à l'IA pour avoir de bons résultats",
      "Coder en langage binaire",
      "Acheter des actions en bourse"
    ],
    correctAnswer: 1,
    explanation: "C'est savoir 'prompter' : donner les bonnes instructions pour que l'IA comprenne vos besoins ! 💡"
  },
  {
    id: 11,
    text: "Est-ce que ChatGPT peut faire mes devoirs à ma place ?",
    options: [
      "Oui, mais c'est pas bien (et il peut se tromper)",
      "Non, il refuse systématiquement",
      "Seulement en cours de sport",
      "Oui, il est prof agrégé"
    ],
    correctAnswer: 0,
    explanation: "Il peut aider, mais attention : il fait parfois des erreurs bêtes et n'aide pas à apprendre ! 📚⚠️"
  },
  {
    id: 12,
    text: "Dans 'GPT', que signifie le T ?",
    options: [
      "Terminator",
      "Transformer",
      "Téléphone",
      "Tartine"
    ],
    correctAnswer: 1,
    explanation: "Transformer est le nom de l'architecture révolutionnaire inventée par Google en 2017. 🤖"
  },
  {
    id: 13,
    text: "Quelle entreprise a créé Gemini ?",
    options: [
      "Google",
      "SNCF",
      "Amazon",
      "Tesla"
    ],
    correctAnswer: 0,
    explanation: "Gemini est le grand modèle de langage de Google, remplaçant de Bard ! 🌟"
  },
  {
    id: 14,
    text: "Si je demande à l'IA de me raconter une blague, elle...",
    options: [
      "Va exploser",
      "Va le faire avec plaisir (même si elles sont parfois nulles)",
      "Va me demander de l'argent",
      "Va m'insulter"
    ],
    correctAnswer: 1,
    explanation: "Elle adore l'humour ! Même si ses blagues de papa ne font pas toujours rire tout le monde. 🤡"
  },
  {
    id: 15,
    text: "L'IA 'Sora' est spécialisée dans quoi ?",
    options: [
      "Le jardinage",
      "La vidéo hyper réaliste",
      "La musique techno",
      "La cuisine moléculaire"
    ],
    correctAnswer: 1,
    explanation: "Sora a bluffé tout le monde avec des vidéos de 60 secondes incroyablement réalistes ! 🎥"
  }
];

export const GEN_AI_QUESTIONS_L2: Question[] = [
  {
    id: 1,
    text: "Qu'est-ce que la 'Fenêtre de Contexte' (Context Window) d'un LLM ?",
    options: [
      "La taille de l'écran de l'ordinateur",
      "La quantité maximale de texte que le modèle peut traiter en une fois",
      "Le temps de réponse du chatbot",
      "Le nombre d'utilisateurs connectés"
    ],
    correctAnswer: 1,
    explanation: "C'est la mémoire immédiate du modèle. Plus elle est grande, plus l'IA peut 'lire' de longs documents ! 📖"
  },
  {
    id: 2,
    text: "Que signifie l'acronyme 'RLHF' ?",
    options: [
      "Real Life High Frequency",
      "Reinforcement Learning from Human Feedback",
      "Robot Learning with Human Features",
      "Random Logic Human Factor"
    ],
    correctAnswer: 1,
    explanation: "C'est l'étape où des humains notent les réponses de l'IA pour qu'elle apprenne à mieux se comporter ! 🤝"
  },
  {
    id: 3,
    text: "À quoi sert la technique du 'RAG' (Retrieval-Augmented Generation) ?",
    options: [
      "À colorier les images",
      "À connecter l'IA à des données externes ou privées en temps réel",
      "À accélérer la connexion internet",
      "À supprimer les fautes d'orthographe"
    ],
    correctAnswer: 1,
    explanation: "Le RAG permet à l'IA de consulter vos documents avant de répondre pour éviter d'halluciner ! 🔍"
  },
  {
    id: 4,
    text: "Comment appelle-t-on les unités de base que l'IA utilise pour lire du texte ?",
    options: [
      "Des Pixels",
      "Des Bits",
      "Des Tokens",
      "Des Lettres"
    ],
    correctAnswer: 2,
    explanation: "Un token correspond environ à 4 caractères ou 0,75 mot. L'IA compte en tokens, pas en mots ! 🔢"
  },
  {
    id: 5,
    text: "Si j'augmente la 'Température' d'un modèle à 1.0, que se passe-t-il ?",
    options: [
      "L'ordinateur va chauffer",
      "L'IA devient plus créative et aléatoire",
      "L'IA devient plus stricte et factuelle",
      "L'IA va parler plus vite"
    ],
    correctAnswer: 1,
    explanation: "Une température haute favorise l'originalité (mais aussi le risque d'erreurs). À 0, elle est très répétitive ! 🌡️"
  },
  {
    id: 6,
    text: "Quel est l'avantage principal d'un modèle 'Quantifié' ?",
    options: [
      "Il est plus intelligent",
      "Il prend moins de place en mémoire et tourne plus vite",
      "Il peut parler plusieurs langues",
      "Il écrit des poèmes"
    ],
    correctAnswer: 1,
    explanation: "La quantification réduit la précision des calculs pour que l'IA puisse tourner sur des téléphones ou petits PC ! 📉"
  },
  {
    id: 7,
    text: "Qu'est-ce qu'une structure 'MoE' (Mixture of Experts) ?",
    options: [
      "Un groupe de profs qui corrigent l'IA",
      "Un seul gros modèle qui sait tout faire",
      "Plusieurs petits modèles spécialisés qui s'activent selon le besoin",
      "Une recette de cuisine IA"
    ],
    correctAnswer: 2,
    explanation: "C'est comme avoir une équipe de spécialistes. Seuls les modèles utiles s'allument, ce qui est très efficace ! 🧠⚡"
  },
  {
    id: 8,
    text: "La technique 'Chain of Thought' consiste à demander à l'IA de...",
    options: [
      "Penser à voix haute et détailler son raisonnement étape par étape",
      "Réciter des poèmes",
      "Traduire en 50 langues",
      "Chercher sur Google"
    ],
    correctAnswer: 0,
    explanation: "En réfléchissant étape par étape, l'IA fait beaucoup moins d'erreurs logiques et mathématiques ! ⛓️💭"
  },
  {
    id: 9,
    text: "Que signifie 'Multimodal' pour une IA ?",
    options: [
      "Qu'elle peut prendre le bus",
      "Qu'elle peut traiter différents types de médias (texte, image, son, vidéo)",
      "Qu'elle est très polie",
      "Qu'elle a plusieurs personnalités"
    ],
    correctAnswer: 1,
    explanation: "Une IA multimodale peut voir une photo, écouter un audio et répondre par écrit ! 🎤👁️📝"
  },
  {
    id: 10,
    text: "Qu'est-ce que le 'Fine-tuning' ?",
    options: [
      "Payer un abonnement",
      "Réentraîner un modèle existant sur des données spécifiques pour le spécialiser",
      "Changer la couleur de l'interface",
      "Augmenter le volume"
    ],
    correctAnswer: 1,
    explanation: "C'est comme donner une spécialisation après un tronc commun. On peut tuner une IA pour le droit ou la médecine ! 🎓"
  },
  {
    id: 11,
    text: "À quoi sert une 'Base de Données Vectorielle' ?",
    options: [
      "À stocker des films",
      "À stocker des informations sous forme mathématique pour que l'IA les retrouve par sens",
      "À dessiner des graphiques",
      "À protéger contre les virus"
    ],
    correctAnswer: 1,
    explanation: "Elle permet à l'IA de retrouver des infos similaires par le contexte plutôt que par simple mot-clé ! 🎯"
  },
  {
    id: 12,
    text: "Que signifie 'Zero-shot prompting' ?",
    options: [
      "Ne donner aucune instruction",
      "Demander à l'IA de résoudre une tâche sans lui donner d'exemples au préalable",
      "Éteindre l'ordinateur",
      "Utiliser l'IA gratuitement"
    ],
    correctAnswer: 1,
    explanation: "C'est quand on lance un défi direct à l'IA : 'Traduit ça' sans lui montrer comment faire ! 🎯"
  },
  {
    id: 13,
    text: "Quelle technique permet d'adapter un LLM avec très peu de calculs (LoRA) ?",
    options: [
      "Low-Rank Adaptation",
      "Long Range Access",
      "Local Robot Agent",
      "Logical Real Array"
    ],
    correctAnswer: 0,
    explanation: "LoRA permet d'entraîner seulement une infime partie du modèle, c'est ultra rapide et léger ! ⚡"
  },
  {
    id: 14,
    text: "La 'Latence' dans un LLM correspond à...",
    options: [
      "Le prix de l'abonnement",
      "Le temps d'attente avant que le premier mot n'apparaisse",
      "La beauté des réponses",
      "Le nombre de serveurs utilisés"
    ],
    correctAnswer: 1,
    explanation: "On cherche toujours à réduire la latence pour que l'IA réponde instantanément ! ⏱️"
  },
  {
    id: 15,
    text: "Qu'est-ce qu'un 'System Prompt' ?",
    options: [
      "Le mot de passe de l'ordinateur",
      "L'instruction de base qui définit la personnalité et les règles de l'IA",
      "Une erreur système",
      "Le menu de réglages"
    ],
    correctAnswer: 1,
    explanation: "C'est le 'Tu es un expert en...' caché au début qui guide tout le comportement de l'IA ! 🎭"
  },
  {
    id: 16,
    text: "Que redoute-t-on quand on parle de 'Data Leakage' ?",
    options: [
      "Que l'IA s'arrête de fonctionner",
      "Que des données privées utilisées pour l'entraînement ressortent dans les réponses",
      "Que la batterie se décharge",
      "Que le texte soit illisible"
    ],
    correctAnswer: 1,
    explanation: "C'est un enjeu de cybersécurité ! On ne veut pas que l'IA révèle des secrets bancaires ou médicaux. 🔒"
  },
  {
    id: 17,
    text: "Dans le domaine de l'IA, qu'est-ce que le 'Jailbreaking' ?",
    options: [
      "Sortir de prison",
      "Trouver un moyen de contourner les règles de sécurité de l'IA",
      "Installer Windows sur Mac",
      "Utiliser l'IA sans électricité"
    ],
    correctAnswer: 1,
    explanation: "Certains essaient de 'piéger' l'IA pour qu'elle donne des recettes de bombes ou des instructions illégales. ⚠️"
  },
  {
    id: 18,
    text: "Que sont les 'capacités émergentes' des LLM ?",
    options: [
      "Des bugs graphiques",
      "Des compétences que le modèle développe tout seul en changeant d'échelle",
      "Des publicités cachées",
      "Des batteries de serveurs"
    ],
    correctAnswer: 1,
    explanation: "En grandissant, certains modèles ont appris à coder ou à raisonner alors que personne ne leur avait appris ! 🚀"
  },
  {
    id: 19,
    text: "Le 'Throughput' (débit) d'un LLM se mesure souvent en...",
    options: [
      "Kilomètres par heure",
      "Tokens par seconde",
      "Mots par minute",
      "Pixels par image"
    ],
    correctAnswer: 1,
    explanation: "C'est la vitesse à laquelle l'IA génère du texte. On veut toujours plus de TPS ! ⚡"
  },
  {
    id: 20,
    text: "Quelle est la particularité des modèles 'Open Source' like Llama ?",
    options: [
      "Ils sont payants",
      "Tout le monde peut voir leur code et les installer chez soi",
      "Ils ne fonctionnent que sur Apple",
      "Ils ont été créés par la NASA"
    ],
    correctAnswer: 1,
    explanation: "L'Open Source permet à n'importe quel développeur d'améliorer l'IA sans dépendre d'un géant ! 🔓"
  }
];
