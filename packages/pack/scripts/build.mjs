import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

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

    if (entry.name.endsWith('.ts')) {
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

async function fixDistImports(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      await fixDistImports(path);
      continue;
    }

    if (!entry.name.endsWith('.js')) {
      continue;
    }

    const { readFile, writeFile } = await import('node:fs/promises');
    const content = await readFile(path, 'utf8');
    await writeFile(path, fixRelativeImports(content));
  }
}

await fixDistImports(join(rootDir, 'dist'));

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

console.log(`Built ${entryPoints.length} files to dist/`);
