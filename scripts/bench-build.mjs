// Benchmark: cold build + repeated rebuilds of a ferolyte project.
//
//   node scripts/bench-build.mjs --project ../my-addon            (current sources)
//   node scripts/bench-build.mjs --project <dir> --cli <dir>/node_modules/@ferolyte/cli (installed package)
//
// The project is copied to a temp dir first (node_modules is linked), so the real
// output folders of the project are never touched. Run it with a TypeScript-aware
// runner for the project config, e.g. `npx tsx scripts/bench-build.mjs ...`.
import { cp, mkdir, mkdtemp, readdir, rm, symlink, unlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const index = args.indexOf(`--${name}`);

  return index === -1 ? fallback : args[index + 1];
};

const project = resolve(arg('project', '.'));
const profile = arg('profile', 'build');
const rebuilds = Number(arg('rebuilds', '20'));
const extraFiles = Number(arg('extra-files', '0'));
const sharedFile = arg('shared', 'src/common/constants.ts');
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

const buildFromSources = async () => {
  const outdir = join(repoRoot, 'packages/cli/.bench-dist');
  await rm(outdir, { recursive: true, force: true });
  await esbuild.build({
    entryPoints: [
      join(repoRoot, 'packages/cli/compiler/actions/build.ts'),
      join(repoRoot, 'packages/cli/compiler/core/builder.ts'),
      join(repoRoot, 'packages/cli/compiler/core/graph.ts'),
    ],
    outdir,
    outbase: join(repoRoot, 'packages/cli'),
    bundle: true,
    splitting: true,
    format: 'esm',
    platform: 'node',
    packages: 'external',
    logLevel: 'error',
  });

  return outdir;
};

const findContentFile = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = await findContentFile(path);
      if (found) {
        return found;
      }
    } else if (entry.name.endsWith('.se.ts')) {
      return path;
    }
  }
};

const workdir = await mkdtemp(join(tmpdir(), 'ferolyte-bench-'));
for (const item of ['src', 'lib-v2', 'artifex']) {
  if (existsSync(join(project, item))) {
    await cp(join(project, item), join(workdir, item), { recursive: true });
  }
}
for (const item of ['tsconfig.json', 'package.json', 'ferolyte.config.mts']) {
  await cp(join(project, item), join(workdir, item));
}
// Many small copied files (textures, sounds...) to measure copy throughput.
for (let i = 0; i < extraFiles; i++) {
  const dir = join(workdir, 'src/packs/RP/textures/bench', String(i % 50));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, i + '.png'), 'bench-' + i);
}
const sdkDir = arg('sdk') ? resolve(arg('sdk')) : undefined;
if (sdkDir) {
  // Use the workspace packages (as a local install would) instead of the project's own @ferolyte/*.
  await mkdir(join(workdir, 'node_modules/@ferolyte'), { recursive: true });
  for (const name of await readdir(join(project, 'node_modules'))) {
    if (name !== '@ferolyte' && name !== '.bin') {
      await symlink(join(project, 'node_modules', name), join(workdir, 'node_modules', name), 'junction');
    }
  }
  for (const name of ['cli', 'common', 'pack']) {
    await symlink(join(sdkDir, name), join(workdir, 'node_modules/@ferolyte', name), 'junction');
  }
} else {
  await symlink(join(project, 'node_modules'), join(workdir, 'node_modules'), 'junction');
}
process.chdir(workdir);

const cliDir = arg('cli') ? resolve(arg('cli')) : await buildFromSources();
const load = (path) => import(pathToFileURL(join(cliDir, path)).href);
const { build } = await load('compiler/actions/build.js');
const builder = await load('compiler/core/builder.js');
const graph = await load('compiler/core/graph.js');

const options = { debug: false, diagnostics: false };
const time = async (fn) => {
  const start = performance.now();
  await fn();

  return performance.now() - start;
};
const stats = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

  return `mean ${mean.toFixed(0)} ms, median ${sorted[Math.floor(sorted.length / 2)].toFixed(0)} ms`;
};

console.log(`extra copied files: ${extraFiles}`);
console.log(`project: ${project}\ncli:     ${cliDir}\nprofile: ${profile}`);

const cold = await time(() => build({ profile, ...options }));
console.log(`cold build: ${cold.toFixed(0)} ms`);

// The old implementation needs an explicit graph pass before rebuilds.
if (graph.DependencyGraphActions?.create) {
  console.log(`graph create: ${(await time(() => graph.DependencyGraphActions.create())).toFixed(0)} ms`);
}

const contentFile = await findContentFile(join(workdir, 'src/packs'));
const contentTimes = [];
for (let i = 0; i < rebuilds; i++) {
  contentTimes.push(await time(() => builder.rebuildFile(contentFile, options)));
}
console.log(`rebuild content file x${rebuilds}: ${stats(contentTimes)}`);

const shared = join(workdir, sharedFile);
let affected = 0;
const sharedTimes = [];
for (let i = 0; i < Math.min(rebuilds, 5); i++) {
  sharedTimes.push(
    await time(async () => {
      affected = (await builder.rebuildFile(shared, options)).length;
    }),
  );
}
console.log(`rebuild shared file x${sharedTimes.length}: ${stats(sharedTimes)} (${affected} entries rebuilt)`);

process.chdir(tmpdir());
if (!sdkDir) await unlink(join(workdir, 'node_modules')).catch(() => {});
await rm(workdir, { recursive: true, force: true }).catch(() => {});
if (!arg('cli')) {
  await rm(join(repoRoot, 'packages/cli/.bench-dist'), { recursive: true, force: true });
}
process.exit(0);
