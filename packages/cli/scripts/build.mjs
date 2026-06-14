import { createRequire } from 'node:module';
import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

function resolveTypeScriptBin(startDir) {
  let dir = startDir;

  while (true) {
    const require = createRequire(join(dir, 'package.json'));

    try {
      const pkgPath = require.resolve('typescript/package.json');
      return join(dirname(pkgPath), 'bin/tsc');
    } catch {
      const parent = dirname(dir);
      if (parent === dir) {
        return null;
      }

      dir = parent;
    }
  }
}

function runTypeScriptCompiler() {
  const tscBin = resolveTypeScriptBin(rootDir);

  if (tscBin) {
    return spawnSync(process.execPath, [tscBin, '-p', 'tsconfig.dts.json'], {
      cwd: rootDir,
      stdio: 'inherit',
    });
  }

  return spawnSync(
    'npx',
    ['--yes', '--package=typescript@5.8.3', 'tsc', '-p', 'tsconfig.dts.json'],
    {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
    },
  );
}

async function collectTsFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'dist' || entry.name === 'node_modules' || entry.name === 'tests') {
        continue;
      }

      await collectTsFiles(path, files);
      continue;
    }

    if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      files.push(path);
    }
  }

  return files;
}

const entryPoints = await collectTsFiles(rootDir);

await esbuild.build({
  entryPoints,
  outdir: join(rootDir, 'dist'),
  outbase: rootDir,
  platform: 'node',
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  logLevel: 'info',
});

const fixRelativeImports = (content) =>
  content.replace(
    /(from\s+["'])(\.\.?\/[^"']+)(["'])/g,
    (match, start, importPath, end) => {
      if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
        return match;
      }

      return `${start}${importPath}.js${end}`;
    },
  );

async function fixDistModuleSpecifiers(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      await fixDistModuleSpecifiers(path);
      continue;
    }

    if (!entry.name.endsWith('.js') && !entry.name.endsWith('.d.ts')) {
      continue;
    }

    const { readFile, writeFile } = await import('node:fs/promises');
    const content = await readFile(path, 'utf8');
    await writeFile(path, fixRelativeImports(content));
  }
}

await fixDistModuleSpecifiers(join(rootDir, 'dist'));

const tsc = runTypeScriptCompiler();

if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1);
}

await fixDistModuleSpecifiers(join(rootDir, 'dist'));

for (const entry of entryPoints) {
  if (relative(rootDir, entry).replace(/\\/g, '/').startsWith('cli/index.ts')) {
    const outFile = join(rootDir, 'dist/cli/index.js');
    const { readFile, writeFile } = await import('node:fs/promises');
    const content = await readFile(outFile, 'utf8');

    if (!content.startsWith('#!')) {
      await writeFile(outFile, `#!/usr/bin/env node\n${content}`);
    }
  }
}

console.log(`Built ${entryPoints.length} JS and declaration files to dist/`);
