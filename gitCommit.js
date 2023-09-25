import { exec } from 'child_process';

const getCurrentHash = (full = false) => {
    return new Promise((resolve, reject) => {
        exec('git rev-parse HEAD', (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                resolve(full ? stdout : stdout.slice(0, 7));
            }
        });
    });
}

const getCurrentBranch = () => {
    return new Promise((resolve, reject) => {
        exec('git rev-parse --abbrev-ref HEAD', (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}

export {
    getCurrentHash,
    getCurrentBranch
}