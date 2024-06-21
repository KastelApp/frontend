import fs from "node:fs/promises";
import { join } from "node:path";

/**
 * @typedef {Object} Doc
 * @property {string | null} group
 * @property {string} id
 * @property {{name: string}[]} sections
 */

/**
 * Recursively reads a path
 * @param {string} path The path to read
 * @returns {Promise<string[]>} The files in the path
 */
const recursiveRead = async (path) => {
    const initFiles = await fs.readdir(path);
    const endFiles = [];

    for (const file of initFiles) {
        const stats = await fs.stat(`${path}/${file}`);

        if (stats.isDirectory()) {
            endFiles.push(...await recursiveRead(`${path}/${file}`));
        } else {
            endFiles.push(`${path}/${file}`);
        }
    }

    return endFiles;
};

/**
 * Parses a doc
 * @param {string | null} group The group of the doc, i.e "OAuth2", "General", etc.
 * @param {string} id The id of the doc, i.e "Intro", "Home", etc.
 * @param {string} markdown The markdown content
 * @returns {Doc}
 */
const parseDoc = (group, id, markdown) => {
    const lines = markdown.split("\n");

    /**
     * @type {Doc}
     */
    const doc = {
        group,
        id,
        sections: []
    };

    const subSectionsRegex = /^## (.*)/g;

    for (const line of lines) {
        const subSectionMatch = subSectionsRegex.exec(line);

        if (subSectionMatch) {
            doc.sections.push({
                name: subSectionMatch[1]
            });
        }
    }

    return doc;
}

const setupDocs = async () => {
    const files = await recursiveRead("public/docs/docs");

    //?  public/docs/docs/test/Home.md this is an example path
    // ? The group in this case is "test", the id is "Home"
    // ? here's another one "public/docs/docs/Intro.md"
    // ? the group in this case is null and the id is "Intro"

    const docs = [];

    for (const file of files) {
        const content = await fs.readFile(file, "utf-8");

        const split = file.split("/");

        split.shift() // ? gets rid of public
        split.shift() // ? gets rid of docs
        split.shift() // ? gets rid of docs

        const group = split.length > 1 ? split[0] : null;
        const id = split[split.length - 1].split(".")[0]

        const doc = parseDoc(group, id, content);

        docs.push(doc);
    }

    await fs.writeFile(join(import.meta.dirname, "docs.json"), JSON.stringify(docs, null, 4))
};

export default setupDocs;