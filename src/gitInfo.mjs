import { execSync } from "child_process";

const execSyncWrapper = (command) => {
  let stdout = null;
  try {
    stdout = execSync(command).toString().trim();
  } catch (error) {
    console.error(error);
  }
  return stdout;
};

const fetchInfo = () => {
  let gitBranch = execSyncWrapper("git rev-parse --abbrev-ref HEAD");
  let gitCommitHash = execSyncWrapper("git rev-parse --short=7 HEAD");

  return {
    gitBranch,
    gitCommitHash,
  };
};

export default fetchInfo;
