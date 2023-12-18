class Translation {
    private currentLanguage: string = "en";
    private translations: Record<string, Record<string, string>> = {};

    public constructor() {

    }

    public async load() {
        const fetched = await fetch("/locales/meta.json");
        const text = await fetched.text();
        const metaData: {
            languages: {
                code: string; // This is basically the name of the file (DO NOT ADD .json)
                status: "complete" | "wip" | "planned"
                notes?: string[]
            }[]
        } | null = JSON.parse(text);

        if (!metaData) throw new Error("Failed to load meta.json");
    }

    private trytoparse(str: string) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return null
        }
    }
}

export default Translation;