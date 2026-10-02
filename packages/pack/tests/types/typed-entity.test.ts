import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { createServerEntity } from '@ferolyte/pack/content/server-entity/create-server-entity';
import { defineServerEntity } from '@ferolyte/pack/content/server-entity/define-config';
import { props } from '@ferolyte/pack/content/server-entity/typed-entity';

/**
 * Compiles user snippets against the SDK sources: `@ts-expect-error` lines prove
 * that the checks reject wrong names / values (an unused directive is an error).
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../../../..');
const virtualFile = path.join(here, '__typed-entity-snippet.generated.ts');

const compile = (source: string): string[] => {
  const configPath = path.join(ROOT, 'packages/pack/tsconfig.json');
  const parsed = ts.parseJsonConfigFileContent(
    ts.readConfigFile(configPath, ts.sys.readFile).config,
    ts.sys,
    path.dirname(configPath),
  );
  const options: ts.CompilerOptions = {
    ...parsed.options,
    noEmit: true,
    rootDir: ROOT,
    skipLibCheck: true,
  };
  const host = ts.createCompilerHost(options);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  host.readFile = (name) =>
    path.resolve(name) === path.resolve(virtualFile) ? source : readFile(name);
  host.fileExists = (name) =>
    path.resolve(name) === path.resolve(virtualFile) || fileExists(name);
  const program = ts.createProgram([virtualFile], options, host);

  return ts
    .getPreEmitDiagnostics(program, program.getSourceFile(virtualFile))
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' '));
};

const header = `
import { createServerEntity } from '@ferolyte/pack/content/server-entity/create-server-entity';
import { defineServerEntity } from '@ferolyte/pack/content/server-entity/define-config';
import { props } from '@ferolyte/pack/content/server-entity/typed-entity';
import type { PropertiesOf } from '@ferolyte/pack/content/server-entity/typed-entity';
`;

const zombie = `
const zombie = defineServerEntity({
  identifier: 'ns:zombie',
  properties: {
    'ns:state': { type: 'enum', values: ['idle', 'angry'], default: 'idle' },
    'ns:rage_level': { type: 'int', range: [0, 5], default: 0 },
    'ns:shaking': { type: 'bool', default: false },
  },
  componentGroups: [{ name: 'ns:angry', components: {} }, { name: 'ns:calm', components: {} }],
  events: {
    'ns:become_angry': {
      add: { componentGroups: ['ns:angry'] },
      remove: { componentGroups: ['ns:calm'] },
      setProperty: { 'ns:state': 'angry', 'ns:rage_level': 3, 'ns:shaking': true },
    },
    'ns:calm_down': { trigger: 'ns:become_angry', sequence: [{ trigger: 'minecraft:entity_spawned' }] },
  },
  components: {
    timer: { time: 5, timeDownEvent: 'ns:calm_down' },
  },
});
`;

describe('typed entity names (const generics)', () => {
  it('accepts declared events, groups and property values', () => {
    expect(
      compile(`${header}${zombie}
export default createServerEntity(zombie);
type Props = PropertiesOf<typeof zombie>;
const state: Props['ns:state'] = 'idle';
const level: Props['ns:rage_level'] = 2;
const shaking: Props['ns:shaking'] = true;
const exprs = props(zombie);
exprs.state;
exprs.rageLevel;
void [state, level, shaking];
`),
    ).toEqual([]);
  });

  const rejected: Array<[string, string]> = [
    [
      'unknown component group',
      `events: { 'ns:a': { add: { componentGroups: ['ns:typo'] } } }, componentGroups: [{ name: 'ns:angry', components: {} }],`,
    ],
    ['unknown trigger event', `events: { 'ns:b': { trigger: 'ns:missing' } },`],
    [
      'enum value outside the declared values',
      `properties: { 'ns:state': { type: 'enum', values: ['idle', 'angry'], default: 'idle' } }, events: { 'ns:c': { setProperty: { 'ns:state': 'sleepy' } } },`,
    ],
    [
      'wrong type of a property value',
      `properties: { 'ns:level': { type: 'int', range: [0, 5], default: 0 } }, events: { 'ns:c': { setProperty: { 'ns:level': 'high' } } },`,
    ],
    [
      'undeclared property in setProperty',
      `properties: { 'ns:state': { type: 'bool', default: false } }, events: { 'ns:d': { setProperty: { 'ns:other': 1 } } },`,
    ],
    [
      'undeclared property in a nested sequence',
      `properties: { 'ns:state': { type: 'bool', default: false } }, events: { 'ns:d': { sequence: [{ setProperty: { 'ns:other': true } }] } },`,
    ],
    [
      'enum default outside its values',
      `properties: { 'ns:state': { type: 'enum', values: ['idle', 'angry'], default: 'dead' } },`,
    ],
    [
      'unknown event in a component (string)',
      `events: { 'ns:real': {} }, components: { timer: { time: 5, timeDownEvent: 'ns:fake' } },`,
    ],
    [
      'unknown event in a component (object targeting self)',
      `events: { 'ns:real': {} }, components: { timer: { time: 5, timeDownEvent: { event: 'ns:fake' } } },`,
    ],
    [
      'unknown event in a component group',
      `events: { 'ns:real': {} }, componentGroups: [{ name: 'ns:g', components: { timer: { time: 5, timeDownEvent: 'ns:fake' } } }],`,
    ],
  ];

  it.each(rejected)('rejects: %s', (_, fields) => {
    const diagnostics = compile(`${header}
defineServerEntity({ identifier: 'ns:z', ${fields} });
`);

    expect(diagnostics.length).toBeGreaterThan(0);
    expect(diagnostics.join(' ')).not.toContain('Unused');
  });

  it('allows events aimed at other entities and vanilla events', () => {
    expect(
      compile(`${header}
defineServerEntity({
  identifier: 'ns:z',
  events: { 'ns:real': {} },
  components: {
    timer: { time: 5, timeDownEvent: { event: 'other:event', target: 'other' } },
  },
});
createServerEntity({ identifier: 'ns:z', events: { 'minecraft:entity_spawned': { trigger: 'ns:later' }, 'ns:later': {} } });
`),
    ).toEqual([]);
  });

  it('keeps configs without declared names wide', () => {
    expect(
      compile(`${header}
import type { ServerEntityConfig } from '@ferolyte/pack/content/server-entity/interfaces/server-entity-config';
const wide: ServerEntityConfig = { identifier: 'ns:w', events: { go: { trigger: 'whatever' } } };
createServerEntity(wide);
createServerEntity({ identifier: 'ns:plain', components: { timer: { timeDownEvent: 'free:text' } } });
createServerEntity({
  identifier: 'ns:groups',
  events: { go: { add: { componentGroups: ['anything'] } } },
});
`),
    ).toEqual([]);
  });

  it('createServerEntity accepts helper-built groups/events with wide types', () => {
    // Regression: X2 checks broke real projects that assemble configs from helpers.
    expect(
      compile(`${header}
import type { EntityComponentGroup } from '@ferolyte/pack/content/server-entity/interfaces/entity-component-group';
import type { EntityEventNode } from '@ferolyte/pack/content/server-entity/interfaces/entity-events';
const makeGroups = (): EntityComponentGroup[] => [{ name: 'mobile', components: { movement: { value: 0.2 } } }];
const makeEvent = (group: string): EntityEventNode => ({ add: { componentGroups: [group] } });
const eventName: string = 'ns:dynamic';
createServerEntity({
  identifier: 'ns:helpers',
  componentGroups: [...makeGroups(), { name: 'sleeping', components: { movement: { value: 0 } } }],
  events: {
    'ns:wake': makeEvent('mobile'),
    'ns:roll': { randomize: [{ weight: 1, trigger: eventName }] },
    [eventName]: { remove: { componentGroups: ['sleeping'] } },
  },
  components: { timer: { time: 5, timeDownEvent: { event: eventName } } },
});
`),
    ).toEqual([]);
  });

  it('props() builds q.property expressions at runtime', () => {
    const entity = defineServerEntity({
      identifier: 'ns:z',
      properties: {
        'ns:state': { type: 'enum', values: ['idle', 'angry'], default: 'idle' },
        'ns:rage_level': { type: 'int', range: [0, 5], default: 0 },
      },
    });
    const exprs = props(entity);

    expect(exprs.state.build()).toBe("query.property('ns:state')");
    expect(exprs.rageLevel.build()).toBe("query.property('ns:rage_level')");
    expect(createServerEntity(entity).build()['minecraft:entity'].description.properties).toBeDefined();
  });
});
