import { describe, expect, it } from 'vitest';

import {
  createManifestScriptEntry,
  namespaceToPath,
} from '../../compiler/utils/namespace-path';

describe('namespace-path', () => {
  it('converts namespace to manifest script entry', () => {
    expect(createManifestScriptEntry('my_addon')).toBe(
      'scripts/my/addon/index.js',
    );
  });

  it('uses forward slashes for manifest paths', () => {
    expect(namespaceToPath('Arfex_Test', '/')).toBe('arfex/test');
  });

  it('uses backslashes for filesystem paths', () => {
    expect(namespaceToPath('Arfex_Test', '\\')).toBe('arfex\\test');
  });
});
