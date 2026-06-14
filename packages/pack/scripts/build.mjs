import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
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

const resolveImportPath = (filePath, importPath) => {
  if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
    return importPath;
  }

  const fileDir = dirname(filePath);
  const directJs = join(fileDir, `${importPath}.js`);
  const indexJs = join(fileDir, importPath, 'index.js');

  if (existsSync(indexJs) && !existsSync(directJs)) {
    return `${importPath}/index.js`;
  }

  return `${importPath}.js`;
};

const fixRelativeImports = (content, filePath) =>
  content.replace(
    /(from\s+["'])(\.\.?\/[^"']+)(["'])/g,
    (match, start, importPath, end) => {
      if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
        return match;
      }

      return `${start}${resolveImportPath(filePath, importPath)}${end}`;
    },
  );

async function fixDistModuleSpecifiers(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const tasks = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      tasks.push(fixDistModuleSpecifiers(path));
      continue;
    }

    if (!entry.name.endsWith('.js') && !entry.name.endsWith('.d.ts')) {
      continue;
    }

    tasks.push(
      readFile(path, 'utf8').then((content) =>
        writeFile(path, fixRelativeImports(content, path)),
      ),
    );
  }

  await Promise.all(tasks);
}

const tsc = spawnSync('npx', ['tsc', '-p', 'tsconfig.dts.json'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1);
}

await fixDistModuleSpecifiers(join(rootDir, 'dist'));

console.log(`Built ${entryPoints.length} JS and declaration files to dist/`);
