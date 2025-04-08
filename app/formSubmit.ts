"use server";

import getDictionarySingleton from "@/lib/dictionary";
import pluralsMap from "english-plurals-list/dist/plurals.json";

import { schema } from "./formSchema";

export type WordsState = {
  error?: string;
  words: Word[];
};

type Word = { category: "double" | "quad" | "single" | "triple"; word: string };

const plurals = Object.values(pluralsMap);

export async function onSubmitAction(
  _prevState: WordsState,
  data: FormData,
): Promise<WordsState> {
  const dictionary = await getDictionarySingleton();

  const formData = Object.fromEntries(data);
  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    return {
      error: "Invalid input. Please fill all fields.",
      words: [],
    };
  }

  const singles = Object.values(parsed.data);

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
      .map((word) => ({ category: "single", word }) satisfies Word),
    ...[
      ...dictionary.searchSimpleFor(doubles).keys(),
      ...plurals.filter((word) => doubles.includes(word)),
    ]
      .filter(onlyUnique)
      .map((word) => ({ category: "double", word }) satisfies Word),
    ...[
      ...dictionary.searchSimpleFor(triples).keys(),
      ...plurals.filter((word) => triples.includes(word)),
    ]
      .filter(onlyUnique)
      .map((word) => ({ category: "triple", word }) satisfies Word),
    ...[
      ...dictionary.searchSimpleFor(quads).keys(),
      ...plurals.filter((word) => quads.includes(word)),
    ]
      .filter(onlyUnique)
      .map((word) => ({ category: "quad", word }) satisfies Word),
  ].toSorted((lhs, rhs) => lhs.word.localeCompare(rhs.word));

  return {
    words: candidates,
  };
}

function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index;
}
