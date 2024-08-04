const languageMappings: Record<string, string[]> = {
	markdown: ["md", "mdx"],
};

/**
 * This is needed for some languages that don't actually have a language in the prismjs library
 */
const getLanguageFromExtension = (extension: string): string => {
	for (const language in languageMappings) {
		if (languageMappings[language].includes(extension)) {
			return language;
		}
	}

	return extension;
};

export { getLanguageFromExtension };
