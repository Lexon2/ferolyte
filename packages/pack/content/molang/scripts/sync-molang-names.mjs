/**
 * Syncs Molang query and math name lists from bedrock.dev stable docs.
 * Usage: node packages/pack/content/molang/scripts/sync-molang-names.mjs [docs-path]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const typesDir = join(scriptDir, '..', 'types');
const defaultDocPath = join(
  scriptDir,
  '..',
  '..',
  '..',
  '..',
  '..',
  '.cursor',
  'projects',
  'e-inmine-tools-artifex-main',
  'agent-tools',
  'ef8908f3-82d9-43ec-b4be-795ccd4869d0.txt',
);

const docPath = process.argv[2] ?? defaultDocPath;
const doc = readFileSync(docPath, 'utf8');

const mathFunctions = [
  ...new Set([...doc.matchAll(/`math\.([a-z0-9_]+)\(/g)].map((m) => m[1])),
].sort();

const mathConstants = ['pi'];

const queryNames = [
  ...new Set([...doc.matchAll(/^#### query\.([a-z0-9_]+)/gm)].map((m) => m[1])),
].sort();

const snakeToPascal = (snake) =>
  snake.replace(/(^|_)([a-z0-9])/g, (_, __, char) => char.toUpperCase());

const formatUnion = (names) =>
  names.map((name) => `  | '${name}'`).join('\n');

const formatQueryEnum = (names) =>
  names
    .map((name) => `  ${snakeToPascal(name)} = '${name}',`)
    .join('\n');

writeFileSync(
  join(typesDir, 'math-names.ts'),
  `/**
 * @description https://bedrock.dev/docs/stable/Molang#Math%20Functions
 */
export type MolangMath = \`math.\${MolangMathFunctionNames | MolangMathConstantNames}\` | (string & {});

export type MolangMathConstantNames = ${mathConstants.map((n) => `'${n}'`).join(' | ')};

export type MolangMathFunctionNames =
${formatUnion(mathFunctions)};

export const MOLANG_MATH_FUNCTIONS = [
${mathFunctions.map((n) => `  '${n}',`).join('\n')}
] as const satisfies readonly MolangMathFunctionNames[];

export const MOLANG_MATH_CONSTANTS = [
${mathConstants.map((n) => `  '${n}',`).join('\n')}
] as const satisfies readonly MolangMathConstantNames[];
`,
);

writeFileSync(
  join(typesDir, 'query-names.ts'),
  `/**
 * @description https://bedrock.dev/docs/stable/Molang#List%20of%20Entity%20Queries
 */
export type MolangQuery = \`query.\${MolangQueryNames}\` | (string & {});

export const enum MolangQueryName {
${formatQueryEnum(queryNames)}
}

/** String union of all query names derived from {@link MolangQueryName}. */
export type MolangQueryNames = \`\${MolangQueryName}\`;

export const MOLANG_QUERY_NAMES = [
${queryNames.map((n) => `  '${n}',`).join('\n')}
] as const satisfies readonly MolangQueryNames[];
`,
);

console.log(
  `Synced ${mathFunctions.length} math functions, ${mathConstants.length} math constants, ${queryNames.length} queries.`,
);
