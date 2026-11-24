const intervals = [1, 3, 7, 14, 30, 60];

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

const courses = {
  "fr-ru": {
    id: "fr-ru",
    ui: "fr",
    voice: "ru-RU",
    teacher: "Nina Sokolova",
    role: "Professeure de russe",
    portrait: "nina.jpg",
    crop: "",
    title: "Russe",
    forWhom: "Si vous parlez français",
    lines: {
      lobby: "Je m’appelle Nina. Une lettre, puis les mots qui doivent revenir.",
      alphabet: "Écoutez la lettre, puis répétez-la tout bas.",
      vocab: "Si le mot vous échappe, dites « À revoir ». Il reviendra.",
      speak: "Je le dis. Vous le reprenez.",
      done: "Assez pour aujourd’hui. Demain, ces mots reviennent.",
    },
    alphabet: russianAlphabet,
    words: russianWords,
    labels: {
      front: "Russe",
      back: "Français",
      start: "Commencer",
      backHome: "Les langues",
      listen: "Écouter",
      flip: "Retourner",
      nextLetter: "Lettre suivante",
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
      lobbyBody: "D’abord ce qui s’efface, ensuite un peu de nouveau.",
      doneTitle: "À demain",
      held: (time) => `Vous avez tenu ${time}. Je vous redonnerai ces mots.`,
      streak: (n) => `${n} jour${n > 1 ? "s" : ""} d’affilée`,
      letterStep: (i, n) => `Alphabet · ${i} sur ${n}`,
      wordStep: (i, n) => `Mots · ${i} sur ${n}`,
      speakStep: (i, n) => `Prononciation · ${i} sur ${n}`,
      plan: (reviews, fresh) => `${reviews} à revoir · ${fresh} nouveau${fresh > 1 ? "x" : ""}`,
      install: "iPhone : Partager, puis Sur l’écran d’accueil. Android : menu du navigateur, puis Installer l’application.",
      noVoice: "La voix n’est pas disponible ici. Suivez l’écriture.",
    },
  },
  "ru-fr": {
    id: "ru-fr",
    ui: "ru",
    voice: "fr-FR",
    teacher: "Enora Le Gall",
    role: "Преподаватель французского",
    portrait: "enora.jpg",
    crop: "left",
    title: "Французский",
    forWhom: "Если вы говорите по-русски",
    lines: {
      lobby: "Меня зовут Энора. Одна буква, затем слова, которые нужно вернуть.",
      alphabet: "Слушайте букву и повторите её тихо.",
      vocab: "Если слово ушло, нажмите «Повторить». Оно вернётся.",
      speak: "Я говорю. Вы повторяете.",
      done: "На сегодня достаточно. Завтра эти слова вернутся.",
    },
    alphabet: frenchAlphabet,
    words: frenchWords,
    labels: {
      front: "Французский",
      back: "Русский",
      start: "Начать",
      backHome: "Языки",
      listen: "Слушать",
      flip: "Перевернуть",
      nextLetter: "Следующая буква",
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
      lobbyBody: "Сначала то, что забывается, потом немного нового.",
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
      plan: (reviews, fresh) => `${reviews} на повтор · ${fresh} новых`,
      install: "iPhone: Поделиться → На экран «Домой». Android: меню браузера → Установить.",
      noVoice: "Голос здесь недоступен. Смотрите на запись произношения.",
    },
  },
};

const soon = [
  { title: "Japonais", note: "Bientôt" },
  { title: "Chinois", note: "Bientôt" },
  { title: "Arabe", note: "Bientôt" },
];

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
let screen = "pick";
let cursor = 0;
let session = null;
let startedAt = null;
let timerId = null;
let finishedSeconds = null;

function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function todayKey() {
  return dateKey(new Date());
}

function addDays(key, days) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

function loadProgress(id) {
  try {
    return JSON.parse(localStorage.getItem(`yezh-${id}`)) || { streak: 0, lastDone: "", cards: {}, nextLetter: 0, letterCycle: 0 };
  } catch {
    return { streak: 0, lastDone: "", cards: {}, nextLetter: 0, letterCycle: 0 };
  }
}

function saveProgress(data) {
  localStorage.setItem(`yezh-${course.id}`, JSON.stringify(data));
}

function buildSession(progress) {
  const today = todayKey();
  const reviews = [];
  const fresh = [];
  course.words.forEach((_, index) => {
    const state = progress.cards[index];
    if (!state) fresh.push(index);
    else if (state.due <= today) reviews.push(index);
  });
  let wordIds = reviews.slice(0, 4);
  const freshCount = wordIds.length ? Math.min(2, 6 - wordIds.length, fresh.length) : Math.min(4, fresh.length);
  const newIds = fresh.slice(0, freshCount);
  wordIds = wordIds.concat(newIds);
  if (!wordIds.length) {
    wordIds = [0, 1, 2].filter((index) => course.words[index]);
  }
  const letterIsNew = progress.nextLetter < course.alphabet.length;
  const letterIndex = letterIsNew ? progress.nextLetter : progress.letterCycle % course.alphabet.length;
  return {
    wordIds,
    newIds,
    letterIndex,
    letterIsNew,
    speaks: wordIds.slice(0, 3),
  };
}

function speak(text) {
  const labels = course.labels;
  if (!("speechSynthesis" in window)) {
    lineEl.textContent = labels.noVoice;
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = course.voice;
  utterance.rate = 0.82;
  const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith(course.voice.slice(0, 2)));
  if (voice) utterance.voice = voice;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
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
  coachEl.hidden = false;
  portraitEl.src = course.portrait;
  portraitEl.classList.toggle("left", course.crop === "left");
  whoEl.textContent = course.teacher;
  roleEl.textContent = course.role;
  lineEl.textContent = line;
  brandSub.textContent = course.title;
  document.documentElement.lang = course.ui;
}

function openCourse() {
  const progress = loadProgress(course.id);
  if (progress.savedDay === todayKey() && progress.savedSession) {
    session = progress.savedSession;
    return;
  }
  session = buildSession(progress);
  progress.savedDay = todayKey();
  progress.savedSession = session;
  saveProgress(progress);
}

function showPick() {
  course = null;
  screen = "pick";
  coachEl.hidden = true;
  clockEl.hidden = true;
  stepEl.textContent = "";
  brandSub.textContent = "langue, en breton";
  document.documentElement.lang = "fr";
  const cards = Object.values(courses).map((item) => `
    <button class="course" type="button" data-course="${item.id}">
      <img class="${item.crop}" src="${item.portrait}" alt="">
      <span><strong>${item.teacher}</strong><span>${item.title} · ${item.forWhom}</span></span>
    </button>
  `).join("");
  const later = soon.map((item) => `
    <button class="course soon" type="button" disabled>
      <span class="dot" aria-hidden="true"></span>
      <span><strong>${item.title}</strong><span>${item.note}</span></span>
    </button>
  `).join("");
  stage.innerHTML = `
    <article class="panel">
      <h2>Cinq minutes, dans les deux sens</h2>
      <p>Un personnage vous guide. Le russe pour le français, le français pour le russe. Les mots reviennent les jours suivants.</p>
    </article>
    <div class="courses">${cards}${later}</div>
  `;
  setActions([]);
}

function showLobby() {
  screen = "lobby";
  const progress = loadProgress(course.id);
  const plan = progress.savedDay === todayKey() && progress.savedSession ? progress.savedSession : buildSession(progress);
  const reviews = plan.wordIds.length - plan.newIds.length;
  const doneToday = progress.lastDone === todayKey();
  showTeacher(course.lines.lobby);
  stepEl.textContent = doneToday ? course.labels.already : course.labels.session;
  clockEl.hidden = false;
  clockEl.textContent = "5 min";
  const streak = progress.streak ? `<p class="streak">${course.labels.streak(progress.streak)}</p>` : "";
  stage.innerHTML = `
    <article class="panel">
      ${streak}
      <h2>${doneToday ? course.labels.againTitle : course.labels.ready}</h2>
      <p>${course.labels.lobbyBody}</p>
      <p class="hint">${course.labels.plan(reviews, plan.newIds.length)}</p>
    </article>
    <p class="install">${course.labels.install}</p>
  `;
  setActions([
    { label: course.labels.backHome, action: "pick" },
    { label: course.labels.start, action: "start", primary: true },
  ]);
}

function showAlphabet() {
  screen = "alphabet";
  const letter = course.alphabet[session.letterIndex];
  showTeacher(course.lines.alphabet);
  stepEl.textContent = course.labels.letterStep(1, 1);
  stage.innerHTML = `
    <article class="panel">
      <p class="mark">${letter.name}</p>
      <p class="letter" lang="${course.voice.slice(0, 2)}">${letter.upper} ${letter.lower}</p>
      <p class="hint">${letter.hint}</p>
      <p class="example">${letter.example} · ${letter.exampleBack}</p>
    </article>
  `;
  setActions([
    { label: course.labels.listen, action: "listen", primary: true },
    { label: session.wordIds.length ? course.labels.toWords : course.labels.finish, action: "next" },
  ]);
}

function showVocab() {
  screen = "vocab";
  const index = session.wordIds[cursor];
  const word = course.words[index];
  const isNew = session.newIds.includes(index);
  showTeacher(course.lines.vocab);
  stepEl.textContent = course.labels.wordStep(cursor + 1, session.wordIds.length);
  stage.innerHTML = `
    <button class="card" id="card" type="button" aria-pressed="false">
      <span class="card-inner">
        <span class="face face-front">
          <span class="tag">${isNew ? course.labels.fresh : course.labels.review}</span>
          <span class="word" lang="${course.voice.slice(0, 2)}">${word.front}</span>
          <span class="phonetic">${word.phonetic}</span>
          <span class="face-label">${course.labels.front}</span>
        </span>
        <span class="face face-back">
          <span class="tag">${word.category}</span>
          <span class="word">${word.back}</span>
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
}

function showSpeak() {
  screen = "speak";
  const index = session.speaks[cursor];
  const word = course.words[index];
  showTeacher(course.lines.speak);
  stepEl.textContent = course.labels.speakStep(cursor + 1, session.speaks.length);
  stage.innerHTML = `
    <article class="panel">
      <p class="mark">${word.back}</p>
      <p class="word" lang="${course.voice.slice(0, 2)}">${word.front}</p>
      <p class="phonetic">${word.phonetic}</p>
    </article>
  `;
  const last = cursor === session.speaks.length - 1;
  setActions([
    { label: course.labels.listen, action: "listen", primary: true },
    { label: last ? course.labels.finish : course.labels.repeated, action: "next" },
  ]);
}

function markDone() {
  const progress = loadProgress(course.id);
  const today = todayKey();
  if (progress.lastDone !== today) {
    const yesterday = addDays(today, -1);
    progress.streak = progress.lastDone === yesterday ? progress.streak + 1 : 1;
    progress.lastDone = today;
  }
  if (progress.letterMarked !== today) {
    if (session.letterIsNew) progress.nextLetter += 1;
    else progress.letterCycle += 1;
    progress.letterMarked = today;
  }
  saveProgress(progress);
  return progress;
}

function grade(knew) {
  const progress = loadProgress(course.id);
  const index = session.wordIds[cursor];
  const previous = progress.cards[index];
  const box = knew ? Math.min((previous?.box ?? -1) + 1, intervals.length - 1) : 0;
  progress.cards[index] = { box, due: addDays(todayKey(), knew ? intervals[box] : 1) };
  saveProgress(progress);
  if (cursor < session.wordIds.length - 1) {
    cursor += 1;
    showVocab();
  } else {
    cursor = 0;
    showSpeak();
  }
}

function showDone() {
  screen = "done";
  stopTimer();
  const progress = markDone();
  showTeacher(course.lines.done);
  stepEl.textContent = course.labels.finished;
  stage.innerHTML = `
    <article class="panel">
      <p class="streak">${course.labels.streak(progress.streak)}</p>
      <h2>${course.labels.doneTitle}</h2>
      <p>${course.labels.held(formatClock(finishedSeconds || 0))}</p>
    </article>
  `;
  setActions([{ label: course.labels.doneHome, action: "pick", primary: true, wide: true }]);
}

function flipCard() {
  const card = document.getElementById("card");
  if (!card) return;
  const flipped = card.classList.toggle("is-flipped");
  card.setAttribute("aria-pressed", String(flipped));
}

function currentSpeakText() {
  if (screen === "alphabet") return course.alphabet[session.letterIndex].speak;
  if (screen === "vocab") return course.words[session.wordIds[cursor]].speak;
  if (screen === "speak") return course.words[session.speaks[cursor]].speak;
  return "";
}

const handlers = {
  pick() {
    startedAt = null;
    finishedSeconds = null;
    if (timerId) clearInterval(timerId);
    showPick();
  },
  start() {
    openCourse();
    startTimer();
    if ("speechSynthesis" in window) speechSynthesis.getVoices();
    cursor = 0;
    showAlphabet();
  },
  listen() { speak(currentSpeakText()); },
  flip: flipCard,
  again() { grade(false); },
  know() { grade(true); },
  next() {
    if (screen === "alphabet") {
      cursor = 0;
      if (session.wordIds.length) showVocab();
      else showDone();
      return;
    }
    if (screen === "speak") {
      if (cursor < session.speaks.length - 1) {
        cursor += 1;
        showSpeak();
      } else showDone();
    }
  },
};

actions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button || !handlers[button.dataset.action]) return;
  handlers[button.dataset.action]();
});

stage.addEventListener("click", (event) => {
  const choice = event.target.closest("[data-course]");
  if (choice) {
    course = courses[choice.dataset.course];
    showLobby();
    return;
  }
  if (event.target.closest("#card")) flipCard();
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
