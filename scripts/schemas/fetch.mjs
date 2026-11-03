// Shallow-clone Blockception/Minecraft-bedrock-json-schemas at a pinned commit.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'https://github.com/Blockception/Minecraft-bedrock-json-schemas';
const COMMIT = 'c2859d0d99d3cfad7e0f08656af7c0bae045f956';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dir = path.join(root, '.cache', 'bedrock-schemas');

const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'pipe' }).toString().trim();

if (existsSync(path.join(dir, '.git'))) {
  try {
    if (git('rev-parse', 'HEAD') === COMMIT) {
      console.log(`bedrock-schemas already at ${COMMIT.slice(0, 7)}`);
      process.exit(0);
    }
  } catch {
    // fall through and re-fetch
  }
} else {
  mkdirSync(dir, { recursive: true });
  git('init', '-q');
  git('remote', 'add', 'origin', REPO);
}

console.log(`Fetching bedrock-schemas @ ${COMMIT.slice(0, 7)} ...`);
git('fetch', '--depth', '1', 'origin', COMMIT);
git('checkout', '-q', '--force', 'FETCH_HEAD');
console.log('done');
