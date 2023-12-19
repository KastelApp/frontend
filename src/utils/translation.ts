/* eslint-disable @typescript-eslint/no-explicit-any */
// default "functions"
// {{date.now}} // returns a date like "12/18/2023 12:00:00 AM"
// {{date.now:uk}} // returns a date like "18/12/2023 12:00:00 AM"
// {{date.time}} // returns a date like "12:00:00 AM"
// {{date.time:24}} // returns a date like "00:00:00"
// now a user can provide their own functions so if you do {{user.username}} you m ust provide a user object

// translations are stored in a json file like this:
// {
//     "_meta": {
//         "name": "English",
//         "code": "en",
//         "contributors": [
//             {
//                 "name": "DarkerInk",
//                 "id": "1234567890"
//             }
//         ]
//     },
//     "hello": "Hello",
//     "goodbye": "Goodbye {{user.username}}",
//     "group": {
//         "hello": "Hello"
//     },
//     "array": [
//         "Hello",
//         "Goodbye"
//     ]
// }
// HOW TO TRANSLATE:
// we want to od translation("goodbye", { user: { username: "DarkerInk" } })

type TranslationType = {
  [key: string]: string | TranslationType;
};

class Translation {
  private currentLanguage: string = "en";
  private translations: Map<string, TranslationType> = new Map();
  private metaData: Map<string, string | boolean> = new Map();

  public constructor() {
    this.load();
  }

  public async load() {
    if (this.metaData.get("loaded")) return this;
    const fetched = await fetch("/locales/meta.json");
    const text = await fetched.text();
    const metaData: {
      languages: {
        code: string; // This is basically the name of the file (DO NOT ADD .json)
        status: "complete" | "wip" | "planned";
        notes?: string[];
      }[];
    } | null = this.trytoparse(text);

    if (!metaData) throw new Error("Failed to load meta.json");

    for (const language of metaData.languages) {
      if (language.status === "planned") continue;

      const fetched = await fetch(`/locales/${language.code}.json`);
      const text = await fetched.text();
      const translations: TranslationType | null = this.trytoparse(text);

      if (!translations)
        throw new Error(`Failed to load ${language.code}.json`);

      this.translations.set(language.code, translations);
    }

    this.metaData.set("loaded", true);

    return this;
  }

  private trytoparse(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  public setLanguage(language: string) {
    this.currentLanguage = language;
  }

  public t(key: string, ...anything: any[]) {
    const translation =
      this.translations.get(this.currentLanguage) ??
      this.translations.get("en");

    console.log(translation, this.translations);

    if (!translation) return key;

    const keys = key.split(".");

    let current: string | TranslationType = translation;

    for (const key of keys) {
      if (typeof current === "string") break;

      const found: TranslationType | string | null = current?.[key];

      if (!found) return key;

      current = found;
    }

    if (typeof current === "string") {
      return this.parse(current, ...anything);
    }

    return key;
  }

  private parse(str: string, ...anything: any[]) {
    const defaultFunctions = {
      date: {
        now: (type: "uk" | "us" = "us") => {
          const date = new Date();

          return type === "us"
            ? `${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()} ${date.toLocaleTimeString()}`
            : `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()} ${date.toLocaleTimeString()}`;
        },
        time: (format: "12" | "24" = "12") => {
          const date = new Date();
          return format === "12"
            ? date.toLocaleTimeString()
            : `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        },
      },
    };

    const functions = {
      ...defaultFunctions,
      ...anything.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    };

    let newString = str;

    const matches = newString.match(/{{(.*?)}}/g);

    if (!matches) return newString;

    for (const match of matches) {
      // heres two examples of a match:
      // {{user.username}} - This is just a simple look through the object
      // or {{date:now}} - This is a function call
      const matchWithoutBrackets = match.replace("{{", "").replace("}}", "");
      const split = matchWithoutBrackets.split(":");
      const key = split[0];
      const args = split.slice(1);

      const splitKey = key.split(".");

      let current: any = functions;

      for (const key of splitKey) {
        if (typeof current === "string") break;

        const found = current?.[key];

        if (!found) return key;

        current = found;
      }

      if (typeof current === "function") {
        newString = newString.replace(match, current(...args));
      } else {
        newString = newString.replace(match, current);
      }
    }

    return newString;
  }

  public getMetaData(language = "us"): {
    name: string;
    code: string;
    contributors: {
      name: string;
      id: string;
    }[];
  } | null {
    const foundLanguage = this.translations.get(language);

    const metaData = foundLanguage?._meta;

    if (!metaData) return null;

    return metaData as unknown as {
      name: string;
      code: string;
      contributors: {
        name: string;
        id: string;
      }[];
    };
  }
}

export default Translation;
