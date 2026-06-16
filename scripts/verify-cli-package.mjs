import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const cliRoot = join(repoRoot, 'packages', 'cli');
const packageScriptsDir = join(cliRoot, 'scripts');

const CRITICAL_PATHS = [
  'cli/index.js',
  'compiler/scripts/watch-esbuild.js',
  'compiler/scripts/create-scripts-output-path.js',
  'compiler/scripts/minecraft-reload-server.js',
];

const relativeImportPattern = /(?:from|export\s+\*)\s+["'](\.\.?\/[^"']+)["']/g;
const createRequirePattern =
  /createRequire\([^)]+\)\(\s*['"](\.\.?\/[^'"]+)['"]\s*\)/g;

const shouldSkipDir = (dirPath, entryName) =>
  entryName === 'node_modules' ||
  entryName === 'tests' ||
  dirPath === packageScriptsDir;

async function collectJsFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDir(path, entry.name)) {
        continue;
      }

      await collectJsFiles(path, files);
      continue;
    }

    if (entry.name.endsWith('.js') && !entry.name.endsWith('.test.js')) {
      files.push(path);
    }
  }

  return files;
}

function resolveRelativeImport(fromFile, importPath) {
  const base = dirname(fromFile);
  let target = resolve(base, importPath);

  if (extname(target) === '') {
    if (existsSync(`${target}.js`)) {
      return `${target}.js`;
    }

    if (existsSync(join(target, 'index.js'))) {
      return join(target, 'index.js');
    }
  }

  return target;
}

function verifyCriticalPaths(root) {
  const errors = [];

  for (const rel of CRITICAL_PATHS) {
    if (!existsSync(join(root, rel))) {
      errors.push(`Missing critical file: ${rel}`);
    }
  }

  return errors;
}

async function verifyBuiltImports() {
  const errors = [];
  const jsFiles = await collectJsFiles(cliRoot);

  for (const file of jsFiles) {
    const content = await readFile(file, 'utf8');

    for (const match of content.matchAll(relativeImportPattern)) {
      const importPath = match[1];
      const resolved = resolveRelativeImport(file, importPath);

      if (!existsSync(resolved)) {
        const relFile = file.replace(cliRoot, '').replace(/\\/g, '/');
        errors.push(`Missing module "${importPath}" imported from ${relFile}`);
      }
    }

    for (const match of content.matchAll(createRequirePattern)) {
      const requirePath = match[1];
      const resolved = resolve(dirname(file), requirePath);

      if (!existsSync(resolved)) {
        const relFile = file.replace(cliRoot, '').replace(/\\/g, '/');
        errors.push(
          `Missing createRequire target "${requirePath}" in ${relFile}`,
        );
      }
    }
  }

  return errors;
}
function verifyPackContents() {
  const result = spawnSync(
    'npm',
    ['pack', '-w', '@ferolyte/cli', '--dry-run', '--json'],
    {
      cwd: repoRoot,
      encoding: 'utf8',
      shell: true,
    },
  );

  if (result.status !== 0) {
    throw new Error(`npm pack failed:\n${result.stderr || result.stdout}`);
  }

  const parsed = JSON.parse(result.stdout);
  const files = (parsed[0]?.files ?? []).map((entry) =>
    entry.path.replace(/\\/g, '/'),
  );
  const errors = [];

  for (const rel of CRITICAL_PATHS) {
    const normalized = rel.replace(/\\/g, '/');
    const found = files.includes(normalized);

    if (!found) {
      errors.push(`Tarball missing: ${rel}`);
    }
  }

  return errors;
}

const errors = [
  ...verifyCriticalPaths(cliRoot),
  ...(await verifyBuiltImports()),
  ...verifyPackContents(),
];

if (errors.length > 0) {
  console.error('CLI package verification failed:\n');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log('CLI package verification passed');
