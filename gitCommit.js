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

const getContributors = () => {
    return new Promise((resolve, reject) => {
        exec('git log', (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                const contributors = [];
                const lines = stdout.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.startsWith('Author:')) {
                        const name = line.slice(8).trim();
                        if (!contributors.includes(name)) {
                            contributors.push(name);
                        }
                    }
                }
                resolve(contributors);
            }
        });
    });
}

export {
    getCurrentHash,
    getCurrentBranch,
    getContributors
}