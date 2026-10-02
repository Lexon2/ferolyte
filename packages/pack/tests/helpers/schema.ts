import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

export type SchemaKind =
  | 'entity'
  | 'client_entity'
  | 'item'
  | 'block'
  | 'animation'
  | 'animation_controller_bp'
  | 'animation_controller_rp'
  | 'item_texture';

export const SCHEMAS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../.cache/bedrock-schemas',
);

export const schemasAvailable = existsSync(
  path.join(SCHEMAS_DIR, 'behavior', 'entities', 'entities.json'),
);

const SCHEMA_FILES: Record<SchemaKind, string> = {
  entity: 'behavior/entities/entities.json',
  client_entity: 'resource/entity/entity.json',
  item: 'behavior/items/items.json',
  block: 'behavior/blocks/blocks.json',
  animation: 'resource/animations/actor_animation.json',
  animation_controller_bp: 'behavior/animation_controllers/animation_controller.json',
  animation_controller_rp: 'resource/animation_controllers/animation_controller.json',
  item_texture: 'resource/textures/item_texture.json',
};

/**
 * Upstream bug workaround: some nodes declare `type` next to a `$ref` whose
 * target has a different `type` (e.g. `random_hover.hover_height` is `array`
 * but references the `{min,max}` object definition), which can never validate.
 * The referenced definition wins.
 */
const dropConflictingTypes = (root: any): void => {
  const resolve = (ref: string) =>
    ref
      .replace(/^#\//, '')
      .split('/')
      .reduce((node: any, key) => node?.[key], root);

  const walk = (node: any): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);

      return;
    }
    if (node === null || typeof node !== 'object') {
      return;
    }
    if (typeof node.$ref === 'string' && typeof node.type === 'string') {
      const target = resolve(node.$ref);
      if (typeof target?.type === 'string' && target.type !== node.type) {
        delete node.type;
      }
    }
    Object.values(node).forEach(walk);
  };

  walk(root);
};

const validators = new Map<SchemaKind, ValidateFunction>();

function getValidator(kind: SchemaKind): ValidateFunction {
  let validate = validators.get(kind);
  if (validate === undefined) {
    // One Ajv per schema: the compiled schemas are self-contained (only `#/definitions` refs)
    // and several share generic ids.
    const ajv = new Ajv({
      strict: false,
      allowUnionTypes: true,
      allErrors: true,
    });
    addFormats(ajv);
    const schema = JSON.parse(
      readFileSync(path.join(SCHEMAS_DIR, SCHEMA_FILES[kind]), 'utf8'),
    );
    dropConflictingTypes(schema);
    validate = ajv.compile(schema);
    validators.set(kind, validate);
  }

  return validate;
}

/** Validates `json` against the Blockception schema for `kind`; returns ajv errors (empty = valid). */
export function validateAgainst(kind: SchemaKind, json: unknown): ErrorObject[] {
  const validate = getValidator(kind);
  validate(json);

  return validate.errors ?? [];
}
