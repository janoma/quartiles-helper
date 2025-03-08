"use server";

import Dictionary from "en-dictionary";
import { promises } from "fs";

import "server-only";

export default async function getDictionarySingleton(): Promise<Dictionary> {
  class DictionarySingleton {
    private static instance: Dictionary | undefined;

    public static async getInstance(): Promise<Dictionary> {
      const isProduction = process.env.NODE_ENV === "production";
      const filesInCwd = await promises.readdir(process.cwd());
      console.log("filesInCwd", filesInCwd);

      if (!DictionarySingleton.instance) {
        console.log("CWD", process.cwd());
        console.log("NODE_ENV", process.env.NODE_ENV);
        DictionarySingleton.instance = new Dictionary(
          isProduction ? "server/en-wordnet" : "en-wordnet",
        );
        await DictionarySingleton.instance.init();
      }
      return DictionarySingleton.instance;
    }
  }

  return await DictionarySingleton.getInstance();
}
