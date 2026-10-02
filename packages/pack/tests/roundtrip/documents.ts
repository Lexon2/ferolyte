/**
 * Whole-document round-trip (C0): vanilla attachables, render controllers, recipes and spawn rules go through the
 * generated `convertDocument`; client entities and animation controllers go through their hand-written builders
 * (a small adapter turns the vanilla JSON into the SDK config). The output must contain everything the original has.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { parse as parseJsonc } from 'jsonc-parser';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import { AnimationControllerBuilder } from '@ferolyte/pack/content/animation-controller/animation-controller-builder';
import { ClientEntityBuilder } from '@ferolyte/pack/content/client-entity/client-entity-builder';
import {
  DocumentKind,
  convertDocument,
  documentRegistry,
} from '@ferolyte/pack/content/documents/convert-document';

import type { Failure, Instance } from './harness';
import { SAMPLES_DIR, camelizeWithMap, diff, normalise } from './harness';

/** Round-trip areas that are whole documents. */
export const DOCUMENT_AREAS = [
  'attachable',
  'render_controller',
  'recipe',
  'spawn_rule',
  'client_entity',
  'animation_controller',
] as const;
export type DocumentArea = (typeof DOCUMENT_AREAS)[number];

export const isDocumentArea = (area: string): area is DocumentArea =>
  (DOCUMENT_AREAS as readonly string[]).includes(area);

/** Areas that go through the generated runtime (their camelCase config is type-checked against the generated types). */
const GENERATED_KIND: Partial<Record<DocumentArea, DocumentKind>> = {
  attachable: 'attachable',
  render_controller: 'renderController',
  recipe: 'recipe',
  spawn_rule: 'spawnRule',
};

export const generatedKindOf = (area: string): DocumentKind | undefined =>
  GENERATED_KIND[area as DocumentArea];

const readJson = (file: string): any => {
  try {
    return parseJsonc(readFileSync(file, 'utf8'));
  } catch {
    return undefined;
  }
};

const jsonFiles = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? jsonFiles(path.join(dir, entry.name))
          : entry.name.endsWith('.json')
            ? [path.join(dir, entry.name)]
            : [],
      )
    : [];

const rel = (file: string) =>
  path.relative(SAMPLES_DIR, file).replace(/\\/g, '/');

export const collectDocuments = (): Instance[] => {
  const out: Instance[] = [];
  const bp = path.join(SAMPLES_DIR, 'behavior_pack');
  const rp = path.join(SAMPLES_DIR, 'resource_pack');
  const add = (
    area: DocumentArea,
    component: string,
    value: unknown,
    origin: string,
  ) => out.push({ area, component, value, source: 'vanilla', origin });

  for (const [area, dir] of [
    ['attachable', path.join(rp, 'attachables')],
    ['render_controller', path.join(rp, 'render_controllers')],
    ['spawn_rule', path.join(bp, 'spawn_rules')],
    ['client_entity', path.join(rp, 'entity')],
  ] as const) {
    for (const file of jsonFiles(dir)) {
      const value = readJson(file);
      if (value !== undefined) add(area, 'document', value, rel(file));
    }
  }
  for (const file of jsonFiles(path.join(bp, 'recipes'))) {
    const value = readJson(file);
    if (value === undefined) continue;
    const kind =
      Object.keys(value).find((key) => key.startsWith('minecraft:recipe_')) ??
      'document';
    add('recipe', kind, value, rel(file));
  }
  // One instance per controller: the SDK builds one controller per config.
  for (const dir of [
    path.join(rp, 'animation_controllers'),
    path.join(bp, 'animation_controllers'),
  ]) {
    for (const file of jsonFiles(dir)) {
      const value = readJson(file);
      for (const [id, controller] of Object.entries<any>(
        value?.animation_controllers ?? {},
      )) {
        add(
          'animation_controller',
          dir.startsWith(rp) ? 'rp' : 'bp',
          {
            format_version: value.format_version,
            animation_controllers: { [id]: controller },
          },
          rel(file),
        );
      }
    }
  }

  return out;
};

// ------------------------------------------------------------- adapters

const clientEntityConfig = (doc: any) => {
  const d = doc['minecraft:client_entity']?.description ?? {};
  const s = d.scripts;

  return {
    version: doc.format_version,
    identifier: d.identifier,
    materials: d.materials,
    geometry: d.geometry,
    textures: d.textures,
    minEngineVersion: d.min_engine_version,
    animations: d.animations,
    soundEffects: d.sound_effects,
    particleEffects: d.particle_effects,
    particleEmitters: d.particle_emitters,
    renderControllers: d.render_controllers,
    hideArmor: d.hide_armor,
    enableAttachables: d.enable_attachables,
    heldItemIgnoresLighting: d.held_item_ignores_lighting,
    queryableGeometry: d.queryable_geometry,
    spawnEgg:
      d.spawn_egg === undefined
        ? undefined
        : (camelizeWithMap(d.spawn_egg, {
            p: {
              baseColor: ['base_color'],
              overlayColor: ['overlay_color'],
              textureIndex: ['texture_index'],
            },
          }) as any),
    scripts:
      s === undefined
        ? undefined
        : {
            animate: s.animate,
            initialize: s.initialize,
            preAnimation: s.pre_animation,
            parentSetup: s.parent_setup,
            variables: s.variables,
            scale: s.scale,
            scalex: s.scalex,
            scaley: s.scaley,
            scalez: s.scalez,
            shouldUpdateBonesAndEffectsOffscreen:
              s.should_update_bones_and_effects_offscreen,
            shouldUpdateEffectsOffscreen: s.should_update_effects_offscreen,
          },
  };
};

const controllerConfig = (doc: any, kind: 'rp' | 'bp') => {
  const [[id, controller]] = Object.entries<any>(doc.animation_controllers);

  return {
    id,
    version: doc.format_version,
    initialState: controller.initial_state,
    states: Object.fromEntries(
      Object.entries<any>(controller.states ?? {}).map(([name, s]) => [
        name,
        {
          kind,
          animations: s.animations,
          transitions: s.transitions,
          blendTransition: s.blend_transition,
          blendViaShortestPath: s.blend_via_shortest_path,
          onEntry: s.on_entry,
          onExit: s.on_exit,
          particleEffects: s.particle_effects?.map((e: any) => ({
            effect: e.effect,
            locator: e.locator,
            preEffectScript: e.pre_effect_script,
            bindToActor: e.bind_to_actor,
          })),
          soundEffects: s.sound_effects,
          variables:
            s.variables === undefined
              ? undefined
              : Object.fromEntries(
                  Object.entries<any>(s.variables).map(([key, v]) => [
                    key,
                    { input: v.input, remapCurve: v.remap_curve },
                  ]),
                ),
        },
      ]),
    ),
  };
};

// ------------------------------------------------------------------- run

export const runDocument = (
  instance: Instance,
): { failure?: Failure; sdkKey: string; camel: unknown } => {
  const { area, value } = instance;
  const kind = generatedKindOf(area);
  const base = {
    area: area as Instance['area'],
    component: instance.component,
    source: instance.source,
    origin: instance.origin,
    json: value,
  };

  let camel: unknown;
  if (kind !== undefined) {
    camel = camelizeWithMap(value, documentRegistry[kind].map);
  } else if (area === 'client_entity') {
    camel = clientEntityConfig(value);
  } else {
    camel = controllerConfig(value, instance.component as 'rp' | 'bp');
  }

  const collector = collectDiagnostics({ silent: true });
  let output: any;
  let thrown: string | undefined;
  try {
    if (kind !== undefined) {
      output = convertDocument(kind, camel as never, {
        contentType: 'recipe',
        diagnostics: true,
      });
    } else if (area === 'client_entity') {
      output = new ClientEntityBuilder(camel as never).build();
    } else {
      output = new AnimationControllerBuilder(camel as never)
        .withBuildContext({ diagnostics: true })
        .build();
    }
  } catch (error) {
    thrown = error instanceof Error ? error.message : String(error);
  } finally {
    collector.stop();
  }

  const errors = collector.records
    .filter((r) => r.severity === 'error')
    .map((r) => `${r.fieldPath}: ${r.message}`);
  if (thrown !== undefined || output === undefined || errors.length > 0) {
    return {
      sdkKey: '',
      camel,
      failure: {
        ...base,
        categories: ['REJECTED'],
        details: [
          {
            category: 'REJECTED',
            path: '.',
            message: thrown ?? errors.join('; '),
          },
        ],
      },
    };
  }

  const details = diff(normalise(value), normalise(output));
  if (details.length > 0) {
    return {
      sdkKey: '',
      camel,
      failure: {
        ...base,
        categories: [...new Set(details.map((d) => d.category))],
        details,
      },
    };
  }

  return { sdkKey: '', camel };
};
