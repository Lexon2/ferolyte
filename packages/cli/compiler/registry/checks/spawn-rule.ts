import { ProjectDocument, RegistryIndex } from '../project-registry';
import { unknownMessage } from '../suggest';
import {
  RegistryCheckContext,
  defaultReporter,
  projectNamespaces,
} from './recipe';

/**
 * Spawn rule references: the `identifier` must be an entity of the project (vanilla entities are never checked),
 * and that entity must not opt out of spawning (`is_spawnable: false`).
 */
export const checkSpawnRuleDocument = (
  document: ProjectDocument,
  index: RegistryIndex,
  ctx: RegistryCheckContext = {},
): void => {
  const report = ctx.report ?? defaultReporter(document);
  const namespaces = ctx.namespaces ?? projectNamespaces(index);
  const id = document.json?.['minecraft:spawn_rules']?.description?.identifier;
  if (typeof id !== 'string') {
    return;
  }

  const entity = index.entities.get(id);
  if (entity === undefined) {
    const namespace = id.slice(0, id.indexOf(':'));
    if (namespaces.has(namespace)) {
      report(
        'minecraft:spawn_rules.description.identifier',
        unknownMessage('entity', id, index.entities.keys()),
      );
    }

    return;
  }
  if (entity.json?.['minecraft:entity']?.description?.is_spawnable === false) {
    report(
      'minecraft:spawn_rules.description.identifier',
      `entity "${id}" has is_spawnable: false, check that a spawn rule for a non-spawnable entity is intended`,
    );
  }
};
