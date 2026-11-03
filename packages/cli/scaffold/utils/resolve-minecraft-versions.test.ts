import { describe, expect, it } from 'vitest';

import { FALLBACK_VERSIONS } from './resolve-minecraft-versions';

describe('scaffold fallback versions', () => {
  it('match the stable script modules of Minecraft 1.26.60', () => {
    expect(FALLBACK_VERSIONS).toMatchObject({
      server: '2.11.0',
      serverUi: '2.3.0',
      vanillaData: '1.26.60',
    });
  });
});
