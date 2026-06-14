import { spawn } from 'node:child_process';

export const installProjectDependencies = (projectDir: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(npm, ['install'], {
      cwd: projectDir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`npm install failed with exit code ${code ?? 'unknown'}.`));
    });
  });
