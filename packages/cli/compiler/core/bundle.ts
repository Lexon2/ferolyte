import { dirname, join, resolve } from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { Script } from 'vm';

import * as esbuild from 'esbuild';

import { setEntryInputs } from './graph';
import { DEFAULT_CONCURRENCY, mapLimit } from '../utils/map-limit';
import { BundleOptions, createEsbuildConfig } from './utils/build-esbuild-config';

export interface BundledEntry {
  /** Absolute path of the content entry. */
  entry: string;
  /** CommonJS bundle of the entry. */
  code: string;
  /** Every file the entry depends on (the entry itself included). */
  inputs: Set<string>;
  /** `@ferolyte/*` specifiers left external (served from the shared SDK instance). */
  externals: Set<string>;
}

export interface BundleFailure {
  entry: string;
  error: unknown;
}

export interface BundleResult {
  bundled: BundledEntry[];
  failed: BundleFailure[];
}

const isSdkSpecifier = (specifier: string): boolean =>
  /^@ferolyte\/(pack|common)(\/|$)/.test(specifier);

/**
 * Namespaces of the externalized SDK modules, loaded once per process and shared
 * by every evaluated bundle (one SDK instance: `instanceof`, diagnostics sink).
 */
const sdkModules = new Map<string, Record<string, unknown>>();

/** Forgets the loaded SDK modules (tests). */
export const clearExternalModules = (): void => {
  sdkModules.clear();
};

/** CommonJS view of an ES module namespace (`__esModule`, named exports, `default`). */
const toCommonJs = (namespace: Record<string, unknown>): Record<string, unknown> => {
  const view: Record<string, unknown> = {};
  Object.defineProperty(view, '__esModule', { value: true });
  for (const key of Object.keys(namespace)) {
    Object.defineProperty(view, key, {
      enumerable: true,
      get: () => namespace[key],
    });
  }
  if (!('default' in view)) {
    Object.defineProperty(view, 'default', { enumerable: true, value: namespace });
  }

  return view;
};

/**
 * `import()`s each specifier once per process, resolved from the project root
 * (the user's `node_modules`), so bundles can `require` the shared instance.
 */
export const loadExternalModules = async (
  specifiers: Iterable<string>,
  projectRoot: string = process.cwd(),
): Promise<void> => {
  const projectRequire = createRequire(join(projectRoot, 'package.json'));

  await Promise.all(
    [...new Set(specifiers)]
      .filter((specifier) => !sdkModules.has(specifier))
      .map(async (specifier) => {
        const file = projectRequire.resolve(specifier);
        const namespace = (await import(pathToFileURL(file).href)) as Record<string, unknown>;
        sdkModules.set(specifier, toCommonJs(namespace));
      }),
  );
};

/**
 * Collects every file reachable from the entry through the metafile import graph.
 * Walking the imports (instead of using `outputs[].inputs`) also keeps
 * tree-shaken modules, so a change in them still triggers a rebuild.
 */
const collectInputs = (
  entry: string,
  metafile: esbuild.Metafile,
  cwd: string,
): Set<string> => {
  const known = new Map<string, esbuild.Metafile['inputs'][string]>();
  for (const [file, meta] of Object.entries(metafile.inputs)) {
    known.set(resolve(cwd, file), meta);
  }

  const visited = new Set<string>();
  const stack = [entry];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    for (const imported of known.get(current)?.imports ?? []) {
      if (imported.external) {
        continue;
      }
      const importedPath = resolve(cwd, imported.path);
      if (known.has(importedPath)) {
        stack.push(importedPath);
      }
    }
  }

  return visited;
};

const bundleOnce = async (
  entries: string[],
  options: BundleOptions,
): Promise<BundledEntry[]> => {
  const cwd = process.cwd();
  const result = await esbuild.build(createEsbuildConfig(entries, options));
  const metafile = result.metafile;
  if (!metafile) {
    throw new Error('esbuild did not return a metafile');
  }
  const outputs = new Map<string, string>();
  for (const file of result.outputFiles ?? []) {
    outputs.set(resolve(file.path), file.text);
  }

  const bundled: BundledEntry[] = [];
  for (const [outPath, output] of Object.entries(metafile.outputs)) {
    if (!output.entryPoint) {
      continue;
    }
    const code = outputs.get(resolve(cwd, outPath));
    if (code === undefined) {
      continue;
    }
    const entry = resolve(cwd, output.entryPoint);
    // Output imports list what the bundle really requires (the input graph also
    // lists type-only imports that esbuild dropped).
    const externals = new Set(
      output.imports
        .filter((imported) => imported.external && isSdkSpecifier(imported.path))
        .map((imported) => imported.path),
    );
    const inputs = collectInputs(entry, metafile, cwd);
    bundled.push({ entry, code, inputs, externals });
  }

  return bundled;
};

/**
 * Bundles content entries in one esbuild pass and refreshes their graph nodes.
 * If the combined pass fails, entries are bundled one by one so a broken file
 * does not block the others.
 * @param entries - Absolute content entry paths.
 */
export const bundleEntries = async (
  entries: string[],
  options: BundleOptions = {},
): Promise<BundleResult> => {
  const bundled: BundledEntry[] = [];
  const failed: BundleFailure[] = [];
  if (entries.length === 0) {
    return { bundled, failed };
  }

  try {
    bundled.push(...(await bundleOnce(entries, options)));
  } catch (error) {
    if (entries.length === 1) {
      failed.push({ entry: entries[0], error });
    } else {
      const results = await mapLimit(
        entries,
        DEFAULT_CONCURRENCY,
        async (entry) => {
          try {
            return await bundleOnce([entry], options);
          } catch (entryError) {
            failed.push({ entry, error: entryError });
            return [];
          }
        },
      );
      bundled.push(...results.flat());
    }
  }

  for (const { entry, inputs } of bundled) {
    setEntryInputs(entry, inputs);
  }

  await loadExternalModules(bundled.flatMap((entry) => [...entry.externals]));

  return { bundled, failed };
};

/**
 * Evaluates a CommonJS bundle in memory and returns its exports.
 * @param code - The bundle source.
 * @param filename - The entry path, used for `require` resolution and stack traces.
 */
export const evaluateBundle = (code: string, filename: string): unknown => {
  const module = { exports: {} as unknown };
  const wrapper = new Script(
    `(function (exports, require, module, __filename, __dirname) {${code}\n})`,
    { filename },
  ).runInThisContext() as (...args: unknown[]) => void;

  const fallback = createRequire(filename);
  const contentRequire = (specifier: string) => {
    const shared = sdkModules.get(specifier);
    if (shared !== undefined) {
      return shared;
    }
    if (isSdkSpecifier(specifier)) {
      throw new Error(`SDK module "${specifier}" was not loaded before evaluating ${filename}`);
    }

    return fallback(specifier);
  };

  wrapper.call(
    module.exports,
    module.exports,
    contentRequire,
    module,
    filename,
    dirname(filename),
  );

  return module.exports;
};
