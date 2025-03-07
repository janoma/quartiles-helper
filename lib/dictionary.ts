import Dictionary from "en-dictionary";

export class DictionarySingleton {
  private static instance: Dictionary | undefined;

  public static async getInstance(): Promise<Dictionary> {
    if (!DictionarySingleton.instance) {
      DictionarySingleton.instance = new Dictionary("en-wordnet");
      await DictionarySingleton.instance.init();
    }
    return DictionarySingleton.instance;
  }
}
