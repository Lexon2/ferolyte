import { describe, expect, it } from 'vitest';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import { ServerEntityBuilder } from '@ferolyte/pack/content/server-entity/server-entity-builder';

import { minimalServerEntityConfig } from './helpers/fixtures';

/** Every event action, alone and nested: an event with a valid action is always written. */
const ACTIONS: Record<string, [any, string]> = {
  add: [{ add: { componentGroups: ['a'] } }, 'add'],
  remove: [{ remove: { componentGroups: ['a'] } }, 'remove'],
  trigger: [{ trigger: 'ns:other' }, 'trigger'],
  queueCommand: [{ queueCommand: { command: 'say hi' } }, 'queue_command'],
  setProperty: [{ setProperty: { 'ns:p': 1 } }, 'set_property'],
  stopMovementOne: [{ stopMovement: { stopVerticalMovement: true } }, 'stop_movement'],
  stopMovementEmpty: [{ stopMovement: {} }, 'stop_movement'],
  setHomePosition: [{ setHomePosition: true }, 'set_home_position'],
  playSound: [{ playSound: { sound: 'pop' } }, 'play_sound'],
  emitParticle: [{ emitParticle: { particle: 'minecraft:heart' } }, 'emit_particle'],
  resetTarget: [{ resetTarget: true }, 'reset_target'],
  executeEventOnHomeBlock: [{ executeEventOnHomeBlock: { event: 'e' } }, 'execute_event_on_home_block'],
  emitVibration: [{ emitVibration: { vibration: 'entity_act' } }, 'emit_vibration'],
};

describe('entity event actions', () => {
  for (const [name, [action, key]] of Object.entries(ACTIONS)) {
    it(`${name} is written at the root and nested`, () => {
      const collector = collectDiagnostics({ silent: true });
      const entity = new ServerEntityBuilder(
        minimalServerEntityConfig({
          events: { root: action, nested: { sequence: [{ randomize: [{ weight: 1, ...action }] }] } },
        }),
      )
        .withBuildContext({ diagnostics: true, contentType: 'server-entity' })
        .build() as any;
      collector.stop();
      const events = entity['minecraft:entity'].events;

      expect(collector.records.filter((r) => r.severity === 'error')).toEqual([]);
      expect(events.root[key]).toBeDefined();
      expect(events.nested.sequence[0].randomize[0][key]).toBeDefined();
    });
  }
});
