import { afterEach, describe, expect, it } from 'vitest';

import {
  ContentDiagnosticRecord,
  setContentDiagnosticSink,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ItemBuilder } from '@ferolyte/pack/content/item/item-builder';
import { ServerEntityBuilder } from '@ferolyte/pack/content/server-entity/server-entity-builder';

const collect = (run: () => void): ContentDiagnosticRecord[] => {
  const records: ContentDiagnosticRecord[] = [];
  setContentDiagnosticSink((record) => records.push(record), { silent: true });
  run();

  return records;
};

afterEach(() => setContentDiagnosticSink(undefined));

const item = (components: Record<string, unknown>) =>
  new ItemBuilder({ identifier: 't:i', components } as any)
    .withBuildContext({ sourceFile: 'a.item.ts', diagnostics: true })
    .build();

describe('snake_case hints', () => {
  it('warns about a snake_case component key with a known camelCase form', () => {
    const records = collect(() => item({ max_stack_size: 16 })).filter(
      (r) => r.severity === 'warning',
    );

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      severity: 'warning',
      message: '"max_stack_size" → use "maxStackSize"',
    });
  });

  it('does not warn for unknown snake_case keys or camelCase keys', () => {
    expect(
      collect(() => item({ some_unknown_thing: 1, maxStackSize: 16 })).filter(
        (r) => r.severity === 'warning',
      ),
    ).toEqual([]);
  });

  it('warns about snake_case fields at depth 1 of a typed component', () => {
    const records = collect(() => item({ durability: { max_durability: 10 } }));

    expect(records.map((r) => [r.severity, r.message])).toContainEqual([
      'error',
      'Unknown field "max_durability". Did you mean "maxDurability"?',
    ]);
  });

  it('does not descend into nested maps', () => {
    const records = collect(() =>
      item({ durability: { maxDurability: 10, nested_map: { inner_key: 1 } } }),
    );

    expect(records.filter((r) => r.message.includes('inner_key'))).toEqual([]);
  });

  it('hints server entity components next to the unsupported error', () => {
    const records = collect(() =>
      new ServerEntityBuilder({
        identifier: 't:e',
        components: { collision_box: { width: 1, height: 1 } },
      } as any)
        .withBuildContext({ sourceFile: 'a.se.ts', diagnostics: true })
        .build(),
    );

    expect(records.some((r) => r.severity === 'warning' && r.message.includes('→ use "collisionBox"'))).toBe(true);
  });
});
