import { dirname } from 'path';
import { EntityInfo, ProjectDocument, RegistryIndex } from './project-registry';
import { REFERENCE_CHECKS } from './checks';
import {
  checkRenderDescription,
  report,
  walk,
} from './checks/shared';
import { unknownMessage } from './suggest';
import {
  VANILLA_ITEM_TEXTURE_KEYS,
  VANILLA_LOOT_TABLE_PATHS,
  VANILLA_TERRAIN_TEXTURE_KEYS,
} from './vanilla-texture-keys.generated';

const VANILLA_TERRAIN = new Set(VANILLA_TERRAIN_TEXTURE_KEYS);
const VANILLA_ITEM = new Set(VANILLA_ITEM_TEXTURE_KEYS);
const VANILLA_LOOT = new Set(VANILLA_LOOT_TABLE_PATHS);

const checkItem = (document: ProjectDocument, index: RegistryIndex) => {
  if (index.itemTextures.size === 0) {
    return;
  }
  const icon = document.json['minecraft:item']?.components?.['minecraft:icon'];
  const key = typeof icon === 'string' ? icon : icon?.textures?.default;
  if (typeof key === 'string' && !index.itemTextures.has(key) && !VANILLA_ITEM.has(key)) {
    report(document, 'components.minecraft:icon', unknownMessage('item texture key', key, index.itemTextures));
  }
};

/** Block loot table path, culling rule / voxel shape ids declared by no file of the pack. */
const checkBlockReferences = (document: ProjectDocument, index: RegistryIndex) => {
  const components = document.json['minecraft:block']?.components ?? {};
  const loot = components['minecraft:loot'];
  checkPathReference(
    document,
    'components.minecraft:loot',
    'loot table',
    typeof loot === 'string' ? loot : loot?.table,
    index.lootTables,
    VANILLA_LOOT,
  );

  const geometry = components['minecraft:geometry'];
  if (typeof geometry !== 'object' || geometry === null) {
    return;
  }
  // `culling` names a culling rule (or a voxel shape); `culling_shape` a voxel shape. `minecraft:` ids are built in.
  const declared = (id: unknown, ...sets: ReadonlySet<string>[]) =>
    typeof id !== 'string' ||
    id.startsWith('minecraft:') ||
    sets.some((set) => set.has(id));
  if (!declared(geometry.culling, index.cullingRules, index.voxelShapes)) {
    report(
      document,
      'components.minecraft:geometry.culling',
      unknownMessage('culling rule', geometry.culling, [...index.cullingRules, ...index.voxelShapes]),
    );
  }
  if (!declared(geometry.culling_shape, index.voxelShapes)) {
    report(
      document,
      'components.minecraft:geometry.culling_shape',
      unknownMessage('voxel shape', geometry.culling_shape, index.voxelShapes),
    );
  }
};

const checkBlock = (document: ProjectDocument, index: RegistryIndex) => {
  checkBlockReferences(document, index);
  if (index.terrainTextures.size === 0) {
    return;
  }
  const instances =
    document.json['minecraft:block']?.components?.['minecraft:material_instances'];
  const entries =
    instances?.mappings ?? instances;
  for (const [name, instance] of Object.entries(entries ?? {})) {
    const texture = (instance as { texture?: unknown })?.texture;
    if (
      typeof texture === 'string' &&
      !index.terrainTextures.has(texture) &&
      !VANILLA_TERRAIN.has(texture)
    ) {
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
  vanilla: ReadonlySet<string> = new Set(),
) => {
  if (
    typeof value !== 'string' ||
    known.size === 0 ||
    known.has(value) ||
    vanilla.has(value)
  ) {
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
        checkPathReference(document, `${path}.${component}.table`, 'loot table', node[component].table, index.lootTables, VANILLA_LOOT);
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
        checkRenderDescription(
          document,
          document.json['minecraft:client_entity']?.description,
          index,
        );
        break;
      case 'attachable':
        checkRenderDescription(
          document,
          document.json['minecraft:attachable']?.description,
          index,
        );
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

  for (const check of REFERENCE_CHECKS) {
    check(index, only);
  }
};
