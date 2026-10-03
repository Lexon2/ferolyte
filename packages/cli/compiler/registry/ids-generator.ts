import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

import { createEmptyIndex, RegistryIndex } from './project-registry';

export const IDS_RELATIVE_PATH = join('.ferolyte', 'types', 'ids.ts');

export const getIdsFilePath = (): string =>
  join(process.cwd(), IDS_RELATIVE_PATH);

/** `myaddon:big_zombie` -> `BigZombie` (the part after the namespace). */
export const toPascalName = (id: string, strip: RegExp | string = ''): string => {
  const path = id.includes(':') ? id.slice(id.indexOf(':') + 1) : id;
  const text = typeof strip === 'string' ? path.replace(strip, '') : path.replace(strip, '');
  const name = text
    .split(/[^A-Za-z0-9]+/)
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

  return /^[0-9]/.test(name) ? `_${name}` : name || '_';
};

export interface IdsWarning {
  message: string;
}

/**
 * Unique PascalCase keys for the ids of one section: collisions get a numeric
 * suffix and a warning. Ids are processed sorted, so the output is stable.
 */
const nameEntries = (
  section: string,
  ids: Iterable<string>,
  strip: RegExp | string,
  warnings: IdsWarning[],
): Array<[name: string, id: string]> => {
  const used = new Set<string>();
  const result: Array<[string, string]> = [];

  for (const id of [...new Set(ids)].sort()) {
    const base = toPascalName(id, strip);
    let name = base;
    for (let n = 2; used.has(name); n++) {
      name = `${base}${n}`;
    }
    if (name !== base) {
      warnings.push({
        message: `${section}: "${id}" collides with another id as "${base}", exported as "${name}"`,
      });
    }
    used.add(name);
    result.push([name, id]);
  }

  return result;
};

const quote = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

const flat = (
  section: string,
  ids: Iterable<string>,
  strip: RegExp | string,
  warnings: IdsWarning[],
): string => {
  const lines = nameEntries(section, ids, strip, warnings).map(
    ([name, id]) => `  ${name}: ${quote(id)},`,
  );

  return [
    `export const ${section} = {`,
    ...lines,
    `} as const;`,
    `export type ${section} = (typeof ${section})[keyof typeof ${section}];`,
  ].join('\n');
};

const nested = (
  section: string,
  groups: Array<[owner: string, ids: Iterable<string>]>,
  warnings: IdsWarning[],
): string => {
  const owners = nameEntries(
    section,
    groups.map(([owner]) => owner),
    '',
    warnings,
  );
  const byOwner = new Map(groups.map(([owner, ids]) => [owner, ids]));
  const blocks = owners.map(([ownerName, owner]) => {
    const entries = nameEntries(`${section}.${ownerName}`, byOwner.get(owner) ?? [], '', warnings);

    return [
      `  ${ownerName}: {`,
      ...entries.map(([name, id]) => `    ${name}: ${quote(id)},`),
      '  },',
    ].join('\n');
  });

  return [`export const ${section} = {`, ...blocks, '} as const;'].join('\n');
};

const rawKeyed = (
  section: string,
  groups: Array<[owner: string, ids: Iterable<string>]>,
  warnings: IdsWarning[],
): string => {
  const blocks = [...groups]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([owner, ids]) => {
      const entries = nameEntries(`${section}.${owner}`, ids, '', warnings);

      return [
        `  ${quote(owner)}: {`,
        ...entries.map(([name, id]) => `    ${name}: ${quote(id)},`),
        '  },',
      ].join('\n');
    });

  return [`export const ${section} = {`, ...blocks, '} as const;'].join('\n');
};

/**
 * Text of `.ferolyte/types/ids.ts`: typed constants for the project ids, usable
 * in pack content and in `@minecraft/server` scripts (no runtime dependencies).
 */
export const generateIdsSource = (
  index: RegistryIndex,
): { text: string; warnings: IdsWarning[] } => {
  const warnings: IdsWarning[] = [];
  const entities = [...index.entities.values()];

  const sections = [
    flat('EntityId', index.entities.keys(), '', warnings),
    flat('ItemId', index.items, '', warnings),
    flat('BlockId', index.blocks.keys(), '', warnings),
    flat('AnimationId', index.animations, /^animation\./, warnings),
    flat('AnimationControllerId', index.animationControllers, /^controller\.animation\./, warnings),
    flat('BpAnimationId', index.bpAnimations, /^animation\./, warnings),
    flat('BpAnimationControllerId', index.bpAnimationControllers, /^controller\.animation\./, warnings),
    flat('AttachableId', index.attachables, '', warnings),
    flat('RenderControllerId', index.renderControllers, /^controller\.render\./, warnings),
    flat('RecipeId', index.recipes, '', warnings),
    flat('SpawnRuleId', index.spawnRules, '', warnings),
    flat('GeometryId', index.geometries, /^geometry\./, warnings),
    flat('ItemTextureKey', index.itemTextures, '', warnings),
    flat('SoundId', index.sounds, '', warnings),
    nested('EntityEvent', entities.map((e) => [e.id, e.events]), warnings),
    nested('EntityProperty', entities.map((e) => [e.id, e.properties]), warnings),
    rawKeyed(
      'BlockState',
      [...index.blocks].map(([id, block]) => [id, block.states]),
      warnings,
    ),
  ];

  const text = [
    '// Generated by `ferolyte types` after every build. Do not edit.',
    '// Import with the `@ferolyte/ids` alias (tsconfig `paths`).',
    '',
    sections.join('\n\n'),
    '',
  ].join('\n');

  return { text, warnings };
};

/**
 * Writes the ids file when its content changed.
 * @returns `true` when the file was (re)written.
 */
export const writeIdsFile = async (
  index: RegistryIndex,
): Promise<{ written: boolean; warnings: IdsWarning[] }> => {
  const { text, warnings } = generateIdsSource(index);
  const file = getIdsFilePath();

  let current: string | undefined;
  try {
    current = await readFile(file, 'utf-8');
  } catch {
    current = undefined;
  }
  if (current === text) {
    return { written: false, warnings };
  }

  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, text, 'utf-8');

  return { written: true, warnings };
};

/**
 * Makes sure the ids file exists before bundling, so the `@ferolyte/ids` import
 * resolves on the very first build (it is filled in after the build).
 */
export const ensureIdsFile = async (): Promise<void> => {
  if (existsSync(getIdsFilePath())) {
    return;
  }
  const empty = createEmptyIndex();
  await writeIdsFile(empty);
};
