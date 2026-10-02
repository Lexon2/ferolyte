import type { MolangBuilder } from '../molang/format-molang-value';
import {
  formatEntityScriptsAnimate,
  parseMolangExpression,
  parseMolangStatement,
} from '../molang/parse-molang-expression';
import type {
  ClientEntityAnimationOptions,
  ClientEntityAnimationResolver,
} from '../client-entity/interfaces/animations-collection';

/** A string, or a record (a plain string means `{ default: value }`). */
export type RenderMap = string | Record<string, string>;

/**
 * Fields shared by the render descriptions of client entities and attachables:
 * `geometry` / `textures` / `materials` as a string or a map, animations (with the
 * F3 options and clones), `scripts` with Molang v2, render controllers.
 */
export interface RenderDescriptionFields {
  materials?: RenderMap;
  geometry?: RenderMap;
  textures?: RenderMap;
  minEngineVersion?: `${number}.${number}.${number}`;
  /** Short name -> animation / animation controller id, or `{ id, speed, ... }` with build-time options. */
  animations?: Record<string, string | ClientEntityAnimationOptions>;
  /** Legacy `animation_controllers` list, e.g. `[{ general: 'controller.animation.x.general' }]`. */
  animationControllers?: Array<Record<string, string>>;
  soundEffects?: Record<string, string>;
  particleEffects?: Record<string, string>;
  particleEmitters?: Record<string, string>;
  renderControllers?: Array<
    string | Record<string, string | MolangBuilder>
  >;
}

export interface RenderScriptsFields {
  /** Short animation names, or `{ name: condition }`. */
  animate?: Array<string | Record<string, string | MolangBuilder>>;
  /** Molang statements; a missing `;` is appended, except after `{` (a block split across entries, as in vanilla). */
  initialize?: Array<string | MolangBuilder>;
  preAnimation?: Array<string | MolangBuilder>;
  parentSetup?: string;
  variables?: Record<string, 'public'>;
  scale?: number | string;
  scalex?: number | string;
  scaley?: number | string;
  scalez?: number | string;
  scaleX?: number | string;
  scaleY?: number | string;
  scaleZ?: number | string;
  hideHeldItems?: number | string;
  shouldUpdateBonesAndEffectsOffscreen?: true | string;
  shouldUpdateEffectsOffscreen?: true | string;
}

const toMap = (value: RenderMap): Record<string, string> =>
  typeof value === 'string' ? { default: value } : value;

// A line ending with `{` opens a block continued in the next entries (vanilla style): no `;` after it.
const terminate = (text: string): string =>
  text.trim() === '' || /[;{]\s*$/.test(text) ? text : `${text};`;

const formatStatement = (value: string | MolangBuilder): string =>
  typeof value === 'string' ? terminate(value) : parseMolangStatement(value as MolangBuilder);

const formatAnimations = (
  identifier: string,
  animations: NonNullable<RenderDescriptionFields['animations']>,
  resolver?: ClientEntityAnimationResolver,
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(animations)) {
    if (typeof value === 'string') {
      result[key] = value;
    } else {
      result[key] = resolver ? resolver(identifier, key, value) : value.id;
    }
  }

  return result;
};

/** Key names written to `scripts` for each field of `RenderScriptsFields`. */
const SCRIPT_KEYS: Array<[keyof RenderScriptsFields, string]> = [
  ['parentSetup', 'parent_setup'],
  ['variables', 'variables'],
  ['scale', 'scale'],
  ['scalex', 'scalex'],
  ['scaley', 'scaley'],
  ['scalez', 'scalez'],
  ['scaleX', 'scaleX'],
  ['scaleY', 'scaleY'],
  ['scaleZ', 'scaleZ'],
  ['hideHeldItems', 'hide_held_items'],
  [
    'shouldUpdateBonesAndEffectsOffscreen',
    'should_update_bones_and_effects_offscreen',
  ],
  ['shouldUpdateEffectsOffscreen', 'should_update_effects_offscreen'],
];

/** `description.scripts` of a client entity / attachable. */
export const formatRenderScripts = (
  scripts: RenderScriptsFields,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  if (scripts.animate !== undefined) {
    result.animate = formatEntityScriptsAnimate(scripts.animate as never);
  }
  if (scripts.initialize !== undefined) {
    result.initialize = scripts.initialize.map(formatStatement);
  }
  if (scripts.preAnimation !== undefined) {
    result.pre_animation = scripts.preAnimation.map(formatStatement);
  }
  for (const [field, key] of SCRIPT_KEYS) {
    if (scripts[field] !== undefined) {
      result[key] = scripts[field];
    }
  }

  return result;
};

/**
 * Writes the shared fields of the render description into `description`
 * (snake_case, as in the JSON files).
 */
export const formatRenderDescription = (
  config: RenderDescriptionFields & {
    identifier: string;
    scripts?: RenderScriptsFields;
  },
  description: Record<string, any>,
  resolver?: ClientEntityAnimationResolver,
): void => {
  if (config.materials !== undefined) {
    description.materials = toMap(config.materials);
  }
  if (config.geometry !== undefined) {
    description.geometry = toMap(config.geometry);
  }
  if (config.textures !== undefined) {
    description.textures = toMap(config.textures);
  }
  if (config.minEngineVersion !== undefined) {
    description.min_engine_version = config.minEngineVersion;
  }
  if (config.animations !== undefined) {
    description.animations = formatAnimations(
      config.identifier,
      config.animations,
      resolver,
    );
  }
  if (config.animationControllers !== undefined) {
    description.animation_controllers = config.animationControllers;
  }
  if (config.soundEffects !== undefined) {
    description.sound_effects = config.soundEffects;
  }
  if (config.particleEffects !== undefined) {
    description.particle_effects = config.particleEffects;
  }
  if (config.particleEmitters !== undefined) {
    description.particle_emitters = config.particleEmitters;
  }
  if (config.renderControllers !== undefined) {
    description.render_controllers = config.renderControllers.map((item) =>
      typeof item === 'string'
        ? item
        : Object.fromEntries(
            Object.entries(item).map(([id, condition]) => [
              id,
              parseMolangExpression(condition),
            ]),
          ),
    );
  }
  if (config.scripts !== undefined) {
    const scripts = formatRenderScripts(config.scripts);
    if (Object.keys(scripts).length > 0) {
      description.scripts = scripts;
    }
  }
};
