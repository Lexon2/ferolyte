// Fails when `packages/pack/content/generated` is not what `npm run codegen` would produce
// (schemas / patches / generator changed without regenerating). Used by CI.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Git may check files out with CRLF (core.autocrlf on Windows); the generator writes LF.
const readText = (file) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const COMMITTED = path.join(ROOT, 'packages/pack/content/generated');
const fresh = mkdtempSync(path.join(tmpdir(), 'ferolyte-codegen-'));

const walk = (dir, base = dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    return entry.isDirectory()
      ? walk(full, base)
      : /\.(ts|mjs)$/.test(entry.name) && !entry.name.endsWith('.d.ts')
        ? [path.relative(base, full).split(path.sep).join('/')]
        : [];
  });

try {
  execFileSync('node', ['scripts/schemas/fetch.mjs'], { cwd: ROOT, stdio: 'inherit' });
  // The vanilla corpus re-checks the `x-removed` evidence.
  execFileSync('node', ['scripts/schemas/fetch-samples.mjs'], { cwd: ROOT, stdio: 'inherit' });
  execFileSync('node', ['scripts/schemas/codegen.mjs'], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, CODEGEN_OUT: fresh },
  });

  // Hand-written files live next to the generated areas (`key-map.ts`, `runtime.ts`): compare areas only.
  const areas = readdirSync(fresh, { withFileTypes: true }).filter((e) => e.isDirectory());
  const problems = [];
  for (const area of areas) {
    const freshDir = path.join(fresh, area.name);
    const committedDir = path.join(COMMITTED, area.name);
    for (const file of walk(freshDir)) {
      const committed = path.join(committedDir, file);
      if (!existsSync(committed)) {
        problems.push(`missing: ${area.name}/${file}`);
      } else if (readText(committed) !== readText(path.join(freshDir, file))) {
        problems.push(`outdated: ${area.name}/${file}`);
      }
    }
    for (const file of existsSync(committedDir) ? walk(committedDir) : []) {
      if (!existsSync(path.join(freshDir, file))) {
        problems.push(`stale: ${area.name}/${file}`);
      }
    }
  }

  if (problems.length > 0) {
    console.error(`generated files are out of date, run \`npm run codegen\`:\n  ${problems.join('\n  ')}`);
    process.exitCode = 1;
  } else {
    console.log('generated files are up to date');
  }
} finally {
  rmSync(fresh, { recursive: true, force: true });
}
