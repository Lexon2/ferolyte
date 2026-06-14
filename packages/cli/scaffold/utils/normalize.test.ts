import { describe, expect, it } from 'vitest';

import {
  toDisplayName,
  toNamespace,
  toPathAlias,
  toSlug,
  validateAlias,
  validateProjectName,
} from './normalize';

describe('normalize', () => {
  it('converts project name to slug', () => {
    expect(toSlug('My Addon')).toBe('my-addon');
    expect(toSlug('  Cool_Project  ')).toBe('cool-project');
  });

  it('converts project name to namespace', () => {
    expect(toNamespace('My Addon')).toBe('my_addon');
  });

  it('preserves display name spacing', () => {
    expect(toDisplayName('  My   Addon  ')).toBe('My Addon');
  });

  it('creates path alias from slug', () => {
    expect(toPathAlias('my-addon')).toBe('@my-addon');
  });

  it('validates alias pattern', () => {
    expect(() => validateAlias('Cool')).toThrow(/Invalid alias/);
    expect(() => validateAlias('1cool')).toThrow(/Invalid alias/);
    expect(() => validateAlias('cool')).not.toThrow();
    expect(() => validateAlias('cool_pack')).not.toThrow();
  });

  it('rejects empty project names', () => {
    expect(() => validateProjectName('   ')).toThrow(/at least one letter or digit/);
  });

  it('returns slug for valid project names', () => {
    expect(validateProjectName('My Addon')).toBe('my-addon');
  });
});
