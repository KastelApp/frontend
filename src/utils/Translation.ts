interface Contributor {
	name: string;
	email?: string;
	id?: string;
}

interface RawTranslation {
	_meta: {
		name: string;
		code: string;
		contributors: Contributor[];
	};
	[key: string]:
		| string
		| RawTranslation
		| {
				name: string;
				code: string;
				contributors: Contributor[];
		  };
}

type TranslationType = {
	[key: string]: string | TranslationType;
};

interface CachedTranslation {
	data: TranslationType;
	contributors: Contributor[];
}

interface MetaData {
	languages: {
		code: string;
		// ? You can use a language if its complete, incomplete or in-progress. Planned ones are not allowed to be used.
		status: "complete" | "incomplete" | "in-progress" | "planned";
		// ? 0 = 0%, 1 = 100%. Warning should be showed if its under 65% (we default to english for any missing translations)
		// ? progress is unknown until we fetch the translation since we compare the keys vs the english keys.
		progress?: number;
		notes: string[];
	}[];
}

const lorempsum = (options: {
	count: number;
	type: "word" | "words" | "sentence" | "sentences" | "paragraph" | "paragraphs";
}) => {
	const placeholderText = `Lorem ipsum dolor sit amet  
    consectetur adipiscing elit sed  
    do eiusmod tempor incididunt ut 
    labore et dolore magna aliqua.`;

	const split = placeholderText.split(" ");

	switch (options.type) {
		case "word":
			return split[0];
		case "words":
			return split.slice(0, options.count).join(" ");
		case "sentence":
			return split.slice(0, 5).join(" ");
		case "sentences":
			return split.slice(0, 5 * options.count).join(" ");
		case "paragraph":
			return split.slice(0, 5).join(" ");
		case "paragraphs":
			return split.slice(0, 5 * options.count).join(" ");
	}
};

class Translation {
	public cachedTranslations: Map<string, CachedTranslation> = new Map();

	public metaData: MetaData = {
		languages: [],
	};

	public defaultFunctions = {
		date: {
			now: (type: "eu" | "us" = "us") => {
				const date = new Date();

				return type === "us"
					? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.toLocaleTimeString()}`
					: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.toLocaleTimeString()}`;
			},
			time: (format: "12" | "24" = "12") => {
				const date = new Date();
				return format === "12"
					? date.toLocaleTimeString()
					: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
			},
		},
		lorempsum: {
			word: () => lorempsum({ count: 1, type: "word" }),
			words: (count: number) => lorempsum({ count, type: "words" }),
			sentence: () => lorempsum({ count: 1, type: "sentence" }),
			sentences: (count: number) => lorempsum({ count, type: "sentences" }),
			paragraph: () => lorempsum({ count: 1, type: "paragraph" }),
			paragraphs: (count: number) => lorempsum({ count, type: "paragraphs" }),
		},
	};

	private async safeFetch(url: string, options?: RequestInit): Promise<object | null> {
		try {
			const fetched = await fetch(url, options);

			if (!fetched.ok) {
				return null;
			}

			const text = await fetched.text();

			return JSON.parse(text);
		} catch {
			return null;
		}
	}

	public async fetchTranslation(language: string) {
		if (this.cachedTranslations.has(language)) {
			return this.cachedTranslations.get(language)?.data;
		}

		const response = (await this.safeFetch(`/locales/${language}.json`)) as RawTranslation;

		if (!response) {
			return null;
		}

		if (!response._meta) {
			return null;
		}

		const contributors = response._meta.contributors;

		// @ts-expect-error idc
		delete response._meta;

		this.cachedTranslations.set(language, {
			data: response as TranslationType,
			contributors,
		});

		if (language === "en") return response as TranslationType;

		const progress = this.compareProgress(response as TranslationType);
		const found = this.metaData.languages.find((lang) => lang.code === language);

		if (!found) {
			this.metaData.languages.push({
				code: language,
				status: "incomplete",
				progress,
				notes: [],
			});
		} else {
			found.progress = progress;
		}

		return response as TranslationType;
	}

	private countKeys(value: number, obj: TranslationType) {
		for (const key in obj) {
			if (typeof obj[key] === "object") {
				this.countKeys(value, obj[key] as TranslationType);
			}

			value++;
		}

		return value;
	}

	private compareProgress(translation: TranslationType) {
		// ! english should always be cached
		const english = this.cachedTranslations.get("en");

		if (!english) {
			throw new Error("English translation is not cached?");
		}

		const englishKeys = this.countKeys(0, english.data);
		const totalKeys = this.countKeys(0, translation);

		return totalKeys / englishKeys;
	}

	public async fetchMetaData() {
		if (!("window" in globalThis)) return;

		const response = (await this.safeFetch("/locales/meta.json")) as MetaData;

		if (!response) {
			throw new Error("Failed to fetch meta data");
		}

		this.metaData = response;

		await this.fetchTranslation("en");

		return response;
	}

	public t(lang: string, key: string, ...anything: unknown[]): string {
		const translation = this.cachedTranslations.get(lang) ?? this.cachedTranslations.get("en");
		const foundEnglish = this.cachedTranslations.get("en");

		if (!translation || !foundEnglish) {
			throw new Error("No translation found");
		}

		const keys = key.split(".");

		let current = translation.data;
		let englishCurrent = foundEnglish.data;

		for (const k of keys) {
			if (!current[k]) {
				if (englishCurrent[k]) {
					current = englishCurrent[k] as TranslationType;

					if (process.env.NODE_ENV === "development")
						console.warn(`Translation key "${key}" is missing in ${lang}, defaulting to english (${k})`);
				} else {
					if (process.env.NODE_ENV === "development")
						console.warn(`Translation key "${key}" is missing in ${lang} and english (${k})`);

					return key;
				}

				continue;
			}

			current = current?.[k] as TranslationType;
			englishCurrent = englishCurrent?.[k] as TranslationType;
		}

		if (typeof current === "string") {
			return this.parse(current, ...anything);
		}

		return key;
	}

	private parse(str: string, ...anything: unknown[]) {
		const functions = {
			...this.defaultFunctions,
			// @ts-expect-error -- could not care less
			...anything.reduce((acc, cur) => ({ ...acc, ...(cur as object) }), {}),
		};

		let newString = str;

		const matches = newString.match(/{{(.*?)}}/g);

		if (!matches) return newString;

		for (const match of matches) {
			const matchWithoutBrackets = match.replace("{{", "").replace("}}", "");
			const split = matchWithoutBrackets.split(":");
			const key = split[0];
			const args = split.slice(1);

			const splitKey = key.split(".");

			let current: unknown = functions;

			for (const key of splitKey) {
				if (typeof current === "string") break;

				const found = current?.[key as keyof typeof current];

				if (!found) {
					current = "";

					continue;
				}

				current = found;
			}

			if (typeof current === "function") {
				newString = newString.replace(match, current(...args));
			} else {
				newString = newString.replace(match, current as string);
			}
		}

		return newString;
	}
}

export default Translation;

export {
	Translation,
	type TranslationType,
	type MetaData,
	type CachedTranslation,
	type Contributor,
	type RawTranslation,
};
