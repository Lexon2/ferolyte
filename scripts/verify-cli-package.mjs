import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const cliRoot = join(repoRoot, 'packages', 'cli');
// Build output; every package publishes only its dist folder (plus docs).
const distRoot = join(cliRoot, 'dist');

const CRITICAL_PATHS = [
  'cli/index.js',
  'compiler/scripts/watch-esbuild.js',
  'compiler/scripts/create-scripts-output-path.js',
  'compiler/scripts/minecraft-hub.js',
  'compiler/check/check-project.js',
  'package.json',
];

const WORKSPACES = ['@ferolyte/common', '@ferolyte/pack', '@ferolyte/cli'];
const FORBIDDEN_IN_TARBALL = /(^|\/)tests\/|\.test\.[cm]?[jt]s(\.map)?$|\.test\.d\.ts/;
const ALLOWED_ROOT_FILES =
  /^(package\.json|README\.md|CHANGELOG\.md|LICENSE|AGENTS\.md|llms\.txt)$/;

const relativeImportPattern = /(?:from|export\s+\*)\s+["'](\.\.?\/[^"']+)["']/g;
const createRequirePattern =
  /createRequire\([^)]+\)\(\s*['"](\.\.?\/[^'"]+)['"]\s*\)/g;

async function collectJsFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules') {
        await collectJsFiles(path, files);
      }

      continue;
    }

    if (entry.name.endsWith('.js')) {
      files.push(path);
    }
  }

  return files;
}

function resolveRelativeImport(fromFile, importPath) {
  const base = dirname(fromFile);
  const target = resolve(base, importPath);

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
  return CRITICAL_PATHS.filter((rel) => !existsSync(join(root, rel))).map(
    (rel) => `Missing critical file: dist/${rel}`,
  );
}

async function verifyBuiltImports() {
  const errors = [];

  for (const file of await collectJsFiles(distRoot)) {
    const content = await readFile(file, 'utf8');
    const relFile = file.replace(distRoot, '').replace(/\\/g, '/');

    for (const match of content.matchAll(relativeImportPattern)) {
      if (!existsSync(resolveRelativeImport(file, match[1]))) {
        errors.push(`Missing module "${match[1]}" imported from ${relFile}`);
      }
    }

    for (const match of content.matchAll(createRequirePattern)) {
      if (!existsSync(resolve(dirname(file), match[1]))) {
        errors.push(`Missing createRequire target "${match[1]}" in ${relFile}`);
      }
    }
  }

  return errors;
}

function packFiles(workspace) {
  const result = spawnSync(
    'npm',
    ['pack', '-w', workspace, '--dry-run', '--json'],
    { cwd: repoRoot, encoding: 'utf8', shell: true },
  );

  if (result.status !== 0) {
    throw new Error(`npm pack failed:\n${result.stderr || result.stdout}`);
  }

  return (JSON.parse(result.stdout)[0]?.files ?? []).map((entry) =>
    entry.path.replace(/\\/g, '/'),
  );
}

function verifyPackContents() {
  const errors = [];

  for (const workspace of WORKSPACES) {
    const files = packFiles(workspace);

    if (workspace === '@ferolyte/cli') {
      for (const rel of CRITICAL_PATHS) {
        if (!files.includes(`dist/${rel}`)) {
          errors.push(`Tarball missing: dist/${rel}`);
        }
      }
    }

    for (const file of files) {
      if (FORBIDDEN_IN_TARBALL.test(file)) {
        errors.push(`${workspace} tarball contains a test file: ${file}`);
      } else if (!file.startsWith('dist/') && !ALLOWED_ROOT_FILES.test(file)) {
        errors.push(`${workspace} tarball contains an unexpected file: ${file}`);
      }
    }
  }

  return errors;
}

const errors = [
  ...verifyCriticalPaths(distRoot),
  ...(await verifyBuiltImports()),
  ...verifyPackContents(),
];

if (errors.length > 0) {
  console.error('Package verification failed:\n');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log('Package verification passed');
