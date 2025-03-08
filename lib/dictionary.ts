"use server";

import Dictionary from "en-dictionary";

import "server-only";

export default async function getDictionarySingleton(): Promise<Dictionary> {
  class DictionarySingleton {
    private static instance: Dictionary | undefined;

    public static async getInstance(): Promise<Dictionary> {
      if (!DictionarySingleton.instance) {
        console.log("CWD", process.cwd());
        console.log("NODE_ENV", process.env.NODE_ENV);
        DictionarySingleton.instance = new Dictionary("en-wordnet");
        await DictionarySingleton.instance.init();
      }
      return DictionarySingleton.instance;
    }
  }

  return await DictionarySingleton.getInstance();
}
