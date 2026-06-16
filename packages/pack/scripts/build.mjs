import { existsSync } from 'node:fs';
import { readdir, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const BUILD_ARTIFACT_PATTERN = /\.(js|d\.ts)(\.map)?$/;
const packageScriptsDir = join(rootDir, 'scripts');

const shouldSkipDir = (dirPath, entryName) =>
  entryName === 'node_modules' ||
  entryName === 'tests' ||
  dirPath === packageScriptsDir;

async function collectTsFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDir(path, entry.name)) {
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

async function cleanBuildArtifacts(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDir(path, entry.name)) {
        continue;
      }

      await cleanBuildArtifacts(path);
      continue;
    }

    if (BUILD_ARTIFACT_PATTERN.test(entry.name)) {
      await unlink(path);
    }
  }
}

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

async function fixModuleSpecifiers(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const tasks = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDir(path, entry.name)) {
        continue;
      }

      tasks.push(fixModuleSpecifiers(path));
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

await cleanBuildArtifacts(rootDir);
await rm(join(rootDir, 'dist'), { recursive: true, force: true });

const entryPoints = await collectTsFiles(rootDir);

await esbuild.build({
  entryPoints,
  outdir: rootDir,
  outbase: rootDir,
  platform: 'node',
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  logLevel: 'info',
});

await fixModuleSpecifiers(rootDir);

const tsc = spawnSync('npx', ['tsc', '-p', 'tsconfig.dts.json'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1);
}

await fixModuleSpecifiers(rootDir);

console.log(`Built ${entryPoints.length} JS and declaration files`);
