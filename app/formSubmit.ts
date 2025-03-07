"use server";

import { DictionarySingleton } from "@/lib/dictionary";
import pluralsMap from "english-plurals-list/dist/plurals.json";
import { schema } from "./formSchema";

type Word = { word: string; category: "single" | "double" | "triple" | "quad" };

export type WordsState = {
  error?: string;
  words: Word[];
};

const plurals = Object.values(pluralsMap);

function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index;
}

export async function onSubmitAction(
  _prevState: WordsState,
  data: FormData,
): Promise<WordsState> {
  const dictionary = await DictionarySingleton.getInstance();

  const formData = Object.fromEntries(data);
  const parsed = schema.parse(formData);

  const singles = Object.values(parsed);

  const doubles = singles.flatMap((a) =>
    singles.filter((b) => b !== a).map((b) => a + b),
  );

  const triples = singles.flatMap((a) =>
    doubles.filter((b) => !b.includes(a)).map((b) => a + b),
  );

  const quads = singles.flatMap((a) =>
    triples.filter((b) => !b.includes(a)).map((b) => a + b),
  );

  const candidates = [
    ...[
      ...dictionary.searchSimpleFor(singles).keys(),
      ...plurals.filter((word) => singles.includes(word)),
    ]
      .filter(onlyUnique)
      .map((word) => ({ word, category: "single" }) satisfies Word),
    ...[
      ...dictionary.searchSimpleFor(doubles).keys(),
      ...plurals.filter((word) => doubles.includes(word)),
    ]
      .filter(onlyUnique)
      .map((word) => ({ word, category: "double" }) satisfies Word),
    ...[
      ...dictionary.searchSimpleFor(triples).keys(),
      ...plurals.filter((word) => triples.includes(word)),
    ]
      .filter(onlyUnique)
      .map((word) => ({ word, category: "triple" }) satisfies Word),
    ...[
      ...dictionary.searchSimpleFor(quads).keys(),
      ...plurals.filter((word) => quads.includes(word)),
    ]
      .filter(onlyUnique)
      .map((word) => ({ word, category: "quad" }) satisfies Word),
  ].toSorted((lhs, rhs) => lhs.word.localeCompare(rhs.word));

  return {
    words: candidates,
  };
}
