import { Question } from "./types";

export const GEN_AI_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Qu'est-ce que l'intelligence artificielle générative ?",
    options: [
      "Un logiciel capable de naviguer sur Internet automatiquement",
      "Un type d'IA capable de créer du contenu original (texte, image, audio, vidéo)",
      "Un système de reconnaissance faciale utilisé dans les téléphones",
      "Un programme qui classe des fichiers sur un ordinateur"
    ],
    correctAnswer: 1,
    explanation: "L'IA générative est une branche de l'IA qui crée du nouveau contenu (texte, image, son…) à partir de données d'entraînement."
  },
  {
    id: 2,
    text: "ChatGPT est un exemple de quel type d'IA ?",
    options: [
      "Une IA de reconnaissance vocale",
      "Un moteur de recherche classique",
      "Un grand modèle de langage (LLM) génératif",
      "Un système expert basé sur des règles fixes"
    ],
    correctAnswer: 2,
    explanation: "ChatGPT est un LLM (Large Language Model) développé par OpenAI, capable de générer du texte de façon conversationnelle."
  },
  {
    id: 3,
    text: "Qu'est-ce qu'un 'prompt' dans le contexte de l'IA générative ?",
    options: [
      "Un résultat produit par l'IA",
      "Une instruction ou une question que l'on donne à l'IA pour obtenir une réponse",
      "Un bug dans le fonctionnement d'un modèle",
      "Un abonnement payant à un service IA"
    ],
    correctAnswer: 1,
    explanation: "Le prompt est le texte d'entrée que tu rédiges pour piloter l'IA. Plus il est précis, meilleure est la réponse."
  },
  {
    id: 4,
    text: "Midjourney est principalement utilisé pour :",
    options: [
      "Rédiger des articles de blog automatiquement",
      "Générer des images à partir de descriptions textuelles",
      "Composer de la musique en quelques secondes",
      "Traduire des documents en plusieurs langues"
    ],
    correctAnswer: 1,
    explanation: "Midjourney est un outil de generation d'images par IA. Tu décris ce que tu veux en texte, et il crée l'image correspondante."
  },
  {
    id: 5,
    text: "Parmi ces outils, lequel n'est PAS un outil d'IA générative ?",
    options: [
      "ChatGPT",
      "Midjourney",
      "Google Sheets",
      "DALL·E"
    ],
    correctAnswer: 2,
    explanation: "Google Sheets est un tableur classique. ChatGPT, Midjourney et DALL·E sont bien des outils d'IA générative."
  },
  {
    id: 6,
    text: "Quelle est la différence entre Intelligence Artificielle (IA) et Machine Learning (ML) ?",
    options: [
      "C'est exactement la même chose, ce sont de simples synonymes",
      "Le ML est la machine physique, l'IA est le logiciel",
      "L'IA est le domaine global, le ML est son sous-domaine d'apprentissage",
      "L'IA gère uniquement les images, le ML gère le texte"
    ],
    correctAnswer: 2,
    explanation: "L'IA est la discipline large visant à simuler l'intelligence. Le Machine Learning est la technique spécifique qui permet aux machines d'apprendre à partir de données."
  },
  {
    id: 7,
    text: "Que signifie 'hallucination' dans le contexte d'un modèle de langage ?",
    options: [
      "L'IA crée des images floues ou abstraites",
      "L'IA produit une réponse incorrecte mais formulée avec confiance",
      "L'IA refuse de répondre à une question",
      "L'IA génère du contenu en plusieurs langues simultanément"
    ],
    correctAnswer: 1,
    explanation: "Les 'hallucinations' sont des erreurs factuelles présentées avec assurance par l'IA. C'est pourquoi il faut toujours vérifier les informations importantes."
  },
  {
    id: 8,
    text: "Face à la création de contenu (articles, visuels), comment faut-il voir l'IA ?",
    options: [
      "Comme un copilote : l'humain garde le contrôle, vérifie et ajoute son expertise",
      "Comme un expert infaillible à qui on peut tout déléguer",
      "Comme un simple moteur de recherche",
      "Comme un concurrent qui va remplacer les créatifs"
    ],
    correctAnswer: 0,
    explanation: "L'IA est un outil d'augmentation. L'expertise humaine reste indispensable pour diriger, vérifier et valider la production."
  },
  {
    id: 9,
    text: "Quel blocage humain très connu l'IA permet-elle de surmonter facilement ?",
    options: [
      "L'angoisse de parler en public lors d'une réunion",
      "Le syndrome de la 'page blanche' au moment de démarrer un projet",
      "La fatigue visuelle due aux écrans d'ordinateur",
      "La difficulté à utiliser un clavier et une souris"
    ],
    correctAnswer: 1,
    explanation: "L'IA est parfaite pour générer une première structure ou des idées de départ, ce qui permet de lancer l'inertie créative beaucoup plus vite."
  },
  {
    id: 10,
    text: "Quelle est la différence entre une recherche classique (Google) et un \"Prompt\" (requête IA) ?",
    options: [
      "Google est gratuit, l'IA est toujours payante",
      "Une recherche trouve des sources existantes, un prompt sert à créer, transformer ou analyser un contenu",
      "Un prompt s'écrit obligatoirement en langage informatique",
      "Il n'y a aucune différence, c'est la même chose"
    ],
    correctAnswer: 1,
    explanation: "Google vous aide à trouver une information qui existe déjà ailleurs. L'IA générative crée ou transforme du contenu à la volée."
  }
];

export const GEN_AI_QUESTIONS_L2: Question[] = [
  {
    id: 1,
    text: "Quelle est la meilleure façon d'améliorer la qualité d'une réponse de ChatGPT ?",
    options: [
      "Écrire le prompt en majuscules",
      "Relancer la page et réessayer sans rien changer",
      "Préciser le contexte, le rôle souhaité, le format et l'objectif dans le prompt",
      "Poser la question en anglais uniquement"
    ],
    correctAnswer: 2,
    explanation: "Un bon prompt contient un contexte clair, un rôle défini pour l'IA, un format attendu et un objectif précis. C'est le cœur du prompt engineering."
  },
  {
    id: 2,
    text: "Dans la méthode 'R.O.C.I.F' pour structurer sa demande, que signifie le 'R' ?",
    options: [
      "Répétition : le fait de relancer la machine plusieurs fois",
      "Rôle : le fait de donner une posture d'expert à l'IA (ex: 'Agis comme un...')",
      "Rapidité : le fait d'exiger une réponse très courte",
      "Résultat : le fait de demander un fichier final téléchargeable"
    ],
    correctAnswer: 1,
    explanation: "Définir un rôle clair (expert, coach, critique) permet à l'IA d'adopter le bon ton et d'utiliser le vocabulaire approprié à votre besoin."
  },
  {
    id: 3,
    text: "Pour gagner du temps, sur quel type de tâches faut-il utiliser l'IA en priorité ?",
    options: [
      "Les décisions stratégiques très importantes de l'entreprise",
      "La signature et l'analyse de contrats ultra-confidentiels",
      "Les tâches opérationnelles répétitives et chronophages",
      "L'évaluation finale et humaine d'un employé"
    ],
    correctAnswer: 2,
    explanation: "L'IA brille dans l'automatisation du 'tout-venant' (mails, résumés, tris) pour libérer du temps cerveau pour les tâches à forte valeur ajoutée."
  },
  {
    id: 4,
    text: "Quelle est la règle des '3 R' pour bien intégrer l'IA au travail sans perdre de temps ?",
    options: [
      "Rédiger, Relire, Recommencer",
      "Réduire, Réévaluer, Rediriger",
      "Respirer, Réfléchir, Répondre",
      "Regrouper, Résumer, Renvoyer"
    ],
    correctAnswer: 1,
    explanation: "La méthode Réduire/Réévaluer/Rediriger aide à identifier les tâches automatisables pour se concentrer sur celles où l'humain apporte le plus de valeur."
  },
  {
    id: 5,
    text: "En quoi consiste la technique très efficace du 'Few-shots' ?",
    options: [
      "Poser sa question en utilisant moins de trois mots",
      "Donner 2 ou 3 exemples concrets à l'IA pour qu'elle imite votre style",
      "Prendre des captures d'écran de son travail pour les montrer à ses collègues",
      "Demander à l'IA de générer 3 images complètement différentes"
    ],
    correctAnswer: 1,
    explanation: "Le 'Few-shot prompting' consiste à montrer à l'IA quelques exemples du résultat attendu pour qu'elle comprenne parfaitement le format ou le style souhaité."
  },
  {
    id: 6,
    text: "Si la première réponse de l'IA ne vous convient pas, quel est le bon réflexe ?",
    options: [
      "Fermer l'outil et abandonner l'IA",
      "Répéter exactement la même phrase jusqu'à ce qu'elle change d'avis",
      "Créer un nouveau compte utilisateur",
      "Dialoguer : corriger l'IA, lui donner plus de contexte et affiner la demande"
    ],
    correctAnswer: 3,
    explanation: "L'IA fonctionne par itération. Souvent, la meilleure réponse arrive en discutant avec le modèle pour affiner son besoin."
  },
  {
    id: 7,
    text: "Si la réponse de l'IA ne vous plaît pas, quelle est la meilleure réaction ?",
    options: [
      "Écrire 'C'est nul, recommence' sans donner aucune explication",
      "Abandonner l'outil immédiatement et tout faire soi-même",
      "Lui faire un retour constructif en précisant exactement ce qu'il faut changer",
      "Créer un nouveau compte utilisateur pour réinitialiser le système"
    ],
    correctAnswer: 2,
    explanation: "L'IA est un outil conversationnel. Plus vos retours sont précis ('écris plus court', 'change le ton', 'ajoute ce détail'), meilleur sera le résultat final."
  },
  {
    id: 8,
    text: "Comment vérifier facilement si l'IA n'a pas inventé une information ?",
    options: [
      "En lui demandant de vérifier ses sources et s'il existe des contre-arguments",
      "En fermant l'application et en retapant la même question",
      "En utilisant obligatoirement la version la plus chère de l'outil",
      "On ne peut pas, il faut lui faire confiance aveuglément"
    ],
    correctAnswer: 0,
    explanation: "Demander à l'IA de justifier sa réponse ou de chercher des points de vue opposés est un bon réflexe pour débusquer d'éventuelles hallucinations."
  },
  {
    id: 9,
    text: "Dans quel domaine l'IA générative peut-elle être utile à un professionnel du marketing ?",
    options: [
      "Gérer la comptabilité de l'entreprise",
      "Rédiger des posts, créer des visuels et brainstormer des idées de campagnes",
      "Remplacer entièrement les décisions stratégiques humaines",
      "Accéder à des données en temps réel sur les marchés financiers"
    ],
    correctAnswer: 1,
    explanation: "L'IA générative est un excellent assistant créatif : elle aide à la rédaction, à la création visuelle et au brainstorming, sans remplacer le jugement humain."
  },
  {
    id: 10,
    text: "Comment l'IA peut-elle favoriser l'inclusion des personnes malvoyantes sur le web ?",
    options: [
      "En générant des descriptions 'Alt' très précises pour lire les images",
      "En augmentant automatiquement la luminosité de tous les écrans",
      "En traduisant le texte dans toutes les langues du monde",
      "En imprimant les pages web en braille à distance"
    ],
    correctAnswer: 0,
    explanation: "Les modèles de vision actuels peuvent décrire une image avec un niveau de détail inédit, rendant le web beaucoup plus accessible aux personnes malvoyantes."
  }
];

export const GEN_AI_QUESTIONS_L3: Question[] = [
  {
    id: 1,
    text: "Quelle est la différence fondamentale entre une IA classique (analytique) et une IA générative ?",
    options: [
      "L'IA classique crée du contenu, l'IA générative se contente de le classer",
      "L'IA classique analyse ou prédit à partir de données existantes (ex: météo), l'IA générative produit de nouvelles données originales",
      "L'IA générative est connectée à Internet, l'IA classique ne l'est pas",
      "L'IA classique est plus rapide que l'IA générative"
    ],
    correctAnswer: 1,
    explanation: "C'est la différence clé : là où les IA traditionnelles classent (spam/pas spam), les IA génératives créent de la matière qui n'existait pas avant."
  },
  {
    id: 2,
    text: "Concrètement, comment fonctionne une IA qui génère du texte ?",
    options: [
      "Elle cherche la réponse exacte dans une grande encyclopédie",
      "Elle comprend vos sentiments et devine ce que vous voulez",
      "Elle calcule et prédit statistiquement le mot suivant le plus logique",
      "Elle copie-colle un article de blog aléatoire"
    ],
    correctAnswer: 2,
    explanation: "Un modèle de langage (LLM) ne 'comprend' pas le sens comme un humain ; il prédit mathématiquement le mot suivant le plus probable."
  },
  {
    id: 3,
    text: "Que signifie le terme \"multimodal\" pour les IA récentes ?",
    options: [
      "Elles sont disponibles sur téléphone et ordinateur",
      "Elles peuvent comprendre et combiner plusieurs formats en même temps (texte, image, audio, vidéo)",
      "Elles traduisent dans plusieurs langues",
      "Elles sont créées par plusieurs entreprises ensemble"
    ],
    correctAnswer: 1,
    explanation: "Le multimodal permet à une IA de 'voir' des images, 'entendre' des voix et 'répondre' par texte ou image dans une même session."
  },
  {
    id: 4,
    text: "Quelle est la règle d'or pour protéger vos données professionnelles avec l'IA ?",
    options: [
      "Il suffit de dire \"Ceci est secret\" à l'IA pour qu'elle n'enregistre rien",
      "On peut tout partager si c'est pour gagner du temps",
      "Partager uniquement les données financières, mais pas les noms",
      "Ne jamais partager de données personnelles, confidentielles ou sensibles"
    ],
    correctAnswer: 3,
    explanation: "La confidentialité est cruciale. Les données partagées avec des IA publiques peuvent parfois être utilisées pour l'entraînement des futurs modèles."
  },
  {
    id: 5,
    text: "Qu'est-ce que le RGPD a à voir avec l'utilisation de l'IA ?",
    options: [
      "Rien, le RGPD ne concerne que les sites e-commerce",
      "Il encadre la protection des données personnelles, ce qui inclut les données utilisées pour entraîner des IA",
      "Il interdit totalement l'usage de l'IA en entreprise",
      "Il oblige toutes les entreprises à utiliser l'IA"
    ],
    correctAnswer: 1,
    explanation: "Le RGPD (Règlement Général sur la Protection des Données) s'applique aussi à l'IA. Il faut être vigilant sur les données qu'on confie à des outils IA, surtout des données personnelles."
  },
  {
    id: 6,
    text: "Selon la loi européenne (IA Act), comment sont classés les outils de génération comme ChatGPT ?",
    options: [
      "Risque inacceptable (ils vont être interdits)",
      "Risque élevé (très contrôlés)",
      "Risque limité (ils ont juste une obligation de transparence)",
      "Risque minimal (aucune règle)"
    ],
    correctAnswer: 2,
    explanation: "L'IA Act classe ces modèles en 'risque limité', imposant la transparence (on doit savoir qu'on parle à une IA et comment elle a été entraînée)."
  },
  {
    id: 7,
    text: "Face au risque d'hallucination de l'IA, quelle est la posture professionnelle la plus sûre ?",
    options: [
      "Faire confiance à l'IA si elle donne beaucoup de détails précis",
      "Ne jamais utiliser l'IA pour des faits historiques ou techniques",
      "Considérer l'IA comme une source 'non-fiable' par défaut et vérifier systématiquement les faits critiques",
      "Demander à l'IA si elle est sûre d'elle-même"
    ],
    correctAnswer: 2,
    explanation: "L'IA peut être très convaincante tout en se trompant. La vérification par une source externe fiable reste indispensable pour tout usage pro."
  },
  {
    id: 8,
    text: "Au travail, qu'est-ce que le piège du \"Doomprompting\" ?",
    options: [
      "Passer des heures à modifier sa demande (prompt) pour obtenir le résultat parfait, et perdre du temps",
      "Refuser catégoriquement d'utiliser l'IA",
      "Demander à l'IA de générer des images effrayantes",
      "L'incapacité de se connecter à ChatGPT"
    ],
    correctAnswer: 0,
    explanation: "Le Doomprompting est le piège de la perfection : passer trop de temps à peaufiner un prompt au lieu de se contenter d'un résultat 'assez bon'."
  },
  {
    id: 9,
    text: "L'IA générative n'est pas capable de créer à partir de rien (ex nihilo). En revanche, elle excelle dans la créativité dite \"combinatoire\". Qu'est-ce que cela signifie ?",
    options: [
      "Elle est capable de repousser les limites d'un concept abstrait",
      "Elle peut recombiner des éléments existants et des styles pour créer des associations inédites mais familiers",
      "Elle se limite à combiner des données mathématiques dans des tableurs",
      "Elle invente de nouveaux mouvements artistiques en rupture totale avec le passé"
    ],
    correctAnswer: 1,
    explanation: "L'IA ne 'pense' pas, mais elle a 'vu' des milliards d'associations. Sa force est de marier des concepts opposés (ex: un astronaute style Van Gogh) de manière techniquement parfaite."
  },
  {
    id: 10,
    text: "En entreprise, quel piège lié à la productivité se cache derrière le terme de \"Workslop\" ?",
    options: [
      "Passer plus de 30 minutes à écrire la documentation d'un processus",
      "Optimiser compulsivement un prompt pendant des heures sans jamais avancer",
      "Générer du \"faux travail\" avec l'IA : un contenu moyen sans substance qui rajoute de la charge mentale à ceux qui doivent le lire ou le corriger",
      "Travailler en dehors des heures de bureau pour rattraper le temps perdu"
    ],
    correctAnswer: 2,
    explanation: "Le 'Workslop' est la pollution de l'espace de travail par des mails ou rapports générés en un clic. Si l'IA aide à produire plus vite, elle ne doit pas servir à inonder les autres de contenu inutile."
  }
];

export const GEN_AI_QUESTIONS_L4: Question[] = [
  {
    id: 1,
    text: "En 2017, quelle innovation majeure introduite par des chercheurs de Google a révolutionné l'IA générative et permis la création des LLM ?",
    options: [
      "Le \"Deep Learning\", qui permet aux machines de comprendre les images",
      "L'architecture des \"Transformers\", qui traite les données en parallèle en se concentrant sur le contexte",
      "Le \"Machine Learning\", qui apprend à partir de bases de données sans programmation",
      "La victoire de l'algorithme AlexNet sur la base d'images ImageNet"
    ],
    correctAnswer: 1,
    explanation: "L'article 'Attention Is All You Need' a introduit les Transformers. Contrairement aux modèles précédents, ils analysent toutes les parties d'une phrase en même temps pour en saisir le sens global."
  },
  {
    id: 2,
    text: "Sur le plan technique, comment un modèle de génération d'images (comme Midjourney) crée-t-il un visuel à partir de votre texte ?",
    options: [
      "Il utilise un processus de \"diffusion\" : il part d'un bruit visuel aléatoire et le transforme progressivement en image nette",
      "Il recherche des images similaires sur internet et en fait un photomontage",
      "Il utilise un moteur 3D pour modéliser des polygones et appliquer des textures",
      "Il prédit le pixel suivant de la même manière qu'un LLM prédit le mot suivant"
    ],
    correctAnswer: 0,
    explanation: "Les modèles de diffusion sont entraînés à 'nettoyer' du bruit. Pour créer une image, ils partent d'un chaos de pixels et le sculptent étape par étape jusqu'à ce qu'il corresponde à votre description."
  },
  {
    id: 3,
    text: "Quelle est la différence technique entre le \"Fine-Tuning\" et le \"RAG\" pour améliorer un modèle d'IA ?",
    options: [
      "Le Fine-Tuning est gratuit, tandis que le RAG nécessite un abonnement premium",
      "Le RAG est utilisé pour les images, le Fine-Tuning uniquement pour le texte",
      "Le Fine-Tuning ré-entraîne le modèle sur des données spécifiques, tandis que le RAG va simplement chercher des documents externes pour enrichir le contexte de la réponse",
      "Il n'y a aucune différence, ce sont deux mots pour désigner le prompt engineering"
    ],
    correctAnswer: 2,
    explanation: "Le Fine-Tuning modifie le 'cerveau' de l'IA (mémoire à long terme), alors que le RAG lui donne un 'livre ouvert' (mémoire à court terme) pour qu'elle y trouve les réponses fraîches ou privées."
  },
  {
    id: 4,
    text: "Quel enjeu fondamental est soulevé par le procès en cours entre le New York Times et OpenAI ?",
    options: [
      "La question de savoir si l'IA consomme trop d'énergie pour analyser l'actualité",
      "Le droit pour un modèle d'IA d'apprendre sur des contenus protégés puis de les concurrencer directement sans licence",
      "L'obligation pour les journalistes de mentionner quand ils utilisent l'IA",
      "La création de fausses preuves juridiques par ChatGPT"
    ],
    correctAnswer: 1,
    explanation: "Ce procès est historique car il interroge les limites du 'fair use' : une IA peut-elle s'entraîner sur des articles payants pour ensuite délivrer des résumés qui évitent aux lecteurs de se rendre sur le site d'origine ?"
  },
  {
    id: 5,
    text: "Selon l'IA Act (la réglementation européenne), que risque-t-on à utiliser ChatGPT seul pour classer des CV et écarter des candidats ?",
    options: [
      "C'est une pratique encouragée car elle élimine les biais humains",
      "Le risque est minimal, il s'agit d'une simple tâche de tri administratif",
      "C'est un usage à \"risque inacceptable\" qui est totalement interdit en Europe",
      "C'est un usage à \"risque élevé\", illégal sans transparence et supervision stricte, exposant à des poursuites pour discrimination"
    ],
    correctAnswer: 3,
    explanation: "Le recrutement est considéré comme un domaine à 'haut risque' par l'UE. Automatiser ces décisions sans contrôle humain rigoureux est illégal et peut perpétuer des biais discriminatoires."
  },
  {
    id: 6,
    text: "Selon la matrice \"Impact / Effort\", par quoi devez-vous absolument commencer lorsque vous souhaitez intégrer l'IA dans vos processus métier ?",
    options: [
      "Les petits ajustements de confort (Impact faible, Effort faible)",
      "Les projets stratégiques complexes comme automatiser un CRM (Impact élevé, Effort élevé)",
      "Développer vous-même un outil IA sur-mesure (Impact faible, Effort élevé)",
      "Les \"Quick Wins\" : des tâches simples, chronophages et répétitives qui démontrent rapidement la valeur de l'IA"
    ],
    correctAnswer: 3,
    explanation: "Pour réussir l'adoption de l'IA, il faut prouver son utilité immédiate. Viser les tâches à fort gain de temps et faible complexité technique permet de débloquer du budget et de l'adhésion."
  },
  {
    id: 7,
    text: "Dans les métiers créatifs, qu'appelle-t-on \"l'effet photocopieuse\" ou le \"cannibalisme de l'IA\" ?",
    options: [
      "La tendance de l'IA à reproduire des formats statistiques moyens, entraînant une uniformisation prévisible et une perte de diversité des idées",
      "Le fait que l'IA copie exactement le style d'un collègue de travail",
      "Une technique permettant de générer la même image dans 100 formats différents",
      "L'incapacité de l'IA à lire un document scanné ou photographié"
    ],
    correctAnswer: 0,
    explanation: "Comme l'IA s'appuie sur ce qui existe déjà, elle tend à favoriser le 'consensus statistique'. Sans intervention humaine créative, la production risque de devenir fade et répétitive."
  },
  {
    id: 8,
    text: "En Prompt Engineering, comment utiliser \"l'approche dialogue\" pour limiter le risque d'hallucination de l'IA ?",
    options: [
      "En lui ordonnant de supprimer son historique de conversation",
      "En échangeant de manière itérative : chaque interaction enrichit la mémoire de l'IA, réduit son incertitude et permet de rectifier le tir progressivement",
      "En copiant-collant la même question cinq fois de suite dans le même message",
      "En lui demandant de parler avec une autre IA pour vérifier ses sources"
    ],
    correctAnswer: 1,
    explanation: "On n'obtient rarement le résultat parfait du premier coup. En guidant l'IA par étapes ('Fais le plan', puis 'Rédige la partie 1'), on réduit les erreurs et on affine la précision."
  },
  {
    id: 9,
    text: "Qu'est-ce que le 'machine learning' (apprentissage automatique) ?",
    options: [
      "Un processus où des humains programment chaque règle à la main",
      "Une méthode où une machine apprend à partir de données sans être explicitement programmée pour chaque tâche",
      "Un logiciel de gestion de bases de données",
      "Un système de sauvegarde automatique de fichiers"
    ],
    correctAnswer: 1,
    explanation: "Le machine learning permet à une IA d'apprendre par l'exemple. C'est la base sur laquelle reposent les modèles génératifs."
  },
  {
    id: 10,
    text: "Qu'est-ce que la notion de \"Window Context\" (Fenêtre de contexte) dans un modèle d'IA ?",
    options: [
      "Le nombre de fichiers que l'IA peut ouvrir en même temps",
      "La quantité maximale d'informations que l'IA peut \"garder en tête\" pour répondre",
      "La taille de la fenêtre de discussion sur l'écran",
      "Le temps que l'IA met pour afficher sa réponse"
    ],
    correctAnswer: 1,
    explanation: "La fenêtre de contexte définit la limite de mémoire à court terme de l'IA. Plus elle est grande, plus l'IA peut traiter de longs documents sans oublier le début."
  }
];

import { Module } from "./types";

export const TRAINING_QUIZ_STRUCTURE: Module[] = [
  {
    id: "M1",
    title: "Module 1",
    description: "Introduction & Culture IA",
    color: "bg-wemodo-yellow",
    chapters: [
      { id: "M1C1", title: "M1C1 - Intro", questions: GEN_AI_QUESTIONS },
      { id: "M1C2", title: "M1C2 - Qu'est ce que l'IA", questions: GEN_AI_QUESTIONS },
      { id: "M1C3", title: "M1C3 - IA en cotexte pro", questions: GEN_AI_QUESTIONS },
      { id: "M1C4", title: "M1C4 - Veille IA", questions: GEN_AI_QUESTIONS },
    ]
  },
  {
    id: "M2",
    title: "Module 2",
    description: "Maîtrise & Outils",
    color: "bg-wemodo-pink",
    chapters: [
      { id: "M2C1", title: "M2C1 - Fonctionnement IA génératives", questions: GEN_AI_QUESTIONS },
      { id: "M2C2", title: "M2C2 - IA et créactivité", questions: GEN_AI_QUESTIONS },
      { id: "M2C3", title: "M2C3 - IA et productivité", questions: GEN_AI_QUESTIONS },
      { id: "M2C4", title: "M2C4 - Selectionner un outil", questions: GEN_AI_QUESTIONS },
      { id: "M2C5", title: "M2C5 - Introduction Prompt Ingeneering", questions: GEN_AI_QUESTIONS },
      { id: "M2C6", title: "M2C6 - Structurer Optimiser un prompt", questions: GEN_AI_QUESTIONS },
      { id: "M2C7", title: "M2C7 - Enjeux Ethiques AI Act", questions: GEN_AI_QUESTIONS },
      { id: "M2C8", title: "M2C8 - RGPD Accessibilité Handicap", questions: GEN_AI_QUESTIONS },
    ]
  }
];

