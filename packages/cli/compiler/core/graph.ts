import { resolve } from 'path';

/**
 * Dependency graph between content entries and the files they import.
 *
 * - `entry -> Set<input>`: every file reachable from the entry (the entry itself included).
 * - `input -> Set<entry>`: reverse index, derived from the forward sets.
 *
 * An entry's input set is always replaced as a whole, shared inputs are never cleared.
 */
const ENTRY_INPUTS = new Map<string, Set<string>>();
const INPUT_ENTRIES = new Map<string, Set<string>>();

const NODE_MODULES_PATTERN = /[\\/]node_modules[\\/]/;

const normalize = (filePath: string) => resolve(process.cwd(), filePath);

/**
 * Whether the path is something the graph tracks (synthetic esbuild ids and
 * `node_modules` are ignored).
 */
export const isTrackedInput = (filePath: string) =>
  !filePath.includes('<runtime>') && !NODE_MODULES_PATTERN.test(filePath);

const detach = (entryPath: string, input: string) => {
  const entries = INPUT_ENTRIES.get(input);
  entries?.delete(entryPath);
  if (entries?.size === 0) {
    INPUT_ENTRIES.delete(input);
  }
};

/**
 * Atomically replaces the input set of an entry and updates the reverse index.
 * @param entry - The content entry file.
 * @param inputs - Every file the entry depends on.
 */
export const setEntryInputs = (entry: string, inputs: Iterable<string>) => {
  const entryPath = normalize(entry);
  const next = new Set<string>([entryPath]);
  for (const input of inputs) {
    const inputPath = normalize(input);
    if (isTrackedInput(inputPath)) {
      next.add(inputPath);
    }
  }

  for (const input of ENTRY_INPUTS.get(entryPath) ?? []) {
    if (!next.has(input)) {
      detach(entryPath, input);
    }
  }

  for (const input of next) {
    let entries = INPUT_ENTRIES.get(input);
    if (!entries) {
      entries = new Set();
      INPUT_ENTRIES.set(input, entries);
    }
    entries.add(entryPath);
  }

  ENTRY_INPUTS.set(entryPath, next);
};

/**
 * Adds extra dependencies to an entry that were discovered while building it
 * (files the bundler does not see, e.g. source animations).
 */
export const addEntryInputs = (entry: string, inputs: Iterable<string>) => {
  const entryPath = normalize(entry);
  const current = ENTRY_INPUTS.get(entryPath);
  if (!current) {
    return;
  }
  setEntryInputs(entryPath, [...current, ...inputs]);
};

/**
 * Removes an entry from the graph.
 * @param entry - The content entry file.
 */
export const removeEntry = (entry: string) => {
  const entryPath = normalize(entry);
  for (const input of ENTRY_INPUTS.get(entryPath) ?? []) {
    detach(entryPath, input);
  }
  ENTRY_INPUTS.delete(entryPath);
};

/**
 * Content entries that must be rebuilt when the file changes (the file itself
 * included when it is an entry).
 * @param filePath - The changed file.
 */
export const getDependentEntries = (filePath: string): Set<string> =>
  new Set(INPUT_ENTRIES.get(normalize(filePath)));

/**
 * Whether the entry has been built (is known to the graph).
 */
export const hasEntry = (entry: string) => ENTRY_INPUTS.has(normalize(entry));

/**
 * Every tracked input file known to the graph.
 */
export const getGraphInputs = (): string[] => [...INPUT_ENTRIES.keys()];

/**
 * Drops the whole graph.
 */
export const clearGraph = () => {
  ENTRY_INPUTS.clear();
  INPUT_ENTRIES.clear();
};

const DependencyGraphActions = {
  setEntryInputs,
  removeEntry,
  getDependentEntries,
  hasEntry,
  getGraphInputs,
  clearGraph,
};

export { DependencyGraphActions };
