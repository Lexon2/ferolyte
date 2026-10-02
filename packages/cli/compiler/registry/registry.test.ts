import { mkdir, mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { collectDiagnostics } from '../check/diagnostics-collector';
import { generateIdsSource, toPascalName } from './ids-generator';
import {
  beginSourceDocuments,
  buildIndex,
  clearRegistry,
  commitSourceDocuments,
  registerContentJson,
  scanResources,
  setStrictReferences,
} from './project-registry';
import { refreshRegistry } from './refresh';
import { closestMatch, unknownMessage } from './suggest';

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

const clientEntity = (geometry: string, animation: string) => ({
  format_version: '1.10.0',
  'minecraft:client_entity': {
    description: {
      identifier: 'ns:zombie',
      geometry: { default: geometry },
      animations: { walk: animation },
      scripts: { animate: ['walk', 'run'] },
      textures: { default: 'textures/entity/zombie' },
    },
  },
});

const serverEntity = (id: string) => ({
  format_version: '1.21.0',
  'minecraft:entity': {
    description: { identifier: id, properties: { 'ns:state': { type: 'int' } } },
    component_groups: { 'ns:angry': {} },
    events: {
      'ns:become': {
        add: { component_groups: ['ns:angry', 'ns:calm'] },
        trigger: 'ns:missing',
      },
    },
    components: {
      'minecraft:timer': { time_down_event: { event: 'ns:become' } },
      'minecraft:variant': { value: "q.property('ns:stat')" },
    },
  },
});

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-registry-'));
  previousCwd = process.cwd();
  process.chdir(root);
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.INPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  BUILD_CONTEXT.PACKS.NAMESPACE = 'ns';
  clearRegistry();
  setStrictReferences(false);

  await write('RP/models/entity/zombie.geo.json', {
    format_version: '1.12.0',
    'geometry.ns.zombie': {},
  });
  await write('RP/animations/zombie.animation.json', {
    format_version: '1.8.0',
    animations: { 'animation.ns.zombie.walk': {} },
  });
  await write('RP/textures/item_texture.json', { texture_data: { ns_apple: {} } });
  await write('RP/textures/entity/other.png', 'x');
});

afterEach(async () => {
  process.chdir(previousCwd);
  clearRegistry();
  await rm(root, { recursive: true, force: true });
});

const check = async () => {
  const collector = collectDiagnostics({ silent: true });
  await refreshRegistry({ ids: false });
  collector.stop();

  return collector.records.map(
    (record) => `${record.severity}: ${record.fieldPath}: ${record.message}`,
  );
};

describe('suggestions', () => {
  it('finds close matches only', () => {
    expect(closestMatch('geometry.ns.zombei', ['geometry.ns.zombie', 'geometry.x'])).toBe(
      'geometry.ns.zombie',
    );
    expect(closestMatch('abc', ['xyz'])).toBeUndefined();
    expect(unknownMessage('geometry', 'a.b', ['a.c'])).toBe(
      'unknown geometry "a.b" (did you mean "a.c"?)',
    );
  });
});

describe('reference checks', () => {
  it('reports a typo with a suggestion, missing animation, missing texture and unknown animate key', async () => {
    register(
      '/src/zombie.ce.ts',
      'client-entity',
      clientEntity('geometry.ns.zombei', 'animation.ns.zombie.wlak'),
    );

    const messages = await check();

    expect(messages).toContain(
      'warning: geometry.default: unknown geometry "geometry.ns.zombei" (did you mean "geometry.ns.zombie"?)',
    );
    expect(messages).toContain(
      'warning: animations.walk: unknown animation "animation.ns.zombie.wlak" (did you mean "animation.ns.zombie.walk"?)',
    );
    expect(messages).toContain(
      'warning: textures.default: missing texture "textures/entity/zombie" (no .png/.tga in the resource pack)',
    );
    expect(messages.some((m) => m.includes('unknown animation key "run"'))).toBe(true);
  });

  it('is silent for valid references and for vanilla ids', async () => {
    register('/src/zombie.ce.ts', 'client-entity', {
      'minecraft:client_entity': {
        description: {
          identifier: 'ns:zombie',
          geometry: { default: 'geometry.ns.zombie', vanilla: 'geometry.humanoid' },
          animations: {
            walk: 'animation.ns.zombie.walk',
            base: 'animation.humanoid.base_pose',
          },
        },
      },
    });

    expect(await check()).toEqual([]);
  });

  it('checks item icons, component groups, events and properties of server entities', async () => {
    register('/src/apple.item.ts', 'item', {
      'minecraft:item': {
        description: { identifier: 'ns:apple' },
        components: { 'minecraft:icon': { textures: { default: 'ns_appel' } } },
      },
    });
    register('/src/z.se.ts', 'server-entity', serverEntity('ns:z'));

    const messages = await check();

    expect(messages).toContain(
      'warning: components.minecraft:icon: unknown item texture key "ns_appel" (did you mean "ns_apple"?)',
    );
    expect(
      messages.some((m) => m.includes('unknown component group "ns:calm"')),
    ).toBe(true);
    expect(messages.some((m) => m.includes('unknown event "ns:missing"'))).toBe(true);
    expect(
      messages.some((m) => m.includes('unknown entity property "ns:stat" (did you mean "ns:state"?)')),
    ).toBe(true);
    expect(messages.some((m) => m.includes('unknown event "ns:become"'))).toBe(false);
  });

  it('--strict turns warnings into errors', async () => {
    setStrictReferences(true);
    register(
      '/src/zombie.ce.ts',
      'client-entity',
      clientEntity('geometry.ns.zombei', 'animation.ns.zombie.walk'),
    );

    expect((await check()).some((m) => m.startsWith('error: geometry.default'))).toBe(true);
  });
});

describe('registry index and ids file', () => {
  it('re-reads only changed pack files', async () => {
    expect(await scanResources()).toBe(true);
    expect(await scanResources()).toBe(false);

    await write('RP/animations/more.animation.json', {
      animations: { 'animation.ns.more': {} },
    });
    expect(await scanResources()).toBe(true);
    expect(buildIndex().animations.has('animation.ns.more')).toBe(true);
  });

  it('generates a stable typed ids file and updates it incrementally', async () => {
    register('/src/z.se.ts', 'server-entity', serverEntity('ns:big_zombie'));
    await scanResources();
    const first = generateIdsSource(buildIndex()).text;

    expect(first).toContain("BigZombie: 'ns:big_zombie',");
    expect(first).toContain("NsZombieWalk: 'animation.ns.zombie.walk',");
    expect(first).toContain("NsZombie: 'geometry.ns.zombie',");
    expect(first).toContain("NsApple: 'ns_apple',");
    expect(first).toContain("Become: 'ns:become',");
    expect(first).toContain("State: 'ns:state',");
    expect(generateIdsSource(buildIndex()).text).toBe(first);

    register('/src/a.se.ts', 'server-entity', serverEntity('ns:alpha'));
    const second = generateIdsSource(buildIndex()).text;
    expect(second).toContain("Alpha: 'ns:alpha',");
    expect(second.indexOf('Alpha:')).toBeLessThan(second.indexOf('BigZombie:'));
  });

  it('suffixes colliding names and writes the file once', async () => {
    register('/src/a.se.ts', 'server-entity', serverEntity('a:cow_x'));
    register('/src/b.se.ts', 'server-entity', serverEntity('b:cow_x'));

    const { text, warnings } = generateIdsSource(buildIndex());

    expect(text).toContain("CowX: 'a:cow_x',");
    expect(text).toContain("CowX2: 'b:cow_x',");
    expect(warnings.length).toBeGreaterThanOrEqual(1);

    const collector = collectDiagnostics({ silent: true });
    expect((await refreshRegistry({ checks: false })).idsWritten).toBe(true);
    expect((await refreshRegistry({ checks: false })).idsWritten).toBe(false);
    collector.stop();
    expect(await readFile(join(root, '.ferolyte/types/ids.ts'), 'utf-8')).toContain('CowX2');
  });

  it('builds pascal names', () => {
    expect(toPascalName('myaddon:big_zombie')).toBe('BigZombie');
    expect(toPascalName('animation.zombie.walk', /^animation\./)).toBe('ZombieWalk');
    expect(toPascalName('ns:9lives')).toBe('_9lives');
  });
});
