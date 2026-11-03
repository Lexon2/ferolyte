import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv from 'ajv';
import { afterEach, describe, expect, it } from 'vitest';

import {
  ContentDiagnosticRecord,
  setContentDiagnosticSink,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BlockBuilder } from '@ferolyte/pack/content/block/block-builder';
import { BlockComponents } from '@ferolyte/pack/content/block/interfaces/block-config';
import { EntityComponents } from '@ferolyte/pack/content/server-entity/interfaces/entity-components';
import { ServerEntityConfig } from '@ferolyte/pack/content/server-entity/interfaces/server-entity-config';
import { ServerEntityBuilder } from '@ferolyte/pack/content/server-entity/server-entity-builder';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const OFFICIAL = path.join(ROOT, '.cache/bedrock-samples/metadata/json_schemas');
const officialAvailable = existsSync(path.join(OFFICIAL, 'server/entity/1.26.60'));

/** Validators of the official Mojang schemas (pinned bedrock-samples), by `$id`. */
const official = (() => {
  if (!officialAvailable) {
    return undefined;
  }
  const ajv = new Ajv({ strict: false, allErrors: true });
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const file = path.join(dir, name);
      if (statSync(file).isDirectory()) {
        walk(file);
      } else if (file.endsWith('.json')) {
        const schema = JSON.parse(readFileSync(file, 'utf8'));
        if (typeof schema.$id === 'string') {
          ajv.addSchema(schema, encodeURI(schema.$id).replace(/%25/g, '%'));
        }
      }
    }
  };
  walk(OFFICIAL);

  return (id: string, value: unknown) => {
    const validate = ajv.compile({ $ref: id });

    return validate(value) ? [] : validate.errors;
  };
})();

let records: ContentDiagnosticRecord[] = [];
setContentDiagnosticSink((record) => records.push(record), { silent: true });
afterEach(() => {
  records = [];
});

const entity = (
  version: ServerEntityConfig['version'],
  components: EntityComponents,
): Record<string, any> =>
  (new ServerEntityBuilder({ identifier: 'test:e', version, components }).build() as any)[
    'minecraft:entity'
  ].components;

const legacy: EntityComponents = {
  timer: { time: 10, timeDownEvent: { event: 'test:done' } },
  movementJump: { jumpDelay: 0.5 },
  rideable: { seatCount: 1, seats: { position: [0, 1, 0] } },
  transformation: {
    into: 'minecraft:zombie',
    delay: 15,
    transformationSound: 'mob.husk.convert_to_zombie',
  },
  economyTradeTable: { table: 'trading/a.json', curedDiscount: [-25, -20], maxCuredDiscount: -20 },
  spellEffects: { removeEffects: 'poison' },
};

describe('entity format 1.26.60 (strict parsing)', () => {
  it('rewrites the shapes older formats accepted to the accepted ones', () => {
    const components = entity('1.26.60', legacy);

    expect(components['minecraft:timer'].time).toEqual({ min: 10, max: 10 });
    expect(components['minecraft:movement.jump'].jump_delay).toEqual({ min: 0.5, max: 0.5 });
    expect(components['minecraft:rideable'].seats).toEqual([{ position: [0, 1, 0] }]);
    expect(components['minecraft:transformation'].delay).toEqual({ value: 15 });
    expect(components['minecraft:transformation'].transformation_sound).toEqual([
      'mob.husk.convert_to_zombie',
    ]);
    expect(components['minecraft:economy_trade_table']).toMatchObject({
      cured_discount: { min: -25, max: -20 },
      max_cured_discount: { min: -20, max: -20 },
    });
    expect(components['minecraft:spell_effects'].remove_effects).toEqual(['poison']);
    expect(records.filter((r) => r.severity === 'error')).toEqual([]);
  });

  it('keeps the older shapes for older formats', () => {
    const components = entity('1.26.40', legacy);

    expect(components['minecraft:timer'].time).toBe(10);
    expect(components['minecraft:rideable'].seats).toEqual({ position: [0, 1, 0] });
    expect(components['minecraft:transformation'].delay).toBe(15);
    expect(components['minecraft:transformation'].transformation_sound).toBe(
      'mob.husk.convert_to_zombie',
    );
  });

  it('writes timer.time as { min, max } from format 1.26.50', () => {
    expect(entity('1.26.50', { timer: { time: [10, 14] } })['minecraft:timer'].time).toEqual({
      min: 10,
      max: 14,
    });
    expect(entity('1.26.50', { timer: { time: 3 } })['minecraft:timer'].time).toEqual({
      min: 3,
      max: 3,
    });
  });

  it.skipIf(!officialAvailable)('emits JSON valid against the official 1.26.60 schemas', () => {
    const components = entity('1.26.60', {
      ...legacy,
      timer: { time: [10, 14] },
      movementJump: { jumpDelay: [0.5, 1.5] },
      rideable: {
        seatCount: 2,
        seats: [{ position: [0, 1, 0] }, { position: [0, 1, -1] }],
        dismountMode: 'look_direction',
        onRiderExitEvent: 'test:seat_exit',
      },
    });
    const schema = (name: string) => `/server/entity/1.26.60/${name}.json`;

    expect(official!(schema('minecraft_timer'), components['minecraft:timer'])).toEqual([]);
    expect(official!(schema('minecraft_movement.jump'), components['minecraft:movement.jump'])).toEqual([]);
    expect(official!(schema('minecraft_rideable'), components['minecraft:rideable'])).toEqual([]);
    expect(official!(schema('minecraft_transformation'), components['minecraft:transformation'])).toEqual([]);
    expect(
      official!(schema('minecraft_economy_trade_table'), components['minecraft:economy_trade_table']),
    ).toEqual([]);
  });
});

describe('rideable rider events (event id strings)', () => {
  it('writes the string form', () => {
    const rideable = entity(undefined, {
      rideable: { onRiderEnterEvent: 'test:seat_enter', onRiderExitEvent: 'test:seat_exit' },
    })['minecraft:rideable'];

    expect(rideable).toEqual({
      on_rider_enter_event: 'test:seat_enter',
      on_rider_exit_event: 'test:seat_exit',
    });
    expect(records).toEqual([]);
  });

  it('reports the object form naming the string form', () => {
    const rideable = entity(undefined, {
      // @ts-expect-error the game accepts only an event id string
      rideable: { onRiderExitEvent: { event: 'test:seat_exit', target: 'self' } },
    })['minecraft:rideable'];

    expect(rideable.on_rider_exit_event).toBe('test:seat_exit');
    expect(records.filter((r) => r.severity === 'error').map((r) => r.message)).toEqual([
      expect.stringContaining("write onRiderExitEvent: 'test:seat_exit'"),
    ]);
  });
});

describe('block format 1.26.60', () => {
  const box = { origin: [-8, 0, -8], size: [16, 8, 16] } as const;
  const block = (version: '1.26.50' | '1.26.60', collisionBox: BlockComponents['collisionBox']) =>
    new BlockBuilder({
      identifier: 'test:b',
      version,
      components: { collisionBox },
    }).build()['minecraft:block'].components['minecraft:collision_box'];

  it('writes a single collision box as a list', () => {
    expect(block('1.26.60', { origin: [-8, 0, -8], size: [16, 8, 16] })).toEqual([box]);
    expect(block('1.26.60', true)).toBe(true);
    expect(block('1.26.50', { origin: [-8, 0, -8], size: [16, 8, 16] })).toEqual(box);
  });

  it.skipIf(!officialAvailable)('emits a collision box valid against the official schema', () => {
    expect(
      official!(
        '/server/block_components/1.26.60/Collision%20Box.json',
        block('1.26.60', { origin: [-8, 0, -8], size: [16, 8, 16] }),
      ),
    ).toEqual([]);
  });
});
