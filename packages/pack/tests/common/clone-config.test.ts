import { describe, expect, it } from 'vitest';

import { cloneConfig } from '@ferolyte/common/object/clone-config';
import { molang, not, q, v } from '@ferolyte/pack/molang';

describe('cloneConfig', () => {
  it('deep-copies plain data', () => {
    const source = { a: [1, { b: 2 }], c: { d: 'x' } };
    const copy = cloneConfig(source);

    expect(copy).toEqual(source);
    expect(copy).not.toBe(source);
    expect(copy.a[1]).not.toBe(source.a[1]);
  });

  it('keeps Molang values by reference (callable queries, expressions, templates)', () => {
    const source = {
      transitions: [{ walk: q.isMoving }, { idle: not(q.isMoving) }],
      speed: v('speed'),
      text: molang`${q.isMoving} && ${v('speed')} > 1`,
      call: q.isItemEquipped('main_hand'),
    };
    const copy = cloneConfig(source);

    expect(copy.transitions[0].walk).toBe(q.isMoving);
    expect(copy.transitions[1].idle).toBe(source.transitions[1].idle);
    expect(copy.speed).toBe(source.speed);
    expect(copy.text).toBe(source.text);
    expect(copy.transitions).not.toBe(source.transitions);
  });

  it('keeps functions and class instances by reference, primitives as they are', () => {
    class Custom {}
    const instance = new Custom();
    const fn = () => 1;

    expect(cloneConfig({ instance, fn, n: 1, s: 's', u: undefined, z: null })).toEqual({
      instance,
      fn,
      n: 1,
      s: 's',
      u: undefined,
      z: null,
    });
    expect(cloneConfig({ instance }).instance).toBe(instance);
  });
});
