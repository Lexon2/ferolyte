import { unknownMessage } from '../suggest';
import { ProjectDocument, RegistryIndex } from '../project-registry';
import { report, walk } from './shared';
import type { ReferenceCheck } from './index';

const KEY_PATTERN = /\b(Geometry|Texture|Material)\.([A-Za-z0-9_]+)/g;

const SECTIONS = { Geometry: 'geometry', Texture: 'textures', Material: 'materials' } as const;

const descriptionOf = (document: ProjectDocument): any =>
  document.json?.['minecraft:client_entity']?.description ??
  document.json?.['minecraft:attachable']?.description;

/** `Geometry.x` / `Texture.x` / `Material.x` tokens used by a render controller body. */
const referencedKeys = (body: unknown): Map<string, Set<string>> => {
  const keys = new Map<string, Set<string>>();
  walk(body, '', (node) => {
    for (const value of Object.values(node)) {
      const texts = typeof value === 'string' ? [value] : Array.isArray(value) ? value : [];
      for (const text of texts) {
        if (typeof text !== 'string') {
          continue;
        }
        for (const match of text.matchAll(KEY_PATTERN)) {
          const section = match[1] as keyof typeof SECTIONS;
          (keys.get(section) ?? keys.set(section, new Set()).get(section)!).add(match[2]);
        }
      }
    }
  });

  return keys;
};

/** Ids of the render controllers a client entity / attachable description uses. */
const usedControllers = (description: any): string[] =>
  (Array.isArray(description?.render_controllers) ? description.render_controllers : []).map(
    (item: unknown) => (typeof item === 'string' ? item : Object.keys(item ?? {})[0]),
  );

/**
 * Every `Geometry.x` / `Texture.x` / `Material.x` a render controller refers to must be a key of the
 * `geometry` / `textures` / `materials` map of each client entity and attachable that uses the controller.
 */
export const renderControllerCheck: ReferenceCheck = (index: RegistryIndex, only) => {
  const users = index.documents.filter(
    (document) => document.kind === 'client-entity' || document.kind === 'attachable',
  );

  for (const document of index.documents) {
    if (document.kind !== 'render-controller') {
      continue;
    }
    const controllers: Record<string, unknown> = document.json?.render_controllers ?? {};

    for (const [id, body] of Object.entries(controllers)) {
      const keys = referencedKeys(body);
      if (keys.size === 0) {
        continue;
      }

      for (const user of users) {
        const description = descriptionOf(user);
        if (!usedControllers(description).includes(id)) {
          continue;
        }
        if (only && !only.has(document.source) && !only.has(user.source)) {
          continue;
        }

        for (const [token, names] of keys) {
          const section = SECTIONS[token as keyof typeof SECTIONS];
          const defined = new Set<string>(
            Object.keys(description[section] ?? {}).map((key) => key.toLowerCase()),
          );
          for (const name of names) {
            if (defined.has(name.toLowerCase())) {
              continue;
            }
            const owner = description.identifier ?? user.source;
            report(
              document,
              `render_controllers.${id}`,
              `${unknownMessage(`${section} key`, `${token}.${name}`, [...defined].map((key) => `${token}.${key}`))} in "${owner}"`,
            );
          }
        }
      }
    }
  }
};
