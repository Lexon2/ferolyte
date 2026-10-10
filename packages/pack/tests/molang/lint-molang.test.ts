import { describe, expect, it } from 'vitest';
import { lintMolang } from '@ferolyte/pack/content/molang/lint-molang';
import { eq, molang, not } from '@ferolyte/pack/content/molang/expr';

describe('lintMolang', () => {
  it.each([
    "!v.ability == 'shielding'",
    '!q.foo(1) > 2',
    'q.is_alive && !v.state != 3',
    '!v.timer <= 0.5',
  ])('flags `!` applied to one side of a comparison: %s', (source) => {
    expect(lintMolang(source)).toEqual([expect.stringContaining('binds tighter than')]);
  });

  it('flags `!` applied to a string literal, as written by not() with a plain string', () => {
    const source = not('v.a == 1').build();

    expect(source).toBe("!'v.a == 1'");
    expect(lintMolang(source)).toEqual([expect.stringContaining("string literal 'v.a == 1'")]);
    expect(lintMolang("q.x && ! 'a'")).toHaveLength(1);
  });

  it.each([
    '!(a == b)',
    '!q.is_moving && x == 1',
    'a != b',
    '!q.is_moving',
    "v.text == '!x == 1'",
    "v.a != 'b'",
    '!!q.is_moving',
    'math.abs(!q.a) > 1 ? 1 : 0',
  ])('keeps %s clean', (source) => {
    expect(lintMolang(source)).toEqual([]);
  });

  it('keeps builder output clean', () => {
    expect(lintMolang(not(eq('v.ability' as never, 'shielding')).build())).toEqual([]);
    expect(lintMolang(molang`!(${eq(1, 2)})`.build())).toEqual([]);
  });
});
