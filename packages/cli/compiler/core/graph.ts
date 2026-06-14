import { join, resolve } from 'path';

import * as esbuild from 'esbuild';

import { BUILD_CONTEXT } from '../build-context';
import { FileDependencyGraph } from '../types/dependency-graph';
import { DependencyInfo } from '../types/dependency-info';

export const DEPENDENCY_GRAPH: FileDependencyGraph = {};

/**
 * Creates a new dependency info object.
 * @returns A new DependencyInfo object.
 */
const createDependencyInfo = (): DependencyInfo => ({
  dependsOn: new Set<string>(),
  dependents: new Set<string>(),
});

/**
 * Adds a file to the dependency graph.
 * @param filePath - The path to the file to add.
 * @returns A promise that resolves to an array of files that depend on the added file.
 */
const addFile = async (filePath: string): Promise<Set<string>> => {
  const resolvedPath = resolve(process.cwd(), filePath);
  const result: Set<string> = new Set();

  if (DEPENDENCY_GRAPH[resolvedPath]) {
    result.add(resolvedPath);

    const dependents = DEPENDENCY_GRAPH[resolvedPath].dependents;
    for (const dependent of dependents) {
      result.add(dependent);

      // Recursively get transitive dependents
      const transitiveDependents = await addFile(dependent);
      for (const transitive of transitiveDependents) {
        result.add(transitive);
      }
    }

    return result;
  }

  const buildResult = await esbuild.build({
    entryPoints: [resolvedPath],
    outdir: join(BUILD_CONTEXT.PACKS.CACHE_PATH, 'dist'),
    bundle: true,
    write: false,
    metafile: true,
    alias: BUILD_CONTEXT.TS.ALIASES,
    tsconfig: BUILD_CONTEXT.TS.CONFIG_PATH,
    external: [
      '@minecraft/server',
      '@minecraft/server-ui',
      '@minecraft/server-net',
      '@minecraft/server-admin',
      '@minecraft/server-editor',
      '@minecraft/server-gametest',
      '@minecraft/server-editor-bindings',
      '@minecraft/debug-utilities',
      'fs',
      'path',
    ],
  });

  const { inputs } = buildResult.metafile;

  for (const file in inputs) {
    const resolvedPath = resolve(process.cwd(), file);
    const dependents: DependencyInfo = (DEPENDENCY_GRAPH[resolvedPath] ??=
      createDependencyInfo());
    dependents.dependsOn.clear();
    dependents.dependents.clear();

    result.add(resolvedPath);

    for (const { path } of inputs[file].imports) {
      const resolvedImportPath = resolve(process.cwd(), path);
      if (resolvedImportPath.endsWith('<runtime>')) {
        // Skip runtime files
        continue;
      }

      dependents.dependsOn.add(resolvedImportPath);
      result.add(resolvedImportPath);

      // Build the reverse dependency graph
      (DEPENDENCY_GRAPH[resolvedImportPath] ??=
        createDependencyInfo()).dependents.add(resolvedPath);
    }
  }

  return result;
};

/**
 * Removes a file from the dependency graph.
 * @param filePath - The path to the file to remove.
 */
const removeFile = (filePath: string) => {
  const resolvedPath = resolve(process.cwd(), filePath);

  if (!DEPENDENCY_GRAPH[resolvedPath]) {
    return;
  }

  const { dependents, dependsOn } = DEPENDENCY_GRAPH[resolvedPath];

  for (const dependent of dependents) {
    DEPENDENCY_GRAPH[dependent].dependsOn.delete(resolvedPath);
  }
  for (const dependency of dependsOn) {
    DEPENDENCY_GRAPH[dependency].dependents.delete(resolvedPath);
  }

  delete DEPENDENCY_GRAPH[resolvedPath];
};

/**
 * Rebuilds the file and all its dependencies.
 * @param filePath - The path to the file to rebuild.
 */
const updateFile = async (filePath: string): Promise<Set<string>> => {
  removeFile(filePath);

  return addFile(filePath);
};

/**
 * Builds the dependency graph for all files in the source directory.
 * @returns A promise that resolves when the build is complete.
 */
const create = async () => {
  const result = await esbuild.build({
    entryPoints: [
      join(BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH, '**/*.ts'),
      join(BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH, '**/*.ts'),
    ],
    outdir: join(BUILD_CONTEXT.PACKS.CACHE_PATH, 'dist'),
    bundle: true,
    write: false,
    metafile: true,
    alias: BUILD_CONTEXT.TS.ALIASES,
    tsconfig: BUILD_CONTEXT.TS.CONFIG_PATH,
    external: [
      '@minecraft/server',
      '@minecraft/server-ui',
      '@minecraft/server-net',
      '@minecraft/server-admin',
      '@minecraft/server-editor',
      '@minecraft/server-gametest',
      '@minecraft/server-editor-bindings',
      '@minecraft/debug-utilities',
      'fs',
      'path',
    ],
  });

  for (const [sourceFile, meta] of Object.entries(result.metafile.inputs)) {
    if (sourceFile.endsWith('<runtime>')) {
      // Skip runtime files
      continue;
    }

    const dependents: DependencyInfo = createDependencyInfo();

    const resolvedPath = resolve(process.cwd(), sourceFile);
    DEPENDENCY_GRAPH[resolvedPath] = dependents;

    for (const { path } of meta.imports) {
      const resolvedImportPath = resolve(process.cwd(), path);
      if (resolvedImportPath.endsWith('<runtime>')) {
        // Skip runtime files
        continue;
      }
      dependents.dependsOn.add(resolvedImportPath);

      // Build the reverse dependency graph
      (DEPENDENCY_GRAPH[resolvedImportPath] ??=
        createDependencyInfo()).dependents.add(resolvedPath);
    }
  }
};

const DependencyGraphActions = { addFile, removeFile, updateFile, create };

export { addFile, removeFile, updateFile, create };

export { DependencyGraphActions };
