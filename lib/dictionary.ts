import Dictionary from "en-dictionary";

import "server-only";

export class DictionarySingleton {
  private static instance: Dictionary | undefined;

  public static async getInstance(): Promise<Dictionary> {
    if (!DictionarySingleton.instance) {
      DictionarySingleton.instance = new Dictionary("lib/en-wordnet");
      await DictionarySingleton.instance.init();
    }
    return DictionarySingleton.instance;
  }
}
