import { applyStreak, buildCheckpoint, buildDaySession, checkpointDue, daysBetween, gradeCard, MILESTONE_EVERY, nextMilestone, quizChoices, sameDay, sessionLength, todayKey } from "./srsEngine.js";
import { tutorSpeech } from "./tutorsData.js";

const russianAlphabet = [
  { upper: "А", lower: "а", name: "A", hint: "Comme le a de « papa ».", example: "мама", exampleBack: "maman", speak: "а" },
  { upper: "Б", lower: "б", name: "Be", hint: "Comme le b de « beau ».", example: "брат", exampleBack: "frère", speak: "бэ" },
  { upper: "В", lower: "в", name: "Ve", hint: "Comme le v de « vite ».", example: "вода", exampleBack: "eau", speak: "вэ" },
  { upper: "Г", lower: "г", name: "Gué", hint: "Comme le g de « gare ».", example: "город", exampleBack: "ville", speak: "гэ" },
  { upper: "Д", lower: "д", name: "Dé", hint: "Comme le d de « dos ».", example: "дом", exampleBack: "maison", speak: "дэ" },
  { upper: "Е", lower: "е", name: "Ié", hint: "Souvent « yé », ou « é » après une consonne.", example: "есть", exampleBack: "il y a", speak: "е" },
  { upper: "Ё", lower: "ё", name: "Io", hint: "Toujours accentué : « yo ».", example: "ёлка", exampleBack: "sapin", speak: "ё" },
  { upper: "Ж", lower: "ж", name: "Jé", hint: "Comme le j de « jour ».", example: "жена", exampleBack: "épouse", speak: "жэ" },
  { upper: "З", lower: "з", name: "Zé", hint: "Comme le z de « zéro ».", example: "зима", exampleBack: "hiver", speak: "зэ" },
  { upper: "И", lower: "и", name: "I", hint: "Comme le i de « lit ».", example: "имя", exampleBack: "prénom", speak: "и" },
  { upper: "Й", lower: "й", name: "I court", hint: "Un i très bref.", example: "чай", exampleBack: "thé", speak: "и краткое" },
  { upper: "К", lower: "к", name: "Ka", hint: "Comme le k de « kilo ».", example: "кофе", exampleBack: "café", speak: "ка" },
  { upper: "Л", lower: "л", name: "El", hint: "Comme le l de « lac ».", example: "лампа", exampleBack: "lampe", speak: "эль" },
  { upper: "М", lower: "м", name: "Em", hint: "Comme le m de « mer ».", example: "молоко", exampleBack: "lait", speak: "эм" },
  { upper: "Н", lower: "н", name: "En", hint: "Comme le n de « nuage ».", example: "нет", exampleBack: "non", speak: "эн" },
  { upper: "О", lower: "о", name: "O", hint: "O ouvert quand il est accentué.", example: "окно", exampleBack: "fenêtre", speak: "о" },
  { upper: "П", lower: "п", name: "Pé", hint: "Comme le p de « pain ».", example: "привет", exampleBack: "salut", speak: "пэ" },
  { upper: "Р", lower: "р", name: "Er", hint: "R roulé, avec la langue.", example: "рука", exampleBack: "main", speak: "эр" },
  { upper: "С", lower: "с", name: "Es", hint: "Comme le s de « sac ».", example: "спасибо", exampleBack: "merci", speak: "эс" },
  { upper: "Т", lower: "т", name: "Té", hint: "Comme le t de « thé ».", example: "три", exampleBack: "trois", speak: "тэ" },
  { upper: "У", lower: "у", name: "Ou", hint: "Comme le ou de « loup ».", example: "утро", exampleBack: "matin", speak: "у" },
  { upper: "Ф", lower: "ф", name: "Ef", hint: "Comme le f de « faim ».", example: "фрукт", exampleBack: "fruit", speak: "эф" },
  { upper: "Х", lower: "х", name: "Kha", hint: "Un souffle, comme le j espagnol.", example: "хлеб", exampleBack: "pain", speak: "ха" },
  { upper: "Ц", lower: "ц", name: "Tsé", hint: "Comme ts dans « tsar ».", example: "центр", exampleBack: "centre", speak: "цэ" },
  { upper: "Ч", lower: "ч", name: "Tché", hint: "Comme tch dans « Tchad ».", example: "чай", exampleBack: "thé", speak: "че" },
  { upper: "Ш", lower: "ш", name: "Cha", hint: "Comme ch dans « chat ».", example: "школа", exampleBack: "école", speak: "ша" },
  { upper: "Щ", lower: "щ", name: "Chtcha", hint: "Un « ch » plus long et plus doux.", example: "щи", exampleBack: "soupe au chou", speak: "ща" },
  { upper: "Ъ", lower: "ъ", name: "Signe dur", hint: "Il sépare les sons, presque sans bruit.", example: "объект", exampleBack: "objet", speak: "твёрдый знак" },
  { upper: "Ы", lower: "ы", name: "Y", hint: "Un i prononcé plus au fond.", example: "ты", exampleBack: "tu", speak: "ы" },
  { upper: "Ь", lower: "ь", name: "Signe mou", hint: "Il adoucit la consonne d’avant.", example: "мать", exampleBack: "mère", speak: "мягкий знак" },
  { upper: "Э", lower: "э", name: "È", hint: "Comme le è de « mère ».", example: "это", exampleBack: "cela", speak: "э" },
  { upper: "Ю", lower: "ю", name: "You", hint: "Comme « you ».", example: "юг", exampleBack: "sud", speak: "ю" },
  { upper: "Я", lower: "я", name: "Ya", hint: "Comme « ya ».", example: "яблоко", exampleBack: "pomme", speak: "я" },
];

const russianWords = [
  ["Salutations", "Привет", "privet", "Salut"],
  ["Salutations", "Здравствуйте", "zdravstvouïté", "Bonjour"],
  ["Salutations", "Доброе утро", "dobroïé outro", "Bonjour (le matin)"],
  ["Salutations", "До свидания", "do svidania", "Au revoir"],
  ["Salutations", "Как дела?", "kak déla", "Comment ça va ?"],
  ["Mots utiles", "Спасибо", "spasibo", "Merci"],
  ["Mots utiles", "Пожалуйста", "pojalousta", "S'il vous plaît"],
  ["Mots utiles", "Да", "da", "Oui"],
  ["Mots utiles", "Нет", "net", "Non"],
  ["Mots utiles", "Извините", "izvinité", "Excusez-moi"],
  ["Nourriture", "Вода", "voda", "Eau"],
  ["Nourriture", "Хлеб", "khleb", "Pain"],
  ["Nourriture", "Молоко", "moloko", "Lait"],
  ["Nourriture", "Яблоко", "yabloko", "Pomme"],
  ["Nourriture", "Чай", "tchaï", "Thé"],
  ["Nourriture", "Кофе", "kofé", "Café"],
  ["Chiffres", "Один", "adin", "Un"],
  ["Chiffres", "Два", "dva", "Deux"],
  ["Chiffres", "Три", "tri", "Trois"],
  ["Chiffres", "Десять", "désiat", "Dix"],
].map(([category, front, phonetic, back]) => ({ category, front, phonetic, back, speak: front }));

const frenchAlphabet = [
  { upper: "É", lower: "é", name: "Э", hint: "Как «э», губы чуть улыбаются.", example: "été", exampleBack: "лето", speak: "é" },
  { upper: "U", lower: "u", name: "У / И", hint: "Губы как на «у», язык как на «и».", example: "rue", exampleBack: "улица", speak: "rue" },
  { upper: "R", lower: "r", name: "Р", hint: "Звук в горле, не кончиком языка.", example: "Paris", exampleBack: "Париж", speak: "Paris" },
  { upper: "AN", lower: "an", name: "АН", hint: "Носовой звук. «Н» почти не слышно.", example: "enfant", exampleBack: "ребёнок", speak: "enfant" },
  { upper: "ON", lower: "on", name: "ОН", hint: "Носовое «о».", example: "bonjour", exampleBack: "здравствуйте", speak: "bonjour" },
  { upper: "EU", lower: "eu", name: "Ё", hint: "Между «е» и «ё».", example: "deux", exampleBack: "два", speak: "deux" },
  { upper: "J", lower: "j", name: "Ж", hint: "Как русское «ж».", example: "je", exampleBack: "я", speak: "je" },
  { upper: "È", lower: "è", name: "Э", hint: "Более открытый звук.", example: "mère", exampleBack: "мать", speak: "mère" },
];

const frenchWords = [
  ["Приветствия", "Bonjour", "бонжур", "Здравствуйте"],
  ["Приветствия", "Salut", "салю", "Привет"],
  ["Приветствия", "Au revoir", "о рёвуар", "До свидания"],
  ["Приветствия", "Merci", "мерси", "Спасибо"],
  ["Приветствия", "S'il vous plaît", "силь ву плэ", "Пожалуйста"],
  ["Полезные слова", "Oui", "уи", "Да"],
  ["Полезные слова", "Non", "нон", "Нет"],
  ["Полезные слова", "Excusez-moi", "экскюзэ-муа", "Извините"],
  ["Еда", "L'eau", "ло", "Вода"],
  ["Еда", "Le pain", "лё пэн", "Хлеб"],
  ["Еда", "Le lait", "лё лэ", "Молоко"],
  ["Еда", "La pomme", "ла пом", "Яблоко"],
  ["Еда", "Le thé", "лё тэ", "Чай"],
  ["Еда", "Le café", "лё кафэ", "Кофе"],
  ["Числа", "Un", "ён", "Один"],
  ["Числа", "Deux", "дё", "Два"],
  ["Числа", "Trois", "труа", "Три"],
  ["Числа", "Dix", "дис", "Десять"],
].map(([category, front, phonetic, back]) => ({ category, front, phonetic, back, speak: front }));

const russianGrammar = [
  {
    title: "Pas d'article",
    rule: "Le russe ne dit pas « le », « la » ou « un ». Le mot seul suffit.",
    examples: [
      { say: "вода", target: "Вода", gloss: "de l'eau, l'eau" },
      { say: "хлеб", target: "Хлеб", gloss: "du pain, le pain" },
    ],
  },
  {
    title: "Tu et vous",
    rule: "Ты parle à un proche. Вы parle à plusieurs personnes, ou marque le respect.",
    examples: [
      { say: "привет", target: "Привет", gloss: "salut, avec ты" },
      { say: "здравствуйте", target: "Здравствуйте", gloss: "bonjour, avec вы" },
    ],
  },
  {
    title: "La négation",
    rule: "Не se place devant le mot qu'il nie.",
    examples: [
      { say: "я не знаю", target: "Я не знаю", gloss: "je ne sais pas" },
      { say: "это не вода", target: "Это не вода", gloss: "ce n'est pas de l'eau" },
    ],
  },
];

const frenchGrammar = [
  {
    title: "Артикль",
    rule: "Перед французским словом почти всегда стоит маленькое слово: le, la, un, une.",
    examples: [
      { say: "le pain", target: "Le pain", gloss: "хлеб" },
      { say: "une pomme", target: "Une pomme", gloss: "яблоко" },
    ],
  },
  {
    title: "Глагол être",
    rule: "По-французски «быть» не пропадает. Je suis значит «я есть».",
    examples: [
      { say: "je suis", target: "Je suis", gloss: "я" },
      { say: "c'est de l'eau", target: "C'est de l'eau", gloss: "это вода" },
    ],
  },
  {
    title: "Отрицание",
    rule: "Отрицание обнимает глагол: ne ... pas.",
    examples: [
      { say: "je ne sais pas", target: "Je ne sais pas", gloss: "я не знаю" },
      { say: "ce n'est pas du pain", target: "Ce n'est pas du pain", gloss: "это не хлеб" },
    ],
  },
];

const bretonAlphabet = [
  { upper: "C'H", lower: "c'h", name: "C'h", hint: "Un souffle au fond de la gorge, comme le j espagnol.", example: "c'hoant", exampleBack: "envie", speak: "c'hoant" },
  { upper: "ZH", lower: "zh", name: "Zh", hint: "Souvent comme un z léger, parfois comme un ch.", example: "brezhoneg", exampleBack: "le breton", speak: "brezhoneg" },
  { upper: "Ñ", lower: "ñ", name: "N tilde", hint: "Il nasalise le son d'avant.", example: "emañ", exampleBack: "est (quelque part)", speak: "emañ" },
  { upper: "LH", lower: "lh", name: "Lh", hint: "Un l mouillé, proche du « ili ».", example: "familh", exampleBack: "famille", speak: "familh" },
  { upper: "EU", lower: "eu", name: "Eu", hint: "Entre « é » et « eu » français.", example: "breur", exampleBack: "frère", speak: "breur" },
  { upper: "OU", lower: "ou", name: "Ou", hint: "Comme le ou de « loup ».", example: "dour", exampleBack: "eau", speak: "dour" },
];

const bretonWords = [
  ["Salutations", "Demat", "dématt", "Bonjour"],
  ["Salutations", "Kenavo", "kénavo", "Au revoir"],
  ["Salutations", "Nozvezh vat", "nozvèss vatt", "Bonne nuit"],
  ["Salutations", "Mont a ra ?", "monn a ra", "Comment ça va ?"],
  ["Mots utiles", "Trugarez", "trugarèz", "Merci"],
  ["Mots utiles", "Mar plij", "mar pli", "S'il vous plaît"],
  ["Mots utiles", "Ya", "ya", "Oui"],
  ["Mots utiles", "Nann", "nann", "Non"],
  ["Mots utiles", "Digarezit", "digarèzitt", "Excusez-moi"],
  ["Mots utiles", "Brezhoneg", "brézoneg", "Le breton"],
  ["Nourriture", "Dour", "dour", "Eau"],
  ["Nourriture", "Bara", "bara", "Pain"],
  ["Nourriture", "Laezh", "laèz", "Lait"],
  ["Nourriture", "Aval", "aval", "Pomme"],
  ["Nourriture", "Te", "té", "Thé"],
  ["Nourriture", "Kafe", "kafé", "Café"],
  ["Chiffres", "Unan", "ünan", "Un"],
  ["Chiffres", "Daou", "daou", "Deux"],
  ["Chiffres", "Tri", "tri", "Trois"],
  ["Chiffres", "Dek", "dek", "Dix"],
].map(([category, front, phonetic, back]) => ({ category, front, phonetic, back, speak: front }));

const bretonGrammar = [
  {
    title: "L'article ar, al, an",
    rule: "Le défini change selon le mot qui suit : ar bara, al laezh, an aval.",
    examples: [
      { say: "ar bara", target: "Ar bara", gloss: "le pain" },
      { say: "an aval", target: "An aval", gloss: "la pomme" },
    ],
  },
  {
    title: "Un, une : ur, ul, un",
    rule: "L'indéfini suit la même idée : ur bara, ul laezh, un aval.",
    examples: [
      { say: "ur bara", target: "Ur bara", gloss: "un pain" },
      { say: "un aval", target: "Un aval", gloss: "une pomme" },
    ],
  },
  {
    title: "Ya et nann",
    rule: "Ya veut dire oui. Nann veut dire non. Ils se placent en tête.",
    examples: [
      { say: "ya, trugarez", target: "Ya, trugarez", gloss: "oui, merci" },
      { say: "nann, trugarez", target: "Nann, trugarez", gloss: "non, merci" },
    ],
  },
];

const courses = {
  "fr-ru": {
    id: "fr-ru",
    ui: "fr",
    voice: "ru-RU",
    title: "Russe",
    forWhom: "Si vous parlez français",
    lines: {
      lobby: "Une lettre, une règle, puis les mots qui reviennent.",
      grammar: "Voici la règle du jour. Écoutez les deux exemples.",
      alphabet: "Écoutez la lettre, puis répétez-la tout bas.",
      vocab: "Si le mot vous échappe, dites « À revoir ». Il reviendra.",
      warmup: "Trois mots déjà vus, pour reprendre pied.",
      discover: "Mot nouveau. Écoutez, regardez l’écriture, puis le sens.",
      quiz: "Sans aide. Choisissez le mot juste.",
      dialogue: "Deux répliques, seulement avec les mots de la séance.",
      done: "Assez pour aujourd’hui. Demain, ces mots reviennent.",
    },
    alphabet: russianAlphabet,
    words: russianWords,
    grammar: russianGrammar,
    teachers: [
      { id: "nina", name: "Nina Sokolova", role: "Professeure de russe", portrait: "nina.jpg", hello: "Je m’appelle Nina. Neuf cartes, pas davantage. Les mots reviennent tout seuls." },
      { id: "pavel", name: "Pavel Volkov", role: "Professeur de russe", portrait: "pavel.jpg", hello: "Je m’appelle Pavel. Neuf cartes, puis on s’arrête. Les mots reviennent tout seuls." },
    ],
    labels: {
      front: "Russe",
      back: "Français",
      start: "Commencer",
      backHome: "Les langues",
      listen: "Écouter",
      flip: "Retourner",
      nextLetter: "Lettre suivante",
      toGrammar: "La grammaire",
      grammarStep: "Grammaire",
      toWords: "Vers les mots",
      again: "À revoir",
      know: "Je le sais",
      toSpeak: "Vers la prononciation",
      repeated: "J’ai répété",
      finish: "Terminer",
      doneHome: "Les langues",
      review: "Révision",
      fresh: "Nouveau",
      session: "Séance du jour",
      already: "Séance déjà faite aujourd’hui",
      finished: "Séance terminée",
      againTitle: "On peut recommencer",
      ready: "Cinq minutes",
      lobbyBody: "Neuf cartes au plus : trois révisions, trois mots nouveaux, trois questions.",
      doneTitle: "À demain",
      held: (time) => `Vous avez tenu ${time}. Je vous redonnerai ces mots.`,
      streak: (n) => `${n} jour${n > 1 ? "s" : ""} d’affilée`,
      letterStep: (i, n) => `Alphabet · ${i} sur ${n}`,
      wordStep: (i, n) => `Mots · ${i} sur ${n}`,
      speakStep: (i, n) => `Prononciation · ${i} sur ${n}`,
      warmupStep: (i, n) => `Échauffement · ${i} sur ${n}`,
      discoverStep: (i, n) => `Découverte · ${i} sur ${n}`,
      quizStep: (i, n) => `Ancrage · ${i} sur ${n}`,
      dialogueStep: "Dialogue",
      translate: (meaning) => `Comment dit-on « ${meaning} » ?`,
      cloze: (meaning) => `Complétez : « ___ », c’est ${meaning}.`,
      continueLabel: "Continuer",
      you: "Vous",
      jokerNote: "Un jour a sauté. Le joker a gardé la série.",
      jokerPending: (n) => `Hier a sauté. Finissez aujourd’hui : le joker garde vos ${n} jours.`,
      checkpointLead: "Sept séances. Cinq questions, sans piège.",
      checkpointToday: "Aujourd’hui, le contrôle des sept séances. Une carte à la fin.",
      checkpointStep: (i, n) => `Contrôle · ${i} sur ${n}`,
      nextCheck: (n) => `Prochain contrôle à la séance ${n}`,
      rewardLead: (name) => `${name} vous remet cette carte.`,
      rewardTitle: (level) => `Palier ${level}`,
      rewardBody: "Elle reste sur ce téléphone, avec votre série.",
      plan: (warmup, fresh, quiz) => `Échauffement ${warmup} · nouveaux ${fresh} · quiz ${quiz}`,
      install: "iPhone : Partager, puis Sur l’écran d’accueil. Android : menu du navigateur, puis Installer l’application.",
      noVoice: "La voix n’est pas disponible ici. Suivez l’écriture.",
    },
  },
  "ru-fr": {
    id: "ru-fr",
    ui: "ru",
    voice: "fr-FR",
    title: "Français",
    forWhom: "Если вы говорите по-русски",
    lines: {
      lobby: "Одна буква, одно правило, затем слова, которые нужно вернуть.",
      grammar: "Правило дня. Послушайте два примера.",
      alphabet: "Слушайте букву и повторите её тихо.",
      vocab: "Если слово ушло, нажмите «Повторить». Оно вернётся.",
      warmup: "Три знакомых слова, чтобы войти в урок.",
      discover: "Новое слово. Слушайте и смотрите запись.",
      quiz: "Без подсказки. Выберите верное слово.",
      dialogue: "Две реплики, только со словами этого урока.",
      done: "На сегодня достаточно. Завтра эти слова вернутся.",
    },
    alphabet: frenchAlphabet,
    words: frenchWords,
    grammar: frenchGrammar,
    teachers: [
      { id: "sophie", name: "Sophie Montaigne", role: "Professeure de français", portrait: "sophie.jpg", hello: "Меня зовут Софи Монтень. Девять карточек, и на сегодня хватит." },
      { id: "louis", name: "Louis Beaumont", role: "Professeur de français", portrait: "louis.jpg", hello: "Меня зовут Луи Бомон. Девять карточек, и на сегодня хватит." },
    ],
    labels: {
      front: "Французский",
      back: "Русский",
      start: "Начать",
      backHome: "Языки",
      listen: "Слушать",
      flip: "Перевернуть",
      nextLetter: "Следующая буква",
      toGrammar: "Грамматика",
      grammarStep: "Грамматика",
      toWords: "К словам",
      again: "Повторить",
      know: "Знаю",
      toSpeak: "К произношению",
      repeated: "Я повторил",
      finish: "Закончить",
      doneHome: "Языки",
      review: "Повтор",
      fresh: "Новое",
      session: "Урок дня",
      already: "Сегодняшний урок уже сделан",
      finished: "Урок закончен",
      againTitle: "Можно ещё раз",
      ready: "Пять минут",
      lobbyBody: "Не больше девяти карточек : повтор, новые слова, короткая проверка.",
      doneTitle: "До завтра",
      held: (time) => `Вы занимались ${time}. Я верну эти слова.`,
      streak: (n) => {
        const n10 = n % 10;
        const n100 = n % 100;
        const word = n10 === 1 && n100 !== 11 ? "день" : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? "дня" : "дней";
        return `${n} ${word} подряд`;
      },
      letterStep: (i, n) => `Буквы · ${i} из ${n}`,
      wordStep: (i, n) => `Слова · ${i} из ${n}`,
      speakStep: (i, n) => `Произношение · ${i} из ${n}`,
      warmupStep: (i, n) => `Разминка · ${i} из ${n}`,
      discoverStep: (i, n) => `Новые слова · ${i} из ${n}`,
      quizStep: (i, n) => `Проверка · ${i} из ${n}`,
      dialogueStep: "Диалог",
      translate: (meaning) => `Как сказать « ${meaning} »?`,
      cloze: (meaning) => `Дополните : « ___ » — ${meaning}.`,
      continueLabel: "Дальше",
      you: "Вы",
      jokerNote: "Один день пропущен. Серия сохранена.",
      jokerPending: (n) => `Вчера пропущено. Джокер сохранит серию (${n}), если вы закончите сегодня.`,
      checkpointLead: "Семь занятий. Пять вопросов, без ловушки.",
      checkpointToday: "Сегодня проверка за семь занятий. В конце карточка.",
      checkpointStep: (i, n) => `Контроль · ${i} из ${n}`,
      nextCheck: (n) => `Следующая проверка на занятии ${n}`,
      rewardLead: (name) => `${name} дарит вам эту карточку.`,
      rewardTitle: (level) => `Ступень ${level}`,
      rewardBody: "Она остаётся на этом телефоне, вместе с серией.",
      plan: (warmup, fresh, quiz) => `Разминка ${warmup} · новые ${fresh} · проверка ${quiz}`,
      install: "iPhone: Поделиться → На экран «Домой». Android: меню браузера → Установить.",
      noVoice: "Голос здесь недоступен. Смотрите на запись произношения.",
    },
  },
  "fr-br": {
    id: "fr-br",
    ui: "fr",
    voice: "br",
    title: "Breton",
    forWhom: "Si vous parlez français",
    lines: {
      lobby: "Un son, une règle, puis les mots qui reviennent.",
      grammar: "Voici la règle du jour. Écoutez les deux exemples.",
      alphabet: "Écoutez ce son, puis répétez-le tout bas.",
      vocab: "Si le mot vous échappe, dites « À revoir ». Il reviendra.",
      warmup: "Trois mots déjà vus, pour reprendre pied.",
      discover: "Mot nouveau. Écoutez, regardez l’écriture, puis le sens.",
      quiz: "Sans aide. Choisissez le mot juste.",
      dialogue: "Deux répliques, seulement avec les mots de la séance.",
      done: "Assez pour aujourd’hui. Demain, ces mots reviennent.",
    },
    alphabet: bretonAlphabet,
    words: bretonWords,
    grammar: bretonGrammar,
    teachers: [
      { id: "enora", name: "Enora Le Gall", role: "Professeure de breton", portrait: "enora.jpg", hello: "Je m’appelle Enora Le Gall. Neuf cartes, tout doucement. Les mots reviennent." },
      { id: "yann", name: "Yann Madec", role: "Professeur de breton", portrait: "yann.jpg", hello: "Je m’appelle Yann Madec. Neuf cartes, puis on s’arrête. Les mots reviennent." },
    ],
    labels: {
      front: "Breton",
      back: "Français",
      start: "Commencer",
      backHome: "Les langues",
      listen: "Écouter",
      flip: "Retourner",
      nextLetter: "Son suivant",
      toGrammar: "La grammaire",
      grammarStep: "Grammaire",
      toWords: "Vers les mots",
      again: "À revoir",
      know: "Je le sais",
      toSpeak: "Vers la prononciation",
      repeated: "J’ai répété",
      finish: "Terminer",
      doneHome: "Les langues",
      review: "Révision",
      fresh: "Nouveau",
      session: "Séance du jour",
      already: "Séance déjà faite aujourd’hui",
      finished: "Séance terminée",
      againTitle: "On peut recommencer",
      ready: "Cinq minutes",
      lobbyBody: "Neuf cartes au plus : trois révisions, trois mots nouveaux, trois questions.",
      doneTitle: "À demain",
      held: (time) => `Vous avez tenu ${time}. Je vous redonnerai ces mots.`,
      streak: (n) => `${n} jour${n > 1 ? "s" : ""} d’affilée`,
      letterStep: (i, n) => `Son · ${i} sur ${n}`,
      wordStep: (i, n) => `Mots · ${i} sur ${n}`,
      speakStep: (i, n) => `Prononciation · ${i} sur ${n}`,
      warmupStep: (i, n) => `Échauffement · ${i} sur ${n}`,
      discoverStep: (i, n) => `Découverte · ${i} sur ${n}`,
      quizStep: (i, n) => `Ancrage · ${i} sur ${n}`,
      dialogueStep: "Dialogue",
      translate: (meaning) => `Comment dit-on « ${meaning} » ?`,
      cloze: (meaning) => `Complétez : « ___ », c’est ${meaning}.`,
      continueLabel: "Continuer",
      you: "Vous",
      jokerNote: "Un jour a sauté. Le joker a gardé la série.",
      jokerPending: (n) => `Hier a sauté. Finissez aujourd’hui : le joker garde vos ${n} jours.`,
      checkpointLead: "Sept séances. Cinq questions, sans piège.",
      checkpointToday: "Aujourd’hui, le contrôle des sept séances. Une carte à la fin.",
      checkpointStep: (i, n) => `Contrôle · ${i} sur ${n}`,
      nextCheck: (n) => `Prochain contrôle à la séance ${n}`,
      rewardLead: (name) => `${name} vous remet cette carte.`,
      rewardTitle: (level) => `Palier ${level}`,
      rewardBody: "Elle reste sur ce téléphone, avec votre série.",
      plan: (warmup, fresh, quiz) => `Échauffement ${warmup} · nouveaux ${fresh} · quiz ${quiz}`,
      install: "iPhone : Partager, puis Sur l’écran d’accueil. Android : menu du navigateur, puis Installer l’application.",
      noVoice: "La voix bretonne n’est pas toujours disponible. Suivez l’écriture.",
    },
  },
};

const japaneseAlphabet = [
  { upper: "あ", lower: "ア", name: "A", hint: "Comme le a de « papa ».", example: "あめ", exampleBack: "pluie", speak: "あ" },
  { upper: "い", lower: "イ", name: "I", hint: "Comme le i de « lit ».", example: "いえ", exampleBack: "maison", speak: "い" },
  { upper: "う", lower: "ウ", name: "Ou", hint: "Comme le ou de « loup ».", example: "うみ", exampleBack: "mer", speak: "う" },
  { upper: "え", lower: "エ", name: "É", hint: "Comme le é de « été ».", example: "えき", exampleBack: "gare", speak: "え" },
  { upper: "お", lower: "オ", name: "O", hint: "Comme le o de « or ».", example: "おちゃ", exampleBack: "thé", speak: "お" },
  { upper: "か", lower: "カ", name: "Ka", hint: "K + a.", example: "かさ", exampleBack: "parapluie", speak: "か" },
  { upper: "き", lower: "キ", name: "Ki", hint: "K + i.", example: "き", exampleBack: "arbre", speak: "き" },
  { upper: "ん", lower: "ン", name: "N", hint: "Une consonne seule, en fin de syllabe.", example: "パン", exampleBack: "pain", speak: "パン" },
];

const japaneseWords = [
  ["Salutations", "こんにちは", "konnichiwa", "Bonjour", [["こ", "ko", "ko"], ["ん", "n", "n"], ["に", "ni", "ni"], ["ち", "chi", "chi"], ["は", "wa", "wa"]]],
  ["Salutations", "おはよう", "ohayou", "Bonjour (le matin)", [["お", "o", "o"], ["は", "ha", "ha"], ["よ", "yo", "yo"], ["う", "u", "ou"]]],
  ["Salutations", "さようなら", "sayounara", "Au revoir", [["さ", "sa", "sa"], ["よ", "yo", "yo"], ["う", "u", "ou"], ["な", "na", "na"], ["ら", "ra", "ra"]]],
  ["Salutations", "元気ですか", "genki desu ka", "Comment ça va ?", [["元", "gen", "origine"], ["気", "ki", "souffle"], ["で", "de", "de"], ["す", "su", "su"], ["か", "ka", "question"]]],
  ["Mots utiles", "ありがとう", "arigatou", "Merci", [["あ", "a", "a"], ["り", "ri", "ri"], ["が", "ga", "ga"], ["と", "to", "to"], ["う", "u", "ou"]]],
  ["Mots utiles", "お願いします", "onegaishimasu", "S'il vous plaît", [["お", "o", "politesse"], ["願", "gan", "souhait"], ["い", "i", "i"], ["し", "shi", "shi"], ["ま", "ma", "ma"], ["す", "su", "su"]]],
  ["Mots utiles", "はい", "hai", "Oui", [["は", "ha", "ha"], ["い", "i", "i"]]],
  ["Mots utiles", "いいえ", "iie", "Non", [["い", "i", "i"], ["い", "i", "i"], ["え", "e", "é"]]],
  ["Mots utiles", "すみません", "sumimasen", "Excusez-moi", [["す", "su", "su"], ["み", "mi", "mi"], ["ま", "ma", "ma"], ["せ", "se", "sé"], ["ん", "n", "n"]]],
  ["Nourriture", "水", "mizu", "Eau", [["水", "mizu", "eau"]]],
  ["Nourriture", "パン", "pan", "Pain", [["パ", "pa", "pa"], ["ン", "n", "n"]]],
  ["Nourriture", "牛乳", "gyuunyuu", "Lait", [["牛", "gyū", "vache"], ["乳", "nyū", "lait"]]],
  ["Nourriture", "りんご", "ringo", "Pomme", [["り", "ri", "ri"], ["ん", "n", "n"], ["ご", "go", "go"]]],
  ["Nourriture", "お茶", "ocha", "Thé", [["お", "o", "politesse"], ["茶", "cha", "thé"]]],
  ["Nourriture", "コーヒー", "koohii", "Café", [["コ", "ko", "ko"], ["ー", "—", "son long"], ["ヒ", "hi", "hi"], ["ー", "—", "son long"]]],
  ["Chiffres", "一", "ichi", "Un", [["一", "ichi", "un"]]],
  ["Chiffres", "二", "ni", "Deux", [["二", "ni", "deux"]]],
  ["Chiffres", "三", "san", "Trois", [["三", "san", "trois"]]],
  ["Chiffres", "十", "juu", "Dix", [["十", "jū", "dix"]]],
].map(([category, front, phonetic, back, glyphs]) => ({
  category,
  front,
  phonetic,
  back,
  speak: front,
  glyphs: glyphs.map(([c, p, m]) => ({ c, p, m })),
}));

const japaneseGrammar = [
  {
    title: "La particule は",
    rule: "は marque le thème de la phrase. Dans ce rôle, on la lit « wa », pas « ha ».",
    examples: [
      { say: "みずは みずです", target: "水は水です", gloss: "l'eau, c'est de l'eau", glyphs: [["水", "mizu", "eau"], ["は", "wa", "thème"], ["水", "mizu", "eau"], ["で", "de", "de"], ["す", "su", "su"]] },
      { say: "これは パンです", target: "これはパンです", gloss: "ceci est du pain", glyphs: [["こ", "ko", "ko"], ["れ", "re", "re"], ["は", "wa", "thème"], ["パ", "pa", "pa"], ["ン", "n", "n"], ["で", "de", "de"], ["す", "su", "su"]] },
    ],
  },
  {
    title: "です",
    rule: "です ferme une phrase polie. Il veut souvent dire « c'est ».",
    examples: [
      { say: "これは みずです", target: "これは水です", gloss: "c'est de l'eau", glyphs: [["こ", "ko", "ko"], ["れ", "re", "re"], ["は", "wa", "thème"], ["水", "mizu", "eau"], ["で", "de", "de"], ["す", "su", "su"]] },
      { say: "りんごです", target: "りんごです", gloss: "c'est une pomme", glyphs: [["り", "ri", "ri"], ["ん", "n", "n"], ["ご", "go", "go"], ["で", "de", "de"], ["す", "su", "su"]] },
    ],
  },
  {
    title: "La question か",
    rule: "か à la fin transforme la phrase en question.",
    examples: [
      { say: "みずですか", target: "水ですか", gloss: "c'est de l'eau ?", glyphs: [["水", "mizu", "eau"], ["で", "de", "de"], ["す", "su", "su"], ["か", "ka", "question"]] },
      { say: "げんきですか", target: "元気ですか", gloss: "comment ça va ?", glyphs: [["元", "gen", "origine"], ["気", "ki", "souffle"], ["で", "de", "de"], ["す", "su", "su"], ["か", "ka", "question"]] },
    ],
  },
];

const chineseAlphabet = [
  { upper: "mā", lower: "妈", name: "1er ton", hint: "La voix reste haute et plate.", example: "妈", exampleBack: "maman", speak: "妈" },
  { upper: "má", lower: "麻", name: "2e ton", hint: "La voix monte, comme une question.", example: "麻", exampleBack: "chanvre", speak: "麻" },
  { upper: "mǎ", lower: "马", name: "3e ton", hint: "La voix descend, puis remonte.", example: "马", exampleBack: "cheval", speak: "马" },
  { upper: "mà", lower: "骂", name: "4e ton", hint: "La voix tombe, nette.", example: "骂", exampleBack: "gronder", speak: "骂" },
  { upper: "zh", lower: "知", name: "Zh", hint: "La langue se relève, comme « dj ».", example: "知道", exampleBack: "savoir", speak: "知道" },
  { upper: "x", lower: "西", name: "X", hint: "Un s très léger, la langue vers les dents.", example: "西", exampleBack: "ouest", speak: "西" },
];

const chineseWords = [
  ["Salutations", "你好", "nǐ hǎo", "Bonjour", [["你", "nǐ", "tu"], ["好", "hǎo", "bon"]]],
  ["Salutations", "早上好", "zǎoshang hǎo", "Bonjour (le matin)", [["早", "zǎo", "tôt"], ["上", "shàng", "dessus"], ["好", "hǎo", "bon"]]],
  ["Salutations", "再见", "zàijiàn", "Au revoir", [["再", "zài", "encore"], ["见", "jiàn", "voir"]]],
  ["Salutations", "你好吗", "nǐ hǎo ma", "Comment ça va ?", [["你", "nǐ", "tu"], ["好", "hǎo", "bon"], ["吗", "ma", "est-ce que"]]],
  ["Mots utiles", "谢谢", "xièxie", "Merci", [["谢", "xiè", "remercier"], ["谢", "xiè", "remercier"]]],
  ["Mots utiles", "请", "qǐng", "S'il vous plaît", [["请", "qǐng", "prier"]]],
  ["Mots utiles", "对", "duì", "Oui", [["对", "duì", "juste"]]],
  ["Mots utiles", "不", "bù", "Non", [["不", "bù", "ne pas"]]],
  ["Mots utiles", "不好意思", "bù hǎoyìsi", "Excusez-moi", [["不", "bù", "ne pas"], ["好", "hǎo", "bon"], ["意", "yì", "idée"], ["思", "sī", "pensée"]]],
  ["Nourriture", "水", "shuǐ", "Eau", [["水", "shuǐ", "eau"]]],
  ["Nourriture", "面包", "miànbāo", "Pain", [["面", "miàn", "farine"], ["包", "bāo", "paquet"]]],
  ["Nourriture", "牛奶", "niúnǎi", "Lait", [["牛", "niú", "vache"], ["奶", "nǎi", "lait"]]],
  ["Nourriture", "苹果", "píngguǒ", "Pomme", [["苹", "píng", "pomme"], ["果", "guǒ", "fruit"]]],
  ["Nourriture", "茶", "chá", "Thé", [["茶", "chá", "thé"]]],
  ["Nourriture", "咖啡", "kāfēi", "Café", [["咖", "kā", "son ka"], ["啡", "fēi", "son fei"]]],
  ["Chiffres", "一", "yī", "Un", [["一", "yī", "un"]]],
  ["Chiffres", "二", "èr", "Deux", [["二", "èr", "deux"]]],
  ["Chiffres", "三", "sān", "Trois", [["三", "sān", "trois"]]],
  ["Chiffres", "十", "shí", "Dix", [["十", "shí", "dix"]]],
].map(([category, front, phonetic, back, glyphs]) => ({
  category,
  front,
  phonetic,
  back,
  speak: front,
  glyphs: glyphs.map(([c, p, m]) => ({ c, p, m })),
}));

const chineseGrammar = [
  {
    title: "是",
    rule: "Pas d'article, peu de conjugaison. 是 veut dire « être », « c'est ».",
    examples: [
      { say: "这是水", target: "这是水", gloss: "c'est de l'eau", glyphs: [["这", "zhè", "ceci"], ["是", "shì", "être"], ["水", "shuǐ", "eau"]] },
      { say: "我是学生", target: "我是学生", gloss: "je suis étudiant", glyphs: [["我", "wǒ", "je"], ["是", "shì", "être"], ["学", "xué", "étudier"], ["生", "shēng", "personne"]] },
    ],
  },
  {
    title: "吗",
    rule: "吗 à la fin pose une question oui ou non.",
    examples: [
      { say: "你好吗", target: "你好吗", gloss: "comment ça va ?", glyphs: [["你", "nǐ", "tu"], ["好", "hǎo", "bon"], ["吗", "ma", "est-ce que"]] },
      { say: "这是水吗", target: "这是水吗", gloss: "c'est de l'eau ?", glyphs: [["这", "zhè", "ceci"], ["是", "shì", "être"], ["水", "shuǐ", "eau"], ["吗", "ma", "est-ce que"]] },
    ],
  },
  {
    title: "不",
    rule: "不 se place devant le verbe pour dire non.",
    examples: [
      { say: "我不是", target: "我不是", gloss: "je ne suis pas", glyphs: [["我", "wǒ", "je"], ["不", "bù", "ne pas"], ["是", "shì", "être"]] },
      { say: "这不是面包", target: "这不是面包", gloss: "ce n'est pas du pain", glyphs: [["这", "zhè", "ceci"], ["不", "bù", "ne pas"], ["是", "shì", "être"], ["面", "miàn", "farine"], ["包", "bāo", "paquet"]] },
    ],
  },
];

const arabicAlphabet = [
  { upper: "ا", lower: "a", name: "Alif", hint: "Porte le a, ou allonge la voyelle.", example: "أب", exampleBack: "père", speak: "أب" },
  { upper: "ب", lower: "b", name: "Ba", hint: "Comme le b de « beau ». Un point en dessous.", example: "باب", exampleBack: "porte", speak: "باب" },
  { upper: "ت", lower: "t", name: "Ta", hint: "Comme le t. Deux points au-dessus.", example: "توت", exampleBack: "mûre", speak: "توت" },
  { upper: "ج", lower: "j", name: "Jim", hint: "Comme le j de « jour ». Un point en dessous.", example: "جميل", exampleBack: "beau", speak: "جميل" },
  { upper: "ح", lower: "h", hint: "Un h soufflé, du fond de la gorge.", name: "Ha", example: "حليب", exampleBack: "lait", speak: "حليب" },
  { upper: "د", lower: "d", name: "Dal", hint: "Comme le d de « dos ».", example: "دار", exampleBack: "maison", speak: "دار" },
  { upper: "ر", lower: "r", name: "Ra", hint: "Un r roulé.", example: "رز", exampleBack: "riz", speak: "رز" },
  { upper: "م", lower: "m", name: "Mim", hint: "Comme le m de « mer ».", example: "ماء", exampleBack: "eau", speak: "ماء" },
];

const arabicWords = [
  ["Salutations", "مرحبا", "marhaban", "Bonjour", [["م", "m", "m"], ["ر", "r", "r"], ["ح", "h", "h"], ["ب", "b", "b"], ["ا", "a", "a"]]],
  ["Salutations", "السلام عليكم", "salam alaykoum", "Bonjour (formel)", [["السلام", "as-salam", "la paix"], ["عليكم", "alaykoum", "sur vous"]]],
  ["Salutations", "صباح الخير", "sabah al-khayr", "Bonjour (le matin)", [["صباح", "sabah", "matin"], ["الخير", "al-khayr", "le bien"]]],
  ["Salutations", "مع السلامة", "ma'a s-salama", "Au revoir", [["مع", "ma'a", "avec"], ["السلامة", "as-salama", "la sécurité"]]],
  ["Salutations", "كيف الحال", "kayfa al-hal", "Comment ça va ?", [["كيف", "kayfa", "comment"], ["الحال", "al-hal", "l'état"]]],
  ["Mots utiles", "شكرا", "shoukran", "Merci", [["ش", "ch", "ch"], ["ك", "k", "k"], ["ر", "r", "r"], ["ا", "a", "a"]]],
  ["Mots utiles", "من فضلك", "min fadlik", "S'il vous plaît", [["من", "min", "de"], ["فضلك", "fadlik", "ta faveur"]]],
  ["Mots utiles", "نعم", "na'am", "Oui", [["ن", "n", "n"], ["ع", "ʿ", "ʿ"], ["م", "m", "m"]]],
  ["Mots utiles", "لا", "la", "Non", [["ل", "l", "l"], ["ا", "a", "a"]]],
  ["Mots utiles", "عفوا", "afwan", "Excusez-moi", [["ع", "ʿ", "ʿ"], ["ف", "f", "f"], ["و", "w", "ou"], ["ا", "a", "a"]]],
  ["Nourriture", "ماء", "ma'", "Eau", [["م", "m", "m"], ["ا", "a", "a"], ["ء", "ʾ", "coup de glotte"]]],
  ["Nourriture", "خبز", "khoubz", "Pain", [["خ", "kh", "kh"], ["ب", "b", "b"], ["ز", "z", "z"]]],
  ["Nourriture", "حليب", "halib", "Lait", [["ح", "h", "h"], ["ل", "l", "l"], ["ي", "i", "i"], ["ب", "b", "b"]]],
  ["Nourriture", "تفاحة", "touffaha", "Pomme", [["ت", "t", "t"], ["ف", "f", "f"], ["ا", "a", "a"], ["ح", "h", "h"], ["ة", "a", "a"]]],
  ["Nourriture", "شاي", "shay", "Thé", [["ش", "ch", "ch"], ["ا", "a", "a"], ["ي", "i", "i"]]],
  ["Nourriture", "قهوة", "qahwa", "Café", [["ق", "q", "q"], ["ه", "h", "h"], ["و", "w", "ou"], ["ة", "a", "a"]]],
  ["Chiffres", "واحد", "wahid", "Un", [["و", "w", "ou"], ["ا", "a", "a"], ["ح", "h", "h"], ["د", "d", "d"]]],
  ["Chiffres", "اثنان", "ithnan", "Deux", [["ا", "i", "i"], ["ث", "th", "th"], ["ن", "n", "n"], ["ا", "a", "a"], ["ن", "n", "n"]]],
  ["Chiffres", "ثلاثة", "thalatha", "Trois", [["ث", "th", "th"], ["ل", "l", "l"], ["ا", "a", "a"], ["ث", "th", "th"], ["ة", "a", "a"]]],
  ["Chiffres", "عشرة", "ashara", "Dix", [["ع", "ʿ", "ʿ"], ["ش", "ch", "ch"], ["ر", "r", "r"], ["ة", "a", "a"]]],
].map(([category, front, phonetic, back, glyphs]) => ({
  category,
  front,
  phonetic,
  back,
  speak: front,
  glyphs: glyphs.map(([c, p, m]) => ({ c, p, m })),
}));

const arabicGrammar = [
  {
    title: "L'article ال",
    rule: "ال se colle devant le nom pour dire « le » ou « la ». الماء, c'est l'eau.",
    examples: [
      { say: "الماء", target: "الماء", gloss: "l'eau", glyphs: [["ال", "al", "le"], ["ماء", "mā'", "eau"]] },
      { say: "الخبز", target: "الخبز", gloss: "le pain", glyphs: [["ال", "al", "le"], ["خبز", "khoubz", "pain"]] },
    ],
  },
  {
    title: "Pas de verbe être",
    rule: "Au présent, on ne dit pas « être ». أنا veut dire je. هذا ماء : ceci est de l'eau.",
    examples: [
      { say: "أنا", target: "أنا", gloss: "je", glyphs: [["أ", "a", "a"], ["ن", "n", "n"], ["ا", "ā", "a long"]] },
      { say: "هذا ماء", target: "هذا ماء", gloss: "ceci est de l'eau", glyphs: [["هذا", "hādhā", "ceci"], ["ماء", "mā'", "eau"]] },
    ],
  },
  {
    title: "هل",
    rule: "هل en tête de phrase pose une question oui ou non.",
    examples: [
      { say: "هل هذا ماء", target: "هل هذا ماء؟", gloss: "est-ce de l'eau ?", glyphs: [["هل", "hal", "est-ce que"], ["هذا", "hādhā", "ceci"], ["ماء", "mā'", "eau"]] },
      { say: "هل أنت بخير", target: "هل أنت بخير؟", gloss: "est-ce que ça va ?", glyphs: [["هل", "hal", "est-ce que"], ["أنت", "anta", "tu"], ["بخير", "bi-khayr", "bien"]] },
    ],
  },
];

function courseInFrench(front) {
  return {
    front,
    back: "Français",
    start: "Commencer",
    backHome: "Les langues",
    listen: "Écouter",
    flip: "Retourner",
    nextLetter: "Son suivant",
    toGrammar: "La grammaire",
    grammarStep: "Grammaire",
    toWords: "Vers les mots",
    again: "À revoir",
    know: "Je le sais",
    toSpeak: "Vers la prononciation",
    repeated: "J’ai répété",
    finish: "Terminer",
    doneHome: "Les langues",
    review: "Révision",
    fresh: "Nouveau",
    session: "Séance du jour",
    already: "Séance déjà faite aujourd’hui",
    finished: "Séance terminée",
    againTitle: "On peut recommencer",
    ready: "Cinq minutes",
    lobbyBody: "Neuf cartes au plus : trois révisions, trois mots nouveaux, trois questions.",
    doneTitle: "À demain",
    held: (time) => `Vous avez tenu ${time}. Je vous redonnerai ces mots.`,
    streak: (n) => `${n} jour${n > 1 ? "s" : ""} d’affilée`,
    letterStep: (i, n) => `Son · ${i} sur ${n}`,
    wordStep: (i, n) => `Mots · ${i} sur ${n}`,
    speakStep: (i, n) => `Prononciation · ${i} sur ${n}`,
    warmupStep: (i, n) => `Échauffement · ${i} sur ${n}`,
    discoverStep: (i, n) => `Découverte · ${i} sur ${n}`,
    quizStep: (i, n) => `Ancrage · ${i} sur ${n}`,
    dialogueStep: "Dialogue",
    translate: (meaning) => `Comment dit-on « ${meaning} » ?`,
    cloze: (meaning) => `Complétez : « ___ », c’est ${meaning}.`,
    continueLabel: "Continuer",
    you: "Vous",
    jokerNote: "Un jour a sauté. Le joker a gardé la série.",
    jokerPending: (n) => `Hier a sauté. Finissez aujourd’hui : le joker garde vos ${n} jours.`,
    checkpointLead: "Sept séances. Cinq questions, sans piège.",
    checkpointToday: "Aujourd’hui, le contrôle des sept séances. Une carte à la fin.",
    checkpointStep: (i, n) => `Contrôle · ${i} sur ${n}`,
    nextCheck: (n) => `Prochain contrôle à la séance ${n}`,
    rewardLead: (name) => `${name} vous remet cette carte.`,
    rewardTitle: (level) => `Palier ${level}`,
    rewardBody: "Elle reste sur ce téléphone, avec votre série.",
    plan: (warmup, fresh, quiz) => `Échauffement ${warmup} · nouveaux ${fresh} · quiz ${quiz}`,
    install: "iPhone : Partager, puis Sur l’écran d’accueil. Android : menu du navigateur, puis Installer l’application.",
    noVoice: "La voix n’est pas disponible ici. Suivez l’écriture.",
  };
}

Object.assign(courses, {
  "fr-ja": {
    id: "fr-ja",
    ui: "fr",
    voice: "ja-JP",
    title: "Japonais",
    forWhom: "Si vous parlez français",
    lines: {
      lobby: "Un son, une règle, puis les mots qui reviennent.",
      grammar: "Voici la règle du jour. Écoutez les deux exemples.",
      alphabet: "Écoutez ce son, puis répétez-le tout bas.",
      vocab: "Si le mot vous échappe, dites « À revoir ». Il reviendra.",
      warmup: "Trois mots déjà vus, pour reprendre pied.",
      discover: "Mot nouveau. Écoutez, regardez l’écriture, puis le sens.",
      quiz: "Sans aide. Choisissez le mot juste.",
      dialogue: "Deux répliques, seulement avec les mots de la séance.",
      done: "Assez pour aujourd’hui. Demain, ces mots reviennent.",
    },
    alphabet: japaneseAlphabet,
    words: japaneseWords,
    grammar: japaneseGrammar,
    teachers: [
      { id: "hana", name: "Hana Mori", role: "Professeure de japonais", portrait: "hana.jpg", hello: "Je m’appelle Hana Mori. Neuf cartes, pas davantage. Écoutez, puis répondez." },
      { id: "haruto", name: "Haruto Sato", role: "Professeur de japonais", portrait: "haruto.jpg", hello: "Je m’appelle Haruto Sato. Neuf cartes, puis on s’arrête." },
    ],
    labels: courseInFrench("Japonais"),
  },
  "fr-zh": {
    id: "fr-zh",
    ui: "fr",
    voice: "zh-CN",
    title: "Chinois",
    forWhom: "Si vous parlez français",
    lines: {
      lobby: "Un ton, une règle, puis les mots qui reviennent.",
      grammar: "Voici la règle du jour. Écoutez les deux exemples.",
      alphabet: "Écoutez ce ton, puis répétez-le tout bas.",
      vocab: "Si le mot vous échappe, dites « À revoir ». Il reviendra.",
      warmup: "Trois mots déjà vus, pour reprendre pied.",
      discover: "Mot nouveau. Écoutez, regardez l’écriture, puis le sens.",
      quiz: "Sans aide. Choisissez le mot juste.",
      dialogue: "Deux répliques, seulement avec les mots de la séance.",
      done: "Assez pour aujourd’hui. Demain, ces mots reviennent.",
    },
    alphabet: chineseAlphabet,
    words: chineseWords,
    grammar: chineseGrammar,
    teachers: [
      { id: "mei", name: "Mei Lin", role: "Professeure de chinois", portrait: "mei.jpg", hello: "Je m’appelle Mei Lin. Neuf cartes. Écoutez le ton, puis choisissez le mot juste." },
      { id: "chen", name: "Wei Chen", role: "Professeur de chinois", portrait: "chen.jpg", hello: "Je m’appelle Wei Chen. Neuf cartes, puis on s’arrête." },
    ],
    labels: courseInFrench("Chinois"),
  },
  "fr-ar": {
    id: "fr-ar",
    ui: "fr",
    voice: "ar",
    dir: "rtl",
    title: "Arabe",
    forWhom: "Si vous parlez français",
    lines: {
      lobby: "Une lettre, une règle, puis les mots qui reviennent.",
      grammar: "Voici la règle du jour. Écoutez les deux exemples.",
      alphabet: "L’arabe se lit de droite à gauche. Écoutez la lettre.",
      vocab: "Si le mot vous échappe, dites « À revoir ». Il reviendra.",
      warmup: "Trois mots déjà vus, pour reprendre pied.",
      discover: "Mot nouveau. Écoutez, regardez l’écriture, puis le sens.",
      quiz: "Sans aide. Choisissez le mot juste.",
      dialogue: "Deux répliques, seulement avec les mots de la séance.",
      done: "Assez pour aujourd’hui. Demain, ces mots reviennent.",
    },
    alphabet: arabicAlphabet,
    words: arabicWords,
    grammar: arabicGrammar,
    teachers: [
      { id: "layla", name: "Layla Haddad", role: "Professeure d’arabe", portrait: "layla.jpg", hello: "Je m’appelle Layla Haddad. Neuf cartes, de droite à gauche. Les mots reviennent." },
      { id: "karim", name: "Karim Nassar", role: "Professeur d’arabe", portrait: "karim.jpg", hello: "Je m’appelle Karim Nassar. Neuf cartes, puis on s’arrête." },
    ],
    labels: courseInFrench("Arabe"),
  },
});

const soon = [];

const stage = document.getElementById("stage");
const actions = document.getElementById("actions");
const lineEl = document.getElementById("line");
const stepEl = document.getElementById("step");
const clockEl = document.getElementById("clock");
const coachEl = document.getElementById("coach");
const portraitEl = document.getElementById("portrait");
const whoEl = document.getElementById("who");
const roleEl = document.getElementById("role");
const brandSub = document.getElementById("brand-sub");

let course = null;
let teacher = null;
let screen = "pick";
let session = null;
let startedAt = null;
let timerId = null;
let finishedSeconds = null;

function loadProgress(id) {
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(`yezh-${id}`)) || {};
  } catch {
    data = {};
  }
  return {
    streak: 0,
    lastDone: "",
    cards: {},
    nextLetter: 0,
    letterCycle: 0,
    rewards: [],
    ...data,
    sessionsDone: typeof data.sessionsDone === "number" ? data.sessionsDone : (data.streak || 0),
  };
}

function saveProgress(data) {
  localStorage.setItem(`yezh-${course.id}`, JSON.stringify(data));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function seenWordIds(progress) {
  return Object.keys(progress.cards || {}).map(Number).filter((index) => course.words[index]);
}

function previewSession(progress) {
  if (sameDay(progress.savedDay, todayKey()) && progress.savedSession?.version === 2) return progress.savedSession;
  if (checkpointDue(progress, todayKey())) {
    return buildCheckpoint({
      wordCount: course.words.length,
      seenIds: seenWordIds(progress),
      cards: progress.cards,
      seed: `${course.id}:${todayKey()}:check`,
    });
  }
  return buildDaySession({
    wordCount: course.words.length,
    cards: progress.cards,
    today: todayKey(),
    seed: `${course.id}:${todayKey()}`,
  });
}

function openCourse() {
  const progress = loadProgress(course.id);
  const saved = sameDay(progress.savedDay, todayKey()) && progress.savedSession?.version === 2;
  session = saved ? progress.savedSession : previewSession(progress);
  if (!saved) {
    progress.savedDay = todayKey();
    progress.savedSession = session;
    saveProgress(progress);
  }
}

function persistSession() {
  const progress = loadProgress(course.id);
  progress.savedDay = todayKey();
  progress.savedSession = session;
  saveProgress(progress);
}

function commitGrade(index, knew, fromQuiz = false) {
  const progress = loadProgress(course.id);
  const introduced = (session.fresh || []).includes(index);
  let prior = progress.cards[index];
  if (fromQuiz) {
    const existing = progress.cards[index];
    const level = session.startLevels?.[index] || existing?.box_level || 0;
    prior = level
      ? { box_level: level, next_review_date: existing?.next_review_date || todayKey(), touched: "" }
      : null;
  }
  progress.cards[index] = gradeCard(prior, {
    knew,
    introducedToday: introduced,
    today: todayKey(),
  });
  progress.savedDay = todayKey();
  progress.savedSession = session;
  saveProgress(progress);
}

function setGauge() {
  const gauge = document.getElementById("gauge");
  const fill = document.getElementById("gauge-fill");
  if (!gauge || !fill) return;
  const visible = session && screen !== "pick" && screen !== "lobby";
  gauge.hidden = !visible;
  const total = session ? sessionLength(session) : 0;
  const done = session?.doneCount || 0;
  fill.style.width = total ? `${Math.min(100, Math.round((done / total) * 100))}%` : "0%";
  gauge.setAttribute("aria-valuemax", String(total || 9));
  gauge.setAttribute("aria-valuenow", String(Math.min(done, total)));
  if (course) gauge.setAttribute("aria-label", course.labels.ready);
}

let currentUtterance = null;

function speak(text) {
  if (!("speechSynthesis" in window) || !text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = course.voice;
  utterance.rate = 0.82;
  const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith(course.voice.slice(0, 2)));
  if (voice) utterance.voice = voice;
  currentUtterance = utterance;
  const say = () => {
    speechSynthesis.resume();
    speechSynthesis.speak(utterance);
  };
  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
    setTimeout(say, 80);
    return;
  }
  say();
}

function glyphRow(glyphs) {
  if (!glyphs || !glyphs.length) return "";
  return `<span class="glyphs">${glyphs.map((glyph) => {
    const item = Array.isArray(glyph) ? { c: glyph[0], p: glyph[1], m: glyph[2] } : glyph;
    return `<span class="glyph"><b ${scriptAttrs()}>${escapeHtml(item.c)}</b><i>${escapeHtml(item.p)}</i><small>${escapeHtml(item.m)}</small></span>`;
  }).join("")}</span>`;
}

function scriptAttrs() {
  const dir = course.dir === "rtl" ? ' dir="rtl"' : "";
  return `lang="${course.voice.slice(0, 2)}"${dir}`;
}

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function tick() {
  if (!startedAt) return;
  clockEl.textContent = formatClock(Math.floor((Date.now() - startedAt) / 1000));
}

function startTimer() {
  if (startedAt) return;
  startedAt = Date.now();
  clockEl.hidden = false;
  clockEl.textContent = "0:00";
  timerId = setInterval(tick, 1000);
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
  if (startedAt) finishedSeconds = Math.floor((Date.now() - startedAt) / 1000);
  clockEl.hidden = false;
  clockEl.textContent = formatClock(finishedSeconds || 0);
}

function setActions(buttons) {
  actions.innerHTML = buttons.map((button) => (
    `<button class="btn ${button.primary ? "btn-primary" : "btn-ghost"} ${button.wide ? "wide" : ""}" type="button" data-action="${button.action}">${button.label}</button>`
  )).join("");
}

function showTeacher(line) {
  document.querySelector(".app").classList.add("in-lesson");
  document.getElementById("figure-wrap").hidden = false;
  coachEl.hidden = false;
  portraitEl.src = teacher.portrait;
  portraitEl.alt = teacher.name;
  whoEl.textContent = teacher.name;
  roleEl.textContent = teacher.role;
  lineEl.textContent = line;
  brandSub.textContent = course.title;
  document.documentElement.lang = course.ui;
}

function dayLetter(progress) {
  const past = (progress.nextLetter || 0) >= course.alphabet.length;
  const index = past ? (progress.letterCycle || 0) % course.alphabet.length : (progress.nextLetter || 0);
  return course.alphabet[index];
}

function dayGrammar() {
  return course.grammar[Math.floor(Date.now() / 86400000) % course.grammar.length];
}

function readLast() {
  try {
    return JSON.parse(localStorage.getItem("yezh-last")) || null;
  } catch {
    return null;
  }
}

function rememberLast() {
  localStorage.setItem("yezh-last", JSON.stringify({ courseId: course.id, teacherId: teacher.id }));
}

function resumeLine(item, person) {
  const first = person.name.split(" ")[0];
  if (item.ui === "ru") return `Продолжить ${item.title.toLowerCase()} с ${first}`;
  return `Reprendre mon ${item.title.toLowerCase()} avec ${first}`;
}

function summaryLine(worked, again, ui) {
  if (ui === "ru") return `${worked} слов за занятие, ${again} на завтра.`;
  const words = worked > 1 ? "mots travaillés" : "mot travaillé";
  return `${worked} ${words}, ${again} à revoir demain.`;
}

function countTomorrow(progress) {
  const tomorrow = todayKey();
  const ids = new Set([...(session.warmup || []), ...(session.fresh || []), ...(session.quiz || [])]);
  let again = 0;
  const due = addDaysKey(tomorrow);
  ids.forEach((id) => {
    const card = progress.cards[id];
    if (card && card.next_review_date === due) again += 1;
  });
  return { worked: ids.size, again };
}

function addDaysKey(today) {
  const [year, month, day] = today.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1);
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${date.getUTCFullYear()}-${m}-${d}`;
}
function showPick() {
  course = null;
  teacher = null;
  screen = "pick";
  document.querySelector(".app").classList.remove("in-lesson");
  document.getElementById("figure-wrap").hidden = true;
  coachEl.hidden = true;
  clockEl.hidden = true;
  stepEl.textContent = "";
  brandSub.textContent = "langue, en breton";
  document.documentElement.lang = "fr";
  const blocks = Object.values(courses).map((item) => `
    <article class="lang-block">
      <h2>${item.title}</h2>
      <p>${item.forWhom}</p>
      <div class="pair">
        ${item.teachers.map((person) => `
          <button type="button" data-course="${item.id}" data-teacher="${person.id}">
            <img src="${person.portrait}" alt="">
            <strong>${person.name}</strong>
          </button>
        `).join("")}
      </div>
    </article>
  `).join("");
  const last = readLast();
  const lastCourse = last && courses[last.courseId];
  const lastTeacher = lastCourse && lastCourse.teachers.find((person) => person.id === last.teacherId);
  const resume = lastCourse && lastTeacher ? `
    <button class="btn btn-primary wide resume" type="button" data-course="${lastCourse.id}" data-teacher="${lastTeacher.id}">
      <img src="${lastTeacher.portrait}" alt="">
      <span>${resumeLine(lastCourse, lastTeacher)}</span>
    </button>
    <button class="btn btn-ghost wide" type="button" data-show-langs>Les autres langues</button>
  ` : "";
  stage.innerHTML = `
    <article class="panel">
      <h2>${resume ? "Bon retour" : "Choisissez qui vous guide"}</h2>
      <p>${resume ? "La séance d’hier vous attend. Les autres langues restent là." : "Une fille ou un garçon, pour cinq minutes. Neuf cartes : révision, mots nouveaux, quiz. Toutes les sept séances, un contrôle, puis une carte du guide."}</p>
      ${resume}
    </article>
    <div class="courses" id="all-langs" ${resume ? "hidden" : ""}>${blocks}</div>
    <p class="install">
      <button type="button" data-export>Emporter ma progression</button>
      <button type="button" data-import>Reprendre une sauvegarde</button>
    </p>
    <input id="import-file" type="file" accept="application/json" hidden>
  `;
  setActions([]);
  setGauge();
}

function showLobby() {
  screen = "lobby";
  const progress = loadProgress(course.id);
  const plan = previewSession(progress);
  const doneToday = sameDay(progress.lastDone, todayKey());
  const letter = dayLetter(progress);
  const grammar = dayGrammar();
  const gap = progress.lastDone ? daysBetween(progress.lastDone, todayKey()) : 0;
  const rewards = progress.rewards || [];
  showTeacher(teacher.hello);
  stepEl.textContent = doneToday ? course.labels.already : course.labels.session;
  clockEl.hidden = false;
  clockEl.textContent = "5 min";
  let streak = "";
  if (progress.streak && (doneToday || gap <= 1)) streak = `<p class="streak">${course.labels.streak(progress.streak)}</p>`;
  else if (progress.streak && gap === 2) streak = `<p class="streak">${course.labels.jokerPending(progress.streak)}</p>`;
  const planLine = plan.checkpoint
    ? course.labels.checkpointToday
    : `${course.labels.plan(plan.warmup.length, plan.fresh.length, plan.quiz.length)}<br>${course.labels.nextCheck(nextMilestone(progress))}`;
  const cardLine = rewards.length
    ? `<img class="reward-thumb" src="reward-${teacher.id}.jpg" alt=""><p class="hint">${course.labels.rewardTitle(rewards.length)}</p>`
    : "";
  stage.innerHTML = `
    <article class="panel">
      ${streak}
      <h2>${doneToday ? course.labels.againTitle : course.labels.ready}</h2>
      <p>${course.labels.lobbyBody}</p>
      <p class="hint">${planLine}</p>
      <p class="hint">${escapeHtml(letter.name)} · ${escapeHtml(letter.hint)}</p>
      <p class="hint">${escapeHtml(grammar.title)}</p>
      ${cardLine}
    </article>
    <p class="install">${course.labels.install}</p>
  `;
  setActions([
    { label: course.labels.backHome, action: "pick" },
    { label: course.labels.start, action: "start", primary: true },
  ]);
  setGauge();
}

function showWarmup() {
  screen = "warmup";
  const index = session.warmup[session.cursor];
  const word = course.words[index];
  showTeacher(course.lines.warmup);
  stepEl.textContent = course.labels.warmupStep(session.cursor + 1, session.warmup.length);
  stage.innerHTML = `
    <button class="card" id="card" type="button" aria-pressed="false">
      <span class="card-inner">
        <span class="face face-front">
          <span class="tag">${course.labels.review}</span>
          <span class="word" ${scriptAttrs()}>${escapeHtml(word.front)}</span>
          <span class="phonetic">${escapeHtml(word.phonetic)}</span>
          ${glyphRow(word.glyphs)}
          <span class="face-label">${course.labels.front}</span>
        </span>
        <span class="face face-back">
          <span class="tag">${escapeHtml(word.category)}</span>
          <span class="word">${escapeHtml(word.back)}</span>
          <span class="face-label">${course.labels.back}</span>
        </span>
      </span>
    </button>
  `;
  setActions([
    { label: course.labels.listen, action: "listen" },
    { label: course.labels.flip, action: "flip" },
    { label: course.labels.again, action: "again" },
    { label: course.labels.know, action: "know", primary: true },
  ]);
  setGauge();
}

function showFresh() {
  screen = "fresh";
  const index = session.fresh[session.cursor];
  const word = course.words[index];
  showTeacher(course.lines.discover);
  stepEl.textContent = course.labels.discoverStep(session.cursor + 1, session.fresh.length);
  stage.innerHTML = `
    <article class="panel">
      <p class="mark">${course.labels.fresh}</p>
      <p class="word" ${scriptAttrs()}>${escapeHtml(word.front)}</p>
      <p class="phonetic">${escapeHtml(word.phonetic)}</p>
      ${glyphRow(word.glyphs)}
      <p class="hint">${escapeHtml(word.back)}</p>
    </article>
  `;
  setActions([
    { label: course.labels.listen, action: "listen" },
    { label: course.labels.again, action: "again" },
    { label: course.labels.know, action: "know", primary: true },
  ]);
  setGauge();
  speak(word.speak);
}

function showQuiz() {
  screen = "quiz";
  session.quizAwait = false;
  const index = session.quiz[session.cursor];
  const word = course.words[index];
  const choiceIds = quizChoices(course.words.length, index, `${course.id}:${todayKey()}`);
  session.quizChoiceIds = choiceIds;
  const lead = session.checkpoint ? course.labels.checkpointLead : course.lines.quiz;
  const stepLabel = session.checkpoint
    ? course.labels.checkpointStep(session.cursor + 1, session.quiz.length)
    : course.labels.quizStep(session.cursor + 1, session.quiz.length);
  const prompt = session.cursor % 2 === 1 ? course.labels.cloze(word.back) : course.labels.translate(word.back);
  showTeacher(lead);
  stepEl.textContent = stepLabel;
  stage.innerHTML = `
    <article class="panel">
      <p class="mark">${escapeHtml(prompt)}</p>
      <div class="choices">
        ${choiceIds.map((id, choice) => `<button type="button" class="choice" data-choice="${choice}"><span ${scriptAttrs()}>${escapeHtml(course.words[id].front)}</span></button>`).join("")}
      </div>
    </article>
  `;
  setActions([{ label: course.labels.listen, action: "listen" }]);
  setGauge();
}

function sessionWords() {
  const ids = [...session.fresh, ...session.warmup, ...session.quiz];
  const first = course.words[ids[0]] || course.words[0];
  const second = course.words[ids[1]] || first;
  return { first, second };
}

function showDialogue() {
  screen = "dialogue";
  const { first, second } = sessionWords();
  const progress = loadProgress(course.id);
  const speech = tutorSpeech(teacher.id, first, second, progress.streak || 0, false);
  session.dialogueSay = first.speak;
  showTeacher(course.lines.dialogue);
  stepEl.textContent = course.labels.dialogueStep;
  stage.innerHTML = `
    <article class="panel dialogue">
      <p class="who-line">${escapeHtml(teacher.name)}</p>
      <p>${escapeHtml(speech.ask)}</p>
      <p class="who-line">${course.labels.you}</p>
      <p>${escapeHtml(speech.reply)}</p>
      <button type="button" class="example-btn" data-say="${escapeHtml(first.speak)}"><strong ${scriptAttrs()}>${escapeHtml(first.front)}</strong><span>${escapeHtml(first.back)}</span></button>
      <button type="button" class="example-btn" data-say="${escapeHtml(second.speak)}"><strong ${scriptAttrs()}>${escapeHtml(second.front)}</strong><span>${escapeHtml(second.back)}</span></button>
    </article>
  `;
  setActions([{ label: course.labels.finish, action: "next", primary: true, wide: true }]);
  setGauge();
  speak(first.speak);
}

function showDone() {
  screen = "done";
  stopTimer();
  const progress = loadProgress(course.id);
  const result = applyStreak(progress, todayKey());
  if (!result.already) {
    progress.streak = result.streak;
    progress.lastDone = result.lastDone;
    progress.lastJoker = result.usedJoker ? todayKey() : "";
    progress.sessionsDone = (progress.sessionsDone || 0) + 1;
    if (session.checkpoint) {
      const level = Math.floor(progress.sessionsDone / MILESTONE_EVERY);
      const rewards = progress.rewards || [];
      if (level > 0 && !rewards.includes(level)) progress.rewards = rewards.concat(level);
    }
    if (!sameDay(progress.letterMarked, todayKey())) {
      if ((progress.nextLetter || 0) < course.alphabet.length) progress.nextLetter = (progress.nextLetter || 0) + 1;
      else progress.letterCycle = (progress.letterCycle || 0) + 1;
      progress.letterMarked = todayKey();
    }
  }
  session.phase = "done";
  progress.savedDay = todayKey();
  progress.savedSession = session;
  saveProgress(progress);
  const { first, second } = sessionWords();
  const joker = result.usedJoker || sameDay(progress.lastJoker, todayKey());
  const speech = tutorSpeech(teacher.id, first, second, progress.streak, joker);
  showTeacher(speech.close);
  stepEl.textContent = course.labels.finished;
  const jokerLine = joker ? `<p class="hint">${course.labels.jokerNote}</p>` : "";
  const report = countTomorrow(progress);
  stage.innerHTML = `
    <article class="panel">
      <p class="streak">${course.labels.streak(progress.streak)}</p>
      <h2>${course.labels.doneTitle}</h2>
      <p>${summaryLine(report.worked, report.again, course.ui)}</p>
      <p class="hint">${course.labels.held(formatClock(finishedSeconds || 0))}</p>
      ${jokerLine}
    </article>
  `;
  setActions([{ label: course.labels.doneHome, action: "pick", primary: true, wide: true }]);
  setGauge();
}

function showReward() {
  screen = "reward";
  const progress = loadProgress(course.id);
  const done = (progress.sessionsDone || 0) + (sameDay(progress.lastDone, todayKey()) ? 0 : 1);
  const level = Math.max(1, Math.floor(done / MILESTONE_EVERY));
  showTeacher(course.labels.rewardLead(teacher.name));
  portraitEl.src = `reward-${teacher.id}.jpg`;
  stepEl.textContent = course.labels.rewardTitle(level);
  stage.innerHTML = `
    <article class="panel">
      <p class="mark">${course.labels.rewardTitle(level)}</p>
      <h2>${escapeHtml(teacher.name)}</h2>
      <p>${course.labels.rewardBody}</p>
    </article>
  `;
  setActions([{ label: course.labels.finish, action: "next", primary: true, wide: true }]);
  setGauge();
}

function renderPhase() {
  if (session.phase === "warmup") showWarmup();
  else if (session.phase === "fresh") showFresh();
  else if (session.phase === "quiz") showQuiz();
  else if (session.phase === "reward") showReward();
  else if (session.phase === "dialogue") showDialogue();
  else showDone();
}

function advancePhase() {
  if (session.checkpoint && session.phase === "quiz") {
    session.phase = "reward";
    session.cursor = 0;
    persistSession();
    showReward();
    return;
  }
  const order = ["warmup", "fresh", "quiz", "dialogue"];
  let index = order.indexOf(session.phase);
  session.cursor = 0;
  while (index < order.length - 1) {
    index += 1;
    const next = order[index];
    if (next === "dialogue" || session[next].length) {
      session.phase = next;
      persistSession();
      renderPhase();
      return;
    }
  }
  session.phase = "done";
  showDone();
}

function answerCard(knew) {
  const list = session[session.phase];
  const index = list[session.cursor];
  if (!(session.quiz || []).includes(index)) commitGrade(index, knew);
  session.doneCount += 1;
  if (session.cursor < list.length - 1) {
    session.cursor += 1;
    persistSession();
    renderPhase();
    return;
  }
  advancePhase();
}

function finishQuizCard() {
  commitGrade(session.pendingGrade.index, session.pendingGrade.knew, true);
  session.quizAwait = false;
  session.doneCount += 1;
  if (session.cursor < session.quiz.length - 1) {
    session.cursor += 1;
    persistSession();
    showQuiz();
    return;
  }
  advancePhase();
}

function pickChoice(button) {
  if (screen !== "quiz" || session.quizAwait) return;
  const choice = Number(button.dataset.choice);
  const index = session.quiz[session.cursor];
  const chosen = session.quizChoiceIds[choice];
  const knew = chosen === index;
  session.quizAwait = true;
  button.classList.add(knew ? "good" : "bad");
  if (!knew) {
    const right = [...stage.querySelectorAll("[data-choice]")].find((item) => session.quizChoiceIds[Number(item.dataset.choice)] === index);
    if (right) right.classList.add("good");
    speak(course.words[index].speak);
    session.pendingGrade = { index, knew: false };
    setActions([{ label: course.labels.continueLabel, action: "next", primary: true, wide: true }]);
    return;
  }
  session.pendingGrade = { index, knew: true };
  finishQuizCard();
}

function flipCard() {
  const card = document.getElementById("card");
  if (!card) return;
  const flipped = card.classList.toggle("is-flipped");
  card.setAttribute("aria-pressed", String(flipped));
}

function currentSpeakText() {
  if (screen === "warmup") return course.words[session.warmup[session.cursor]].speak;
  if (screen === "fresh") return course.words[session.fresh[session.cursor]].speak;
  if (screen === "quiz") return course.words[session.quiz[session.cursor]].speak;
  if (screen === "dialogue") return session.dialogueSay || "";
  return "";
}

function firstPhase(plan) {
  if (plan.warmup.length) return "warmup";
  if (plan.fresh.length) return "fresh";
  if (plan.quiz.length) return "quiz";
  return "dialogue";
}

const handlers = {
  pick() {
    startedAt = null;
    finishedSeconds = null;
    if (timerId) clearInterval(timerId);
    timerId = null;
    session = null;
    showPick();
  },
  start() {
    openCourse();
    if (!session.phase || session.phase === "done") {
      session.phase = firstPhase(session);
      session.cursor = 0;
      session.doneCount = 0;
      persistSession();
    }
    startTimer();
    if ("speechSynthesis" in window) speechSynthesis.getVoices();
    renderPhase();
  },
  listen() { speak(currentSpeakText()); },
  flip: flipCard,
  again() { answerCard(false); },
  know() { answerCard(true); },
  next() {
    if (screen === "quiz" && session.quizAwait) {
      finishQuizCard();
      return;
    }
    if (screen === "reward" || screen === "dialogue") showDone();
  },
};

actions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button || !handlers[button.dataset.action]) return;
  handlers[button.dataset.action]();
});

stage.addEventListener("click", (event) => {
  const answer = event.target.closest("[data-choice]");
  if (answer) {
    pickChoice(answer);
    return;
  }
  const said = event.target.closest("[data-say]");
  if (said) {
    speak(said.dataset.say);
    return;
  }
  if (event.target.closest("[data-show-langs]")) {
    const list = document.getElementById("all-langs");
    if (list) list.hidden = false;
    return;
  }
  if (event.target.closest("[data-export]")) {
    exportProgress();
    return;
  }
  if (event.target.closest("[data-import]")) {
    document.getElementById("import-file")?.click();
    return;
  }
  const choice = event.target.closest("[data-teacher]");
  if (choice) {
    course = courses[choice.dataset.course];
    teacher = course.teachers.find((person) => person.id === choice.dataset.teacher);
    rememberLast();
    showLobby();
    return;
  }
  if (event.target.closest("#card")) flipCard();
});

function exportProgress() {
  const dump = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && key.startsWith("yezh-")) dump[key] = localStorage.getItem(key);
  }
  const file = new Blob([JSON.stringify(dump)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "yezh-progression.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const dump = JSON.parse(String(reader.result));
    Object.entries(dump).forEach(([key, value]) => {
      if (key.startsWith("yezh-") && typeof value === "string") localStorage.setItem(key, value);
    });
    showPick();
  };
  reader.readAsText(file);
}

document.addEventListener("change", (event) => {
  const input = event.target;
  if (input.id !== "import-file" || !input.files?.[0]) return;
  importProgress(input.files[0]);
  input.value = "";
});

document.addEventListener("pointerdown", () => {
  if (!window.speechSynthesis) return;
  speechSynthesis.getVoices();
  speechSynthesis.resume();
}, { once: true });

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && window.speechSynthesis) speechSynthesis.resume();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

if ("speechSynthesis" in window) {
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

showPick();
