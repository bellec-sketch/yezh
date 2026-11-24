export const BOX_DAYS = { 1: 1, 2: 3, 3: 7, 4: 21 };

const OLD_BOX = [1, 2, 3, 4, 4, 4];

export function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayKey(now = new Date()) {
  return dateKey(now);
}

export function parseKey(key) {
  const [year, month, day] = String(key).split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function addDays(key, days) {
  const date = new Date(parseKey(key));
  date.setUTCDate(date.getUTCDate() + days);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysBetween(from, to) {
  return Math.round((parseKey(to) - parseKey(from)) / 86400000);
}

export function sameDay(a, b) {
  if (!a || !b) return false;
  return parseKey(a) === parseKey(b);
}

export function isDue(next, today) {
  if (!next) return true;
  return parseKey(next) <= parseKey(today);
}

export function normalizeCard(state) {
  if (!state || typeof state !== "object") return null;
  if (state.box_level) {
    const boxLevel = Math.max(1, Math.min(4, Number(state.box_level)));
    return {
      box_level: boxLevel,
      next_review_date: state.next_review_date || state.due || "",
      touched: state.touched || "",
    };
  }
  if (typeof state.box === "number") {
    return {
      box_level: OLD_BOX[state.box] ?? 1,
      next_review_date: state.due || "",
      touched: "",
    };
  }
  return null;
}

function hashString(text) {
  let hash = 2166136261;
  const value = String(text);
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, random) {
  const copy = list.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function gradeCard(previous, { knew, introducedToday, today }) {
  const prior = normalizeCard(previous);
  let level;
  if (!knew || introducedToday || !prior) level = 1;
  else level = Math.min(4, prior.box_level + 1);
  if (prior && prior.touched === today && level > prior.box_level) level = prior.box_level;
  if (!knew) level = 1;
  return {
    box_level: level,
    next_review_date: addDays(today, BOX_DAYS[level]),
    touched: today,
  };
}

export function applyStreak(progress, today) {
  const last = progress.lastDone || "";
  const streak = progress.streak || 0;
  if (last && sameDay(last, today)) {
    return { streak, usedJoker: false, already: true, lastDone: today };
  }
  if (!last) return { streak: 1, usedJoker: false, already: false, lastDone: today };
  const gap = daysBetween(last, today);
  if (gap <= 1) return { streak: streak + 1, usedJoker: false, already: false, lastDone: today };
  if (gap === 2) return { streak: streak + 1, usedJoker: true, already: false, lastDone: today };
  return { streak: 1, usedJoker: false, already: false, lastDone: today };
}

export function buildDaySession({ wordCount, cards, today, seed }) {
  const random = mulberry32(hashString(seed));
  const unseen = [];
  const dueBox1 = [];
  const dueWarm = [];
  const dueLate = [];
  const scheduled = [];
  for (let index = 0; index < wordCount; index += 1) {
    const card = normalizeCard(cards?.[index] ?? cards?.[String(index)]);
    if (!card) {
      unseen.push(index);
      continue;
    }
    scheduled.push({ index, card });
    if (!isDue(card.next_review_date, today)) continue;
    if (card.box_level === 1) dueBox1.push(index);
    else if (card.box_level === 4) dueLate.push(index);
    else dueWarm.push(index);
  }
  let warmup = shuffle(dueWarm, random).slice(0, 3);
  if (warmup.length < 3) warmup = warmup.concat(shuffle(dueLate, random).slice(0, 3 - warmup.length));
  const fresh = shuffle(unseen, random).slice(0, 3);
  if (!warmup.length && !fresh.length && scheduled.length) {
    const soonest = scheduled
      .slice()
      .sort((a, b) => parseKey(a.card.next_review_date) - parseKey(b.card.next_review_date));
    warmup = soonest.slice(0, 3).map((item) => item.index);
  }
  const quiz = [];
  for (const id of shuffle(dueBox1, random)) {
    if (quiz.length >= 2) break;
    quiz.push(id);
  }
  for (const id of fresh) {
    if (quiz.length >= 3) break;
    if (!quiz.includes(id)) quiz.push(id);
  }
  for (const id of warmup) {
    if (quiz.length >= 3) break;
    if (!quiz.includes(id)) quiz.push(id);
  }
  const startLevels = {};
  for (const id of [...warmup, ...fresh, ...quiz]) {
    const card = normalizeCard(cards?.[id] ?? cards?.[String(id)]);
    startLevels[id] = card?.box_level || 0;
  }
  const phase = warmup.length ? "warmup" : fresh.length ? "fresh" : quiz.length ? "quiz" : "dialogue";
  return {
    version: 2,
    warmup,
    fresh,
    quiz,
    startLevels,
    doneCount: 0,
    phase,
    cursor: 0,
  };
}

export function sessionLength(session) {
  return session.warmup.length + session.fresh.length + session.quiz.length;
}

export function quizChoices(wordCount, correctIndex, salt) {
  const others = [];
  for (let index = 0; index < wordCount; index += 1) {
    if (index !== correctIndex) others.push(index);
  }
  const random = mulberry32(hashString(`${salt}:${correctIndex}`));
  const picked = shuffle(others, random).slice(0, Math.min(2, others.length));
  return shuffle([correctIndex, ...picked], random);
}
