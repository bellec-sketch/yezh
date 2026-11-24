import test from "node:test";
import assert from "node:assert/strict";
import { addDays, applyStreak, buildCheckpoint, buildDaySession, checkpointDue, gradeCard, quizChoices, sessionLength } from "./srsEngine.js";

const today = "2026-11-24";

test("a new word stays in box 1 until a later day", () => {
  const card = gradeCard(null, { knew: true, introducedToday: true, today });
  assert.equal(card.box_level, 1);
  assert.equal(card.next_review_date, "2026-11-25");
});

test("a success moves one box, a miss returns to box 1", () => {
  const up = gradeCard({ box_level: 2, next_review_date: today, touched: "" }, { knew: true, introducedToday: false, today });
  assert.equal(up.box_level, 3);
  assert.equal(up.next_review_date, addDays(today, 7));
  const down = gradeCard({ box_level: 3, next_review_date: today }, { knew: false, introducedToday: false, today });
  assert.equal(down.box_level, 1);
  assert.equal(down.next_review_date, "2026-11-25");
});

test("box 4 stays at 21 days and the same day does not promote twice", () => {
  const held = gradeCard({ box_level: 4, next_review_date: today }, { knew: true, introducedToday: false, today });
  assert.equal(held.box_level, 4);
  assert.equal(held.next_review_date, addDays(today, 21));
  const twice = gradeCard(held, { knew: true, introducedToday: false, today });
  assert.equal(twice.box_level, 4);
  const promoted = gradeCard({ box_level: 2, next_review_date: today, touched: today }, { knew: true, introducedToday: false, today });
  assert.equal(promoted.box_level, 2);
});

test("old boxes migrate onto the four Leitner boxes", () => {
  const card = gradeCard({ box: 2, due: today }, { knew: true, introducedToday: false, today });
  assert.equal(card.box_level, 4);
});

test("a day draws at most three reviews, three new words and three questions", () => {
  const cards = {};
  for (let index = 0; index < 6; index += 1) {
    cards[index] = { box_level: index < 4 ? 2 : 1, next_review_date: today, touched: "" };
  }
  const session = buildDaySession({ wordCount: 20, cards, today, seed: "fr-ru:2026-11-24" });
  assert.ok(session.warmup.length <= 3);
  assert.ok(session.fresh.length <= 3);
  assert.ok(session.quiz.length <= 3);
  assert.ok(sessionLength(session) <= 9);
  assert.equal(session.fresh.length, 3);
  assert.equal(session.warmup.length, 3);
  assert.equal(session.quiz.length, 3);
  const again = buildDaySession({ wordCount: 20, cards, today, seed: "fr-ru:2026-11-24" });
  assert.deepEqual(again.warmup, session.warmup);
  assert.deepEqual(again.fresh, session.fresh);
});

test("a first day has no review and still quizzes the new words", () => {
  const session = buildDaySession({ wordCount: 15, cards: {}, today, seed: "fr-zh:2026-11-24" });
  assert.equal(session.warmup.length, 0);
  assert.equal(session.fresh.length, 3);
  assert.equal(session.quiz.length, 3);
  assert.deepEqual(session.quiz.slice().sort(), session.fresh.slice().sort());
});

test("one missed day keeps the streak, two missed days reset it", () => {
  const kept = applyStreak({ streak: 4, lastDone: "2026-11-22" }, today);
  assert.equal(kept.streak, 5);
  assert.equal(kept.usedJoker, true);
  const reset = applyStreak({ streak: 4, lastDone: "2026-11-21" }, today);
  assert.equal(reset.streak, 1);
  assert.equal(reset.usedJoker, false);
  const next = applyStreak({ streak: 4, lastDone: "2026-11-23" }, today);
  assert.equal(next.streak, 5);
  assert.equal(next.usedJoker, false);
});

test("a checkpoint falls on every seventh lesson and reviews words already seen", () => {
  assert.equal(checkpointDue({ sessionsDone: 6, lastDone: "2026-11-23", rewards: [] }, today), true);
  assert.equal(checkpointDue({ sessionsDone: 5, lastDone: "2026-11-23", rewards: [] }, today), false);
  assert.equal(checkpointDue({ sessionsDone: 7, lastDone: today, rewards: [1] }, today), false);
  const session = buildCheckpoint({ wordCount: 20, seenIds: [0, 1, 2, 3, 4, 5, 6], seed: "fr-ru:check" });
  assert.equal(session.checkpoint, true);
  assert.equal(session.quiz.length, 5);
  assert.ok(session.quiz.every((id) => id <= 6));
});

test("quiz choices include the right word once", () => {
  const choices = quizChoices(12, 4, "fr-ar:2026-11-24");
  assert.equal(choices.length, 3);
  assert.equal(new Set(choices).size, 3);
  assert.ok(choices.includes(4));
});
