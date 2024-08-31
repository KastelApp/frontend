import packageJson from "@/../package.json";

/**
 * Gets the client version from a few places, i.e the url and elsewhere. Returns an object of a few things
 * 1) if its clean (i.e latest version, in production and on the stable domain)
 * 2) the channel (i.e stable, ptb, canary, dev)
 * 3) the version (i.e 1.0.0)
 */
const getClientVersion = (): {
    clean: boolean;
    channel: string;
    version: string;
    hash?: string;
} => {
    const channel = process.env.GIT_BRANCH === "development" ? "development" : process.env.GIT_BRANCH === "canary" ? "canary" : process.env.GIT_BRANCH === "ptb" ? "ptb" : "stable";
    const clean = channel === "stable" && process.env.NODE_ENV === "production";

    return {
        clean,
        channel,
        version: packageJson.version,
        hash: process.env.GIT_COMMIT_SHA,
    }
}

export default getClientVersion;