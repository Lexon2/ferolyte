import { existsSync } from 'fs';
import { dirname, join } from 'path';

import {
  ContentDiagnosticContext,
  logContentError,
  logContentWarning,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BUILD_CONTEXT } from '../build-context';
import {
  EntityInfo,
  isStrictReferences,
  ProjectDocument,
  RegistryIndex,
} from './project-registry';
import { unknownMessage } from './suggest';

const TEXTURE_EXTENSIONS = ['.png', '.tga', '.jpg', '.jpeg'];

const report = (
  document: ProjectDocument,
  fieldPath: string,
  message: string,
): void => {
  const ctx: ContentDiagnosticContext = {
    sourceFile: document.source,
    contentType: document.kind,
    fieldPath,
    diagnostics: true,
  };
  if (isStrictReferences()) {
    logContentError(ctx, message);
  } else {
    logContentWarning(ctx, message);
  }
};

const namespaceToken = (): string =>
  BUILD_CONTEXT.PACKS.NAMESPACE.toLowerCase().replace(/[^a-z0-9_]/g, '');

/**
 * Whether an id probably belongs to this project (and not to vanilla, which the
 * registry cannot know): it contains the pack namespace, or it lives next to
 * known project ids (same prefix up to the last dot).
 */
const isOwned = (id: string, known: Iterable<string>): boolean => {
  const token = namespaceToken();
  if (token.length > 0 && id.toLowerCase().includes(token)) {
    return true;
  }
  const dot = id.lastIndexOf('.');
  // The shared prefix must be specific (>= 2 dots), so vanilla ids next to project ones are not flagged.
  if (dot <= 0 || id.slice(0, dot).split('.').length < 3) {
    return false;
  }
  const prefix = `${id.slice(0, dot)}.`;
  for (const candidate of known) {
    if (candidate.startsWith(prefix)) {
      return true;
    }
  }

  return false;
};

const checkId = (
  document: ProjectDocument,
  fieldPath: string,
  what: string,
  id: unknown,
  known: ReadonlySet<string>,
  extraKnown: Iterable<string> = [],
): void => {
  if (typeof id !== 'string' || known.has(id)) {
    return;
  }
  const all = [...known, ...extraKnown];
  if (all.includes(id) || !isOwned(id, all)) {
    return;
  }
  report(document, fieldPath, unknownMessage(what, id, all));
};

/** Texture path missing in a folder the project owns (vanilla textures are not in the packs). */
const checkTexturePath = (
  document: ProjectDocument,
  fieldPath: string,
  texture: unknown,
): void => {
  if (typeof texture !== 'string' || !texture.startsWith('textures/')) {
    return;
  }
  const root = BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH;
  const base = join(root, texture);
  if (
    TEXTURE_EXTENSIONS.some((ext) => existsSync(`${base}${ext}`)) ||
    existsSync(base) ||
    !existsSync(dirname(base))
  ) {
    return;
  }
  report(document, fieldPath, `missing texture "${texture}" (no .png/.tga in the resource pack)`);
};

const walk = (
  node: unknown,
  path: string,
  visit: (value: any, path: string) => void,
): void => {
  if (node === null || typeof node !== 'object') {
    return;
  }
  visit(node, path);
  for (const [key, child] of Object.entries(node)) {
    walk(child, path ? `${path}.${key}` : key, visit);
  }
};

const checkClientEntity = (document: ProjectDocument, index: RegistryIndex) => {
  const description = document.json['minecraft:client_entity']?.description;
  if (!description) {
    return;
  }

  for (const [key, geometry] of Object.entries(description.geometry ?? {})) {
    checkId(document, `geometry.${key}`, 'geometry', geometry, index.geometries);
  }

  const animationIds = new Set([
    ...index.animations,
    ...index.generatedAnimations,
    ...index.animationControllers,
  ]);
  for (const [key, animation] of Object.entries(description.animations ?? {})) {
    checkId(document, `animations.${key}`, 'animation', animation, animationIds);
  }

  const renderControllers: unknown[] = Array.isArray(description.render_controllers)
    ? description.render_controllers
    : [];
  for (const item of renderControllers) {
    const id = typeof item === 'string' ? item : Object.keys(item ?? {})[0];
    checkId(document, 'render_controllers', 'render controller', id, index.renderControllers);
  }

  for (const [key, texture] of Object.entries(description.textures ?? {})) {
    checkTexturePath(document, `textures.${key}`, texture);
  }

  const animationKeys = new Set(Object.keys(description.animations ?? {}));
  const animate: unknown[] = Array.isArray(description.scripts?.animate)
    ? description.scripts.animate
    : [];
  for (const item of animate) {
    const name = typeof item === 'string' ? item : Object.keys(item ?? {})[0];
    if (typeof name === 'string' && !animationKeys.has(name)) {
      report(
        document,
        'scripts.animate',
        unknownMessage('animation key', name, animationKeys),
      );
    }
  }
};

const checkItem = (document: ProjectDocument, index: RegistryIndex) => {
  if (index.itemTextures.size === 0) {
    return;
  }
  const icon = document.json['minecraft:item']?.components?.['minecraft:icon'];
  const key = typeof icon === 'string' ? icon : icon?.textures?.default;
  if (typeof key === 'string' && !index.itemTextures.has(key)) {
    report(document, 'components.minecraft:icon', unknownMessage('item texture key', key, index.itemTextures));
  }
};

const checkBlock = (document: ProjectDocument, index: RegistryIndex) => {
  if (index.terrainTextures.size === 0) {
    return;
  }
  const instances =
    document.json['minecraft:block']?.components?.['minecraft:material_instances'];
  const entries =
    instances?.mappings ?? instances;
  for (const [name, instance] of Object.entries(entries ?? {})) {
    const texture = (instance as { texture?: unknown })?.texture;
    if (typeof texture === 'string' && !index.terrainTextures.has(texture)) {
      report(
        document,
        `components.minecraft:material_instances.${name}`,
        unknownMessage('terrain texture key', texture, index.terrainTextures),
      );
    }
  }
};

const PROPERTY_CALL = /(?:q|query)\.property\(\s*'([^']+)'\s*\)/g;

const checkPathReference = (
  document: ProjectDocument,
  fieldPath: string,
  what: string,
  value: unknown,
  known: ReadonlySet<string>,
) => {
  if (typeof value !== 'string' || known.size === 0 || known.has(value)) {
    return;
  }
  const folder = `${dirname(value)}/`;
  const sameFolder = [...known].filter((path) => path.startsWith(folder));
  if (sameFolder.length === 0) {
    return;
  }
  report(document, fieldPath, unknownMessage(what, value, sameFolder));
};

const checkServerEntity = (document: ProjectDocument, index: RegistryIndex) => {
  const entity: EntityInfo | undefined = [...index.entities.values()].find(
    (info) => info.json === document.json,
  );
  const root = document.json['minecraft:entity'];
  if (!entity || !root) {
    return;
  }

  walk(root.events, 'events', (node, path) => {
    for (const side of ['add', 'remove']) {
      const groups = node[side]?.component_groups;
      if (!Array.isArray(groups)) {
        continue;
      }
      for (const group of groups) {
        if (typeof group === 'string' && !entity.componentGroups.has(group)) {
          report(
            document,
            `${path}.${side}.component_groups`,
            unknownMessage('component group', group, entity.componentGroups),
          );
        }
      }
    }
  });

  const checkEvent = (name: unknown, path: string) => {
    if (
      typeof name === 'string' &&
      !name.startsWith('minecraft:') &&
      !entity.events.has(name)
    ) {
      report(document, path, unknownMessage('event', name, entity.events));
    }
  };

  const checkProperty = (name: string, path: string) => {
    if (!name.startsWith('minecraft:') && !entity.properties.has(name)) {
      report(document, path, unknownMessage('entity property', name, entity.properties));
    }
  };

  walk(root, '', (node, path) => {
    if (typeof node.event === 'string' && (node.target === undefined || node.target === 'self')) {
      checkEvent(node.event, path ? `${path}.event` : 'event');
    }
    if (path.startsWith('events.') && node.trigger !== undefined) {
      const trigger = typeof node.trigger === 'string' ? node.trigger : undefined;
      checkEvent(trigger, `${path}.trigger`);
    }
    for (const component of ['minecraft:loot']) {
      if (node[component]) {
        checkPathReference(document, `${path}.${component}.table`, 'loot table', node[component].table, index.lootTables);
      }
    }
    for (const component of ['minecraft:trade_table', 'minecraft:economy_trade_table']) {
      if (node[component]) {
        checkPathReference(document, `${path}.${component}.table`, 'trade table', node[component].table, index.tradeTables);
      }
    }
    if (node.set_property && typeof node.set_property === 'object') {
      for (const name of Object.keys(node.set_property)) {
        checkProperty(name, `${path}.set_property`);
      }
    }
  });

  const seen = new Set<string>();
  walk(root, '', (node, path) => {
    for (const [key, value] of Object.entries(node)) {
      if (typeof value !== 'string') {
        continue;
      }
      for (const match of value.matchAll(PROPERTY_CALL)) {
        const name = match[1];
        const id = `${path}.${key}|${name}`;
        if (!seen.has(id)) {
          seen.add(id);
          checkProperty(name, `${path ? `${path}.` : ''}${key}`);
        }
      }
    }
  });
};

/**
 * Checks the references between content and pack files. Problems are
 * warnings (errors with `--strict`) with a "did you mean" suggestion.
 * @param only - Limit the checks to documents of these source files.
 */
export const runReferenceChecks = (
  index: RegistryIndex,
  only?: ReadonlySet<string>,
): void => {
  for (const document of index.documents) {
    if (only && !only.has(document.source)) {
      continue;
    }
    switch (document.kind) {
      case 'client-entity':
        checkClientEntity(document, index);
        break;
      case 'item':
        checkItem(document, index);
        break;
      case 'block':
        checkBlock(document, index);
        break;
      case 'server-entity':
        checkServerEntity(document, index);
        break;
      default:
        break;
    }
  }
};
