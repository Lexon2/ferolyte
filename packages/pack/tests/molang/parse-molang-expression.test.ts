import { describe, expect, it } from 'vitest';

import { Molang } from '../../content/molang/molang';
import {
  formatEntityScriptsAnimate,
  parseMolangExpression,
  parseMolangStatement,
} from '../../content/molang/parse-molang-expression';

describe('parseMolangExpression', () => {
  it('returns string values as-is', () => {
    expect(parseMolangExpression('query.is_baby')).toBe('query.is_baby');
  });

  it('builds Molang instances', () => {
    expect(parseMolangExpression(new Molang().isBaby)).toBe('query.is_baby');
  });
});

describe('parseMolangStatement', () => {
  it('keeps trailing semicolon on strings', () => {
    expect(parseMolangStatement('variable.test = 1;')).toBe('variable.test = 1;');
  });

  it('appends semicolon to strings without one', () => {
    expect(parseMolangStatement('variable.test = 1')).toBe('variable.test = 1;');
  });

  it('appends semicolon to Molang expressions', () => {
    expect(
      parseMolangStatement(
        new Molang().assignVariable('test', 1),
      ),
    ).toBe('variable.test = 1;');
  });
});

describe('formatEntityScriptsAnimate', () => {
  it('formats string and object animate entries', () => {
    expect(
      formatEntityScriptsAnimate([
        'walk',
        { run: 'query.is_sprinting' },
        { idle: new Molang().isBaby },
      ]),
    ).toEqual([
      'walk',
      { run: 'query.is_sprinting' },
      { idle: 'query.is_baby' },
    ]);
  });
});
