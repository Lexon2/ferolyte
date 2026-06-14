import { describe, expect, it } from 'vitest';

import { parseMinEngineVersion } from './parse-min-engine-version';

describe('parseMinEngineVersion', () => {
  it('parses semantic game version', () => {
    expect(parseMinEngineVersion('1.21.80')).toEqual([1, 21, 80]);
  });

  it('rejects invalid version strings', () => {
    expect(() => parseMinEngineVersion('1.21')).toThrow(/Invalid min game version/);
    expect(() => parseMinEngineVersion('a.b.c')).toThrow(/Invalid min game version/);
  });
});
