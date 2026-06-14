import { describe, expect, it } from 'vitest';

import { Molang } from '../../content/molang/molang';
import { camelToSnake, snakeToCamel } from '../../content/molang/utils/case';

describe('Molang builder', () => {
  it('builds the fluent example with named operators', () => {
    const expression = new Molang()
      .allAnimationsFinished
      .and
      .math('abs', 1)
      .or
      .math.randomInteger(10, 100)
      .build();

    expect(expression).toBe(
      'query.all_animations_finished && math.abs(1) || math.random_integer(10, 100)',
    );
  });

  it('builds the fluent example with op() escape hatch', () => {
    const expression = new Molang()
      .allAnimationsFinished
      .op('&&')
      .math('abs', 1)
      .op('||')
      .math('random_integer', 10, 100)
      .toString();

    expect(expression).toBe(
      'query.all_animations_finished && math.abs(1) || math.random_integer(10, 100)',
    );
  });

  it('uses zero-arg query without parentheses', () => {
    expect(new Molang().isBaby.build()).toBe('query.is_baby');
    expect(new Molang().animTime.build()).toBe('query.anim_time');
  });

  it('supports parameterized query() fallback', () => {
    expect(
      new Molang().query('is_item_equipped', 'main_hand').build(),
    ).toBe("query.is_item_equipped('main_hand')");
  });

  it('supports math callable, namespace methods, aliases, and pi constant', () => {
    expect(new Molang().math('cos', 45).build()).toBe('math.cos(45)');
    expect(new Molang().math.clamp(1, 0, 2).build()).toBe('math.clamp(1, 0, 2)');
    expect(new Molang().math.randomInt(10, 100).build()).toBe(
      'math.random_integer(10, 100)',
    );
    expect(new Molang().math.pi.build()).toBe('math.pi');
  });

  it('supports comparison and null coalescing operators', () => {
    expect(
      new Molang().num(1).eq.num(1).nullCoalesce.num(2).build(),
    ).toBe('1 == 1 ?? 2');
  });

  it('wraps nested expressions with group()', () => {
    expect(
      new Molang()
        .group((expression) => expression.num(1).add.num(2))
        .mul
        .num(3)
        .build(),
    ).toBe('(1 + 2) * 3');
  });

  it('supports variable namespaces and aliases', () => {
    expect(new Molang().variable.rotationScale.build()).toBe(
      'variable.rotation_scale',
    );
    expect(new Molang().v.rotationScale.build()).toBe('v.rotation_scale');
    expect(new Molang().temp.moo.build()).toBe('temp.moo');
    expect(new Molang().t.moo.build()).toBe('t.moo');
    expect(new Molang().context.animTime.build()).toBe('context.anim_time');
    expect(new Molang().c.animTime.build()).toBe('c.anim_time');
  });

  it('converts camelCase and snake_case consistently', () => {
    expect(snakeToCamel('all_animations_finished')).toBe('allAnimationsFinished');
    expect(camelToSnake('allAnimationsFinished')).toBe('all_animations_finished');
    expect(snakeToCamel('random_integer')).toBe('randomInteger');
  });

  it('coerces to string via toString, valueOf, and Symbol.toPrimitive', () => {
    const expression = new Molang().num(42);
    expect(String(expression)).toBe('42');
    expect(expression.valueOf()).toBe('42');
    expect(`${expression}`).toBe('42');
  });

  it('supports ternary, returnExpr, loop, forEach, and arrow helpers', () => {
    expect(
      new Molang()
        .query('is_baby')
        .ternary(-8, 0)
        .build(),
    ).toBe('query.is_baby ? -8 : 0');

    expect(
      new Molang()
        .returnExpr((expression) => expression.num(1).add.num(2))
        .build(),
    ).toBe('return 1 + 2;');

    expect(
      new Molang()
        .loop(10, (expression) => expression.raw('v.x = v.x + 1;'))
        .build(),
    ).toBe('loop(10, {v.x = v.x + 1;});');

    expect(
      new Molang()
        .forEach(
          't.pig',
          new Molang().raw("query.get_nearby_entities(4, 'minecraft:pig')"),
          (expression) => expression.raw('v.x = v.x + 1;'),
        )
        .build(),
    ).toBe(
      "for_each(t.pig, query.get_nearby_entities(4, 'minecraft:pig'), {v.x = v.x + 1;});",
    );

    expect(
      new Molang()
        .arrow(new Molang().raw('v.cowcow.friend'), 'v.test.a.b.c')
        .build(),
    ).toBe('v.cowcow.friend->v.test.a.b.c');
  });
});
