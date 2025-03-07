"use server";

import Dictionary from "en-dictionary";

export async function getDictionary() {
  const dictionary = new Dictionary("en-wordnet");
  await dictionary.init();
  return dictionary;
}