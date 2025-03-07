"use server";

import { getDictionary } from "@/lib/dictionary";
import pluralsMap from "english-plurals-list/dist/plurals.json";
import { schema } from "./formSchema";

export type WordsState = {
  error?: string;
  words: string[];
};

const dictionary = await getDictionary();
const plurals = Object.values(pluralsMap);

function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index;
}

export async function onSubmitAction(
  _prevState: WordsState,
  data: FormData,
): Promise<WordsState> {
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

  const permutations = [...singles, ...doubles, ...triples, ...quads];

  const wordNetCandidates = dictionary.searchSimpleFor(permutations).keys();

  const pluralCandidates = plurals.filter((word) =>
    permutations.includes(word),
  );

  return {
    words: [...wordNetCandidates, ...pluralCandidates]
      .filter(onlyUnique)
      .toSorted(),
  };
}
