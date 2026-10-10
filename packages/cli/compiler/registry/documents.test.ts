import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { collectDiagnostics } from '../check/diagnostics-collector';
import { REFERENCE_CHECKS } from './checks';
import { generateIdsSource } from './ids-generator';
import {
  beginSourceDocuments,
  buildIndex,
  clearRegistry,
  commitSourceDocuments,
  registerContentJson,
  scanResources,
} from './project-registry';
import { refreshRegistry } from './refresh';

let root: string;
let previousCwd: string;

const write = async (path: string, content: unknown) => {
  const file = join(root, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, typeof content === 'string' ? content : JSON.stringify(content));
};

const register = (source: string, kind: any, json: unknown) => {
  beginSourceDocuments(source);
  registerContentJson(source, kind, json);
  commitSourceDocuments(source);
};

const attachable = (description: Record<string, unknown>) => ({
  format_version: '1.10.0',
  'minecraft:attachable': { description: { identifier: 'ns:sword', ...description } },
});

const check = async (only?: Set<string>) => {
  const collector = collectDiagnostics({ silent: true });
  await refreshRegistry({ ids: false, only });
  collector.stop();

  return collector.records.map((r) => `${r.severity}: ${r.contentType}: ${r.fieldPath}: ${r.message}`);
};

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-docs-'));
  previousCwd = process.cwd();
  process.chdir(root);
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  BUILD_CONTEXT.PACKS.NAMESPACE = 'ns';
  clearRegistry();

  await write('RP/models/entity/sword.geo.json', { format_version: '1.12.0', 'geometry.ns.sword': {} });
  await write('RP/animations/sword.animation.json', { animations: { 'animation.ns.sword.hold': {} } });
  await write('RP/render_controllers/sword.rc.json', {
    format_version: '1.10.0',
    render_controllers: {
      'controller.render.ns.sword': {
        geometry: 'Geometry.default',
        materials: [{ '*': 'Material.default' }],
        textures: ['Texture.blade'],
      },
    },
  });
});

afterEach(async () => {
  process.chdir(previousCwd);
  clearRegistry();
  await rm(root, { recursive: true, force: true });
});

describe('attachable reference checks', () => {
  it('checks geometry, animations, render controllers and animate keys like a client entity', async () => {
    register(
      '/src/sword.att.ts',
      'attachable',
      attachable({
        geometry: { default: 'geometry.ns.swrod' },
        animations: { hold: 'animation.ns.sword.hld' },
        render_controllers: ['controller.render.ns.swrod'],
        scripts: { animate: ['hold', 'swing'] },
      }),
    );

    const messages = await check();

    expect(messages).toContain(
      'warning: attachable: geometry.default: unknown geometry "geometry.ns.swrod" (did you mean "geometry.ns.sword"?)',
    );
    expect(messages.some((m) => m.includes('animations.hold: unknown animation "animation.ns.sword.hld" (did you mean "animation.ns.sword.hold"?)'))).toBe(true);
    expect(messages.some((m) => m.includes('unknown render controller "controller.render.ns.swrod"'))).toBe(true);
    expect(messages.some((m) => m.includes('unknown animation key "swing"'))).toBe(true);
  });
});

describe('recipe and spawn rule reference checks (wired into REFERENCE_CHECKS)', () => {
  it('reports unknown project items in recipes and unknown project entities in spawn rules', async () => {
    register('/src/ruby.item.ts', 'item', {
      format_version: '1.21.90',
      'minecraft:item': { description: { identifier: 'ns:ruby' }, components: {} },
    });
    register('/src/ruby_block.recipe.ts', 'recipe', {
      format_version: '1.20.10',
      'minecraft:recipe_shaped': {
        description: { identifier: 'ns:ruby_block' },
        tags: ['crafting_table'],
        pattern: ['##', '##'],
        key: { '#': { item: 'ns:rubby' } },
        result: { item: 'minecraft:stone' },
      },
    });
    register('/src/zombie.spawn.ts', 'spawn-rule', {
      format_version: '1.8.0',
      'minecraft:spawn_rules': {
        description: { identifier: 'ns:zombi', population_control: 'monster' },
        conditions: [{ 'minecraft:weight': { default: 10 } }],
      },
    });

    const messages = await check();

    expect(messages.some((m) => m.includes('recipe') && m.includes('"ns:rubby"') && m.includes('"ns:ruby"'))).toBe(true);
    expect(messages.some((m) => m.includes('minecraft:stone'))).toBe(false);
    expect(messages.some((m) => m.includes('spawn-rule') && m.includes('"ns:zombi"'))).toBe(true);
  });
});

describe('render controller reference checks', () => {
  it('requires Geometry.x / Texture.x / Material.x keys in every user of the controller', async () => {
    register(
      '/src/sword.att.ts',
      'attachable',
      attachable({
        geometry: { default: 'geometry.ns.sword' },
        textures: { blade: 'textures/ns/blade' },
        materials: { other: 'entity_alphatest' },
        render_controllers: ['controller.render.ns.sword'],
      }),
    );

    const messages = await check();

    expect(messages.some((m) => m.includes('render-controller') && m.includes('unknown materials key "Material.default"') && m.includes('"ns:sword"'))).toBe(true);
    expect(messages.some((m) => m.includes('Texture.blade'))).toBe(false);
    expect(messages.some((m) => m.includes('Geometry.default'))).toBe(false);
  });

  it('is case-insensitive and silent for controllers nobody uses', async () => {
    register(
      '/src/ok.ce.ts',
      'client-entity',
      {
        'minecraft:client_entity': {
          description: {
            identifier: 'ns:ok',
            geometry: { Default: 'geometry.ns.sword' },
            textures: { BLADE: 'textures/ns/blade' },
            materials: { default: 'entity' },
            render_controllers: ['controller.render.ns.sword'],
          },
        },
      },
    );

    expect((await check()).filter((m) => m.includes('render-controller'))).toEqual([]);
  });

  it('limits the work to the rebuilt sources in watch batches', async () => {
    register(
      '/src/sword.att.ts',
      'attachable',
      attachable({ render_controllers: ['controller.render.ns.sword'], materials: { other: 'x' } }),
    );
    await scanResources();

    expect((await check(new Set(['/src/unrelated.ts']))).filter((m) => m.includes('Material.default'))).toEqual([]);
  });
});

describe('Molang check', () => {
  const controller = (transitions: Record<string, string>[]) => ({
    format_version: '1.10.0',
    animation_controllers: {
      'controller.animation.ns.shield': {
        initial_state: 'idle',
        states: { idle: { transitions }, shielding: { transitions: [{ idle: '1' }] } },
      },
    },
  });

  it("warns for `!` applied to one side of a comparison and to a string literal", async () => {
    register('/src/shield.ac.rp.ts', 'animation-controller-rp', controller([
      { shielding: "!v.ability == 'shielding'" },
      { shielding: "!'v.a == 1'" },
    ]));

    const messages = (await check()).filter((m) => m.includes('shield'));

    expect(messages).toEqual([
      expect.stringMatching(/^warning: animation-controller-rp: .*states\.idle\.transitions\.0\.shielding: .*binds tighter than `==`/),
      expect.stringMatching(/^warning: animation-controller-rp: .*transitions\.1\.shielding: .*string literal 'v\.a == 1'/),
    ]);
  });

  it('keeps grouped negations and negated operands of && clean', async () => {
    register('/src/shield.ac.rp.ts', 'animation-controller-rp', controller([
      { shielding: "!(v.ability == 'shielding')" },
      { shielding: '!q.is_moving && v.x == 1' },
    ]));

    expect((await check()).filter((m) => m.includes('shield'))).toEqual([]);
  });
});

describe('ids and the checks registry', () => {
  it('generates AttachableId, RenderControllerId, RecipeId and SpawnRuleId', async () => {
    register('/src/sword.att.ts', 'attachable', attachable({}));
    register('/src/r.recipe.ts', 'recipe', {
      format_version: '1.20.10',
      'minecraft:recipe_shapeless': { description: { identifier: 'ns:sword_recipe' } },
    });
    register('/src/s.spawn.ts', 'spawn-rule', {
      format_version: '1.8.0',
      'minecraft:spawn_rules': { description: { identifier: 'ns:zombie_spawn' } },
    });
    await scanResources();

    const { text } = generateIdsSource(buildIndex());

    expect(text).toContain("Sword: 'ns:sword',");
    expect(text).toContain("export const AttachableId");
    expect(text).toContain("NsSword: 'controller.render.ns.sword',");
    expect(text).toContain("SwordRecipe: 'ns:sword_recipe',");
    expect(text).toContain("ZombieSpawn: 'ns:zombie_spawn',");
  });

  it('exposes one array to plug further checks into', () => {
    expect(Array.isArray(REFERENCE_CHECKS)).toBe(true);
    expect(REFERENCE_CHECKS.length).toBeGreaterThanOrEqual(1);
  });
});
