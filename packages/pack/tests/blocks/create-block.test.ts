import { describe, expect, it } from 'vitest';
import { BlockBuilder } from '@ferolyte/pack/content/block/block-builder';
import { createBlock } from '@ferolyte/pack/content/block/create-block';
import { minimalBlockConfig } from './helpers/fixtures';

describe('createBlock', () => {
  it('merges multiple BlockConfig objects', () => {
    const builder = createBlock(
      minimalBlockConfig({ components: { replaceable: true } }),
      minimalBlockConfig({ components: { friction: 0.6 } }),
    );

    expect(builder).toBeInstanceOf(BlockBuilder);
    expect(builder.cloneConfig().components).toEqual({
      replaceable: true,
      friction: 0.6,
    });
  });

  it('later config overrides earlier values', () => {
    const builder = createBlock(
      minimalBlockConfig({ identifier: 'test:first' }),
      minimalBlockConfig({ identifier: 'test:second' }),
    );

    expect(builder.cloneConfig().identifier).toBe('test:second');
  });

  it('merges BlockBuilder with BlockConfig', () => {
    const base = new BlockBuilder(
      minimalBlockConfig({ components: { replaceable: true } }),
    );
    const builder = createBlock(
      base,
      minimalBlockConfig({ components: { friction: 0.4 } }),
    );

    expect(builder.cloneConfig().components).toEqual({
      replaceable: true,
      friction: 0.4,
    });
  });
});
