/* eslint-disable camelcase */
import * as unicodeEmoji from "unicode-emoji";
import emojiData from "./emojiData.json"
import flags from "./flags.json"

const emojis = unicodeEmoji.getEmojis();

const getEmojiByUnicode = (unicode: string): { emoji: typeof emojiData[keyof typeof emojiData], unicode: string } | null => {
    const emoji = emojiData[unicode as keyof typeof emojiData];

    if (!emoji) return null

    return {
        emoji,
        unicode
    };
}

export const getEmojiBySlug = (slug: string): { emoji: typeof emojiData[keyof typeof emojiData], unicode: string } | null => {
    const emoji = Object.entries(emojiData).find(([, value]) => value.slug === slug);

    if (!emoji) {
        const flag = flags.find((flag) => flag === slug);

        if (flag) {
            return {
                emoji: {
                    slug: flag,
                    emoji_version: "13.0",
                    group: "Flags",
                    name: "Flag: " + flag,
                    skin_tone_support: false,
                    skin_tone_support_unicode_version: "6.0",
                    unicode_version: "6.0"
                },
                unicode: flag
            };
        }

        return null;
    }

    return {
        emoji: emoji[1],
        unicode: emoji[0]
    };
}

const getEmojisThatMatchKeyword = (keyword: string, matchCount = 1, limit = 100) => {
    const filtered = emojis.filter((emoji) => {
        const matchPercentages = emoji.keywords.map(emojiKeyword => {
            const keywordWords = keyword.split(" ");
            let commonWordsCount = 0;

            for (const word of keywordWords) {
                if (emojiKeyword.includes(word)) {
                    commonWordsCount++;
                }
            }

            const totalWords = keywordWords.length;
            return commonWordsCount / totalWords;
        });

        const highestMatchPercentage = Math.max(...matchPercentages);

        return highestMatchPercentage >= matchCount;
    });

    return filtered.slice(0, limit);
};

export {
    getEmojiByUnicode,
    getEmojisThatMatchKeyword,
    emojis
}