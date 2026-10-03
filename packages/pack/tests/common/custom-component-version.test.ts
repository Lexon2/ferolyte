import { describe, expect, it } from 'vitest';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import { BlockBuilder } from '@ferolyte/pack/content/block/block-builder';
import { ItemBuilder } from '@ferolyte/pack/content/item/item-builder';

const warnings = (build: () => unknown) => {
  const collector = collectDiagnostics({ silent: true });
  build();
  collector.stop();

  return collector.records.filter((r) => r.severity === 'warning').map((r) => r.message);
};

describe('custom component keys need format_version 1.21.90', () => {
  it('warns for items and blocks written with an older version', () => {
    const item = warnings(() =>
      new ItemBuilder({
        identifier: 'ns:i',
        components: { 'ns:glow': { power: 1 } } as never,
        rawComponents: { 'ns:raw': {}, 'minecraft:fire_resistant': {} },
      })
        .withBuildContext({ diagnostics: true, minGameVersion: '1.26.20' })
        .build(),
    );
    expect(item).toHaveLength(2);
    expect(item[0]).toContain('needs format_version 1.21.90 or higher');
    expect(item[0]).toContain("version: '1.21.90'");

    const block = warnings(() =>
      new BlockBuilder({ identifier: 'ns:b', rawComponents: { 'ns:ticking': {} } })
        .withBuildContext({ diagnostics: true, minGameVersion: '1.26.20' })
        .build(),
    );
    expect(block).toHaveLength(1);
  });

  it('is silent with version >= 1.21.90 and for vanilla keys', () => {
    expect(
      warnings(() =>
        new ItemBuilder({
          identifier: 'ns:i',
          version: '1.21.90',
          rawComponents: { 'ns:raw': {} },
        })
          .withBuildContext({ diagnostics: true })
          .build(),
      ),
    ).toEqual([]);
    expect(
      warnings(() =>
        new BlockBuilder({ identifier: 'ns:b', rawComponents: { 'minecraft:x': {} } })
          .withBuildContext({ diagnostics: true })
          .build(),
      ),
    ).toEqual([]);
  });

  it('does not change the written default version', () => {
    const build = (minGameVersion: string) =>
      new ItemBuilder({ identifier: 'ns:i', components: { maxStackSize: 1 } })
        .withBuildContext({ diagnostics: false, minGameVersion })
        .build().format_version;

    expect(build('1.26.20')).toBe('1.21.70');
    expect(build('1.26.50')).toBe('1.21.70');
  });
});
