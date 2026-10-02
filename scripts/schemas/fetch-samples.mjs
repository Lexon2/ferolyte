// Sparse, shallow clone of Mojang/bedrock-samples at a pinned commit (vanilla corpus for `npm run roundtrip`).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'https://github.com/Mojang/bedrock-samples';
const COMMIT = '46ba6ea985fb5a92d79a9419198f10dda14c199d';
const PATHS = [
  'behavior_pack/entities',
  'behavior_pack/items',
  'behavior_pack/blocks',
  'behavior_pack/animation_controllers',
  'behavior_pack/recipes',
  'behavior_pack/spawn_rules',
  'resource_pack/entity',
  'resource_pack/animation_controllers',
  'resource_pack/attachables',
  'resource_pack/render_controllers',
  'metadata/json_schemas',
];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dir = path.join(root, '.cache', 'bedrock-samples');

const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'pipe' }).toString().trim();

if (existsSync(path.join(dir, '.git'))) {
  try {
    if (git('rev-parse', 'HEAD') === COMMIT) {
      // New paths may have been added to PATHS since the clone.
      git('sparse-checkout', 'set', ...PATHS);
      git('checkout', '-q', '--force', 'FETCH_HEAD');
      console.log(`bedrock-samples already at ${COMMIT.slice(0, 7)}`);
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

console.log(`Fetching bedrock-samples @ ${COMMIT.slice(0, 7)} (sparse: ${PATHS.length} dirs) ...`);
git('sparse-checkout', 'set', ...PATHS);
git('fetch', '--depth', '1', '--filter=blob:none', 'origin', COMMIT);
git('checkout', '-q', '--force', 'FETCH_HEAD');
console.log('done');
