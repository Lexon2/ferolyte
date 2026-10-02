import { existsSync } from 'node:fs';
import { readdir, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const BUILD_ARTIFACT_PATTERN = /\.(js|d\.ts)(\.map)?$/;
const packageScriptsDir = join(rootDir, 'scripts');
const distDir = join(rootDir, 'dist');

const shouldSkipDir = (dirPath, entryName) =>
  entryName === 'node_modules' ||
  entryName === 'tests' ||
  entryName === 'dist' ||
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

    if (
      entry.name.endsWith('.ts') &&
      !entry.name.endsWith('.d.ts') &&
      !entry.name.endsWith('.test.ts')
    ) {
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

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDir(path, entry.name)) {
        continue;
      }

      await fixModuleSpecifiers(path);
      continue;
    }

    if (!entry.name.endsWith('.js') && !entry.name.endsWith('.d.ts')) {
      continue;
    }

    const content = await readFile(path, 'utf8');
    await writeFile(path, fixRelativeImports(content, path));
  }
}

await cleanBuildArtifacts(rootDir);
await rm(distDir, { recursive: true, force: true });

const entryPoints = await collectTsFiles(rootDir);

await esbuild.build({
  entryPoints,
  outdir: distDir,
  outbase: rootDir,
  platform: 'node',
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  logLevel: 'info',
});

await fixModuleSpecifiers(distDir);

const tsc = spawnSync('npx', ['tsc', '-p', 'tsconfig.dts.json'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1);
}

await fixModuleSpecifiers(distDir);

// `createRequire(import.meta.url)('../package.json')` in dist/cli/*.js resolves to this file.
const { name, version } = JSON.parse(
  await readFile(join(rootDir, 'package.json'), 'utf8'),
);
await writeFile(
  join(distDir, 'package.json'),
  `${JSON.stringify({ name, version, type: 'module' }, null, 2)}
`,
);

console.log(`Built ${entryPoints.length} JS and declaration files`);
