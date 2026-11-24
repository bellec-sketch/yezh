function frenchClose(name, streak, joker) {
  if (joker) return `Un jour a sauté. ${name} garde la série : ${streak} jours. À demain.`;
  const days = streak > 1 ? "jours" : "jour";
  return `Cinq minutes, ${name} s’arrête là. ${streak} ${days} d’affilée.`;
}

export const tutors = {
  nina: {
    ask: (word) => `Dans le métro, je dis : ${word.front}.`,
    reply: (word) => `Vous pouvez répondre : ${word.front}.`,
    close: (streak, joker) => frenchClose("Nina", streak, joker),
  },
  pavel: {
    ask: (word) => `Retenez celui-ci : ${word.front}.`,
    reply: (word) => `Et juste après : ${word.front}.`,
    close: (streak, joker) => (joker
      ? `Un jour manqué. La série tient : ${streak}. Demain, même rythme.`
      : `C’est assez pour aujourd’hui. ${streak} jour${streak > 1 ? "s" : ""} d’affilée.`),
  },
  sophie: {
    ask: (word) => `Я говорю : ${word.front}.`,
    reply: (word) => `Вы отвечаете : ${word.front}.`,
    close: (streak, joker) => (joker
      ? `Один день пропущен. Серия цела : ${streak}. До завтра.`
      : `Пять минут прошли. ${streak} подряд. До завтра.`),
  },
  louis: {
    ask: (word) => `Повторите за мной : ${word.front}.`,
    reply: (word) => `Теперь это слово : ${word.front}.`,
    close: (streak, joker) => (joker
      ? `Вчера выпал день. Серия на месте : ${streak}. До завтра.`
      : `На сегодня хватит. ${streak} подряд. До завтра.`),
  },
  enora: {
    ask: (word) => `Tout doucement : ${word.front}.`,
    reply: (word) => `Et celui-ci, du même pas : ${word.front}.`,
    close: (streak, joker) => frenchClose("Enora", streak, joker),
  },
  yann: {
    ask: (word) => `On le dit comme ça : ${word.front}.`,
    reply: (word) => `Vous enchaînez avec : ${word.front}.`,
    close: (streak, joker) => (joker
      ? `Un jour sauté, la série reste : ${streak}. À demain.`
      : `Assez pour aujourd’hui. ${streak} jour${streak > 1 ? "s" : ""} d’affilée.`),
  },
  hana: {
    ask: (word) => `Écoutez bien : ${word.front}.`,
    reply: (word) => `Vous répondez : ${word.front}.`,
    close: (streak, joker) => frenchClose("Hana", streak, joker),
  },
  haruto: {
    ask: (word) => `Le mot du moment : ${word.front}.`,
    reply: (word) => `Le suivant : ${word.front}.`,
    close: (streak, joker) => (joker
      ? `Un jour manqué. Je garde vos ${streak} jours. À demain.`
      : `Cinq minutes, c’est tenu. ${streak} jour${streak > 1 ? "s" : ""} d’affilée.`),
  },
  mei: {
    ask: (word) => `Je le dis une fois : ${word.front}.`,
    reply: (word) => `À vous : ${word.front}.`,
    close: (streak, joker) => frenchClose("Mei Lin", streak, joker),
  },
  chen: {
    ask: (word) => `Retenez le ton : ${word.front}.`,
    reply: (word) => `Puis celui-ci : ${word.front}.`,
    close: (streak, joker) => (joker
      ? `Un jour a sauté. La série reste : ${streak}. À demain.`
      : `Assez pour aujourd’hui. ${streak} jour${streak > 1 ? "s" : ""} d’affilée.`),
  },
  layla: {
    ask: (word) => `De droite à gauche, je dis : ${word.front}.`,
    reply: (word) => `Vous pouvez répondre : ${word.front}.`,
    close: (streak, joker) => frenchClose("Layla", streak, joker),
  },
  karim: {
    ask: (word) => `Écoutez le mot : ${word.front}.`,
    reply: (word) => `Et le second : ${word.front}.`,
    close: (streak, joker) => (joker
      ? `Un jour manqué. La série tient : ${streak}. À demain.`
      : `Cinq minutes, je m’arrête. ${streak} jour${streak > 1 ? "s" : ""} d’affilée.`),
  },
};

export function tutorSpeech(id, first, second, streak, joker) {
  const tutor = tutors[id] || tutors.nina;
  return {
    ask: tutor.ask(first),
    reply: tutor.reply(second),
    close: tutor.close(streak, joker),
  };
}
