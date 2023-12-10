import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const execSyncWrapper = (command: string): string | null => {
    let stdout: string | null = null;
    try {
        stdout = execSync(command).toString().trim();
    } catch (error) {
        console.error(error);
    }
    return stdout;
};

const main = (): void => {
    let gitBranch: string | null = execSyncWrapper("git rev-parse --abbrev-ref HEAD");
    let gitCommitHash: string | null = execSyncWrapper("git rev-parse --short=7 HEAD");

    const obj: { gitBranch: string | null; gitCommitHash: string | null } = {
        gitBranch,
        gitCommitHash,
    };

    const filePath: string = path.resolve("src", "generatedGitInfo.json");
    const fileContents: string = JSON.stringify(obj, null, 2);

    fs.writeFileSync(filePath, fileContents);
    console.log(`Wrote the following contents to ${filePath}\n${fileContents}`);
};

main();
