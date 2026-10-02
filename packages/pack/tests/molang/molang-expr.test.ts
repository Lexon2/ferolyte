import { describe, expect, it } from 'vitest';

import {
  add,
  and,
  arrow,
  assign,
  coalesce,
  eq,
  forEach,
  gt,
  loop,
  math,
  molang,
  mul,
  not,
  or,
  q,
  query,
  raw,
  ret,
  stmt,
  sub,
  t,
  ternary,
  v,
  MolangExpr,
  MolangStatement,
} from '../../content/molang';
import { parseMolangExpression, parseMolangStatement } from '../../content/molang';

describe('Molang v2: atoms', () => {
  it('builds queries as properties and functions', () => {
    expect(q.isBaby.build()).toBe('query.is_baby');
    expect(q.allAnimationsFinished.toString()).toBe(
      'query.all_animations_finished',
    );
    expect(q.isItemEquipped('main_hand').build()).toBe(
      "query.is_item_equipped('main_hand')",
    );
    expect(query('get_nearby_entities', 4, 'minecraft:pig').build()).toBe(
      "query.get_nearby_entities(4, 'minecraft:pig')",
    );
    expect(q.isBaby instanceof MolangExpr).toBe(true);
    expect(query('isBaby').build()).toBe('query.is_baby');
  });

  it('builds variables and math', () => {
    expect(v('speed').build()).toBe('variable.speed');
    expect(t('moo').build()).toBe('temp.moo');
    expect(math.clamp(v('x'), 0, 2).build()).toBe(
      'math.clamp(variable.x, 0, 2)',
    );
    expect(math.randomInteger(10, 100).build()).toBe(
      'math.random_integer(10, 100)',
    );
    expect(math.randomInt(1, 2).build()).toBe('math.random_integer(1, 2)');
    expect(math.pi.build()).toBe('math.pi');
  });

  it('escapes string literals', () => {
    expect(molang`${"it's"}`.build()).toBe("'it" + String.fromCharCode(92) + "'s'");
  });
});

describe('Molang v2: immutability', () => {
  it('reuses values safely and freezes them', () => {
    const speed = v('speed');
    const a = gt(speed, 1);
    const b = gt(speed, 1);
    expect(a.build()).toBe(b.build());
    expect(speed.build()).toBe('variable.speed');
    expect(Object.isFrozen(speed)).toBe(true);
    expect(Object.isFrozen(q.isBaby)).toBe(true);
  });
});

describe('Molang v2: operators and precedence', () => {
  it('parenthesises weaker operands', () => {
    expect(mul(add(1, 2), 3).build()).toBe('(1 + 2) * 3');
    expect(add(1, mul(2, 3)).build()).toBe('1 + 2 * 3');
    expect(sub(1, sub(2, 3)).build()).toBe('1 - (2 - 3)');
    expect(and(or(q.isBaby, q.isSneaking), q.isOnGround).build()).toBe(
      '(query.is_baby || query.is_sneaking) && query.is_on_ground',
    );
    expect(or(and(q.isBaby, q.isSneaking), q.isOnGround).build()).toBe(
      'query.is_baby && query.is_sneaking || query.is_on_ground',
    );
    expect(not(and(q.isBaby, q.isSneaking)).build()).toBe(
      '!(query.is_baby && query.is_sneaking)',
    );
    expect(not(q.isBaby).build()).toBe('!query.is_baby');
    expect(coalesce(v('a'), 0).build()).toBe('variable.a ?? 0');
    expect(eq(1, 1).build()).toBe('1 == 1');
  });

  it('supports variadic and/or', () => {
    expect(and(q.isBaby, q.isSneaking, q.isOnGround).build()).toBe(
      'query.is_baby && query.is_sneaking && query.is_on_ground',
    );
  });

  it('builds ternary and wraps nested ternaries', () => {
    expect(ternary(q.isBaby, -8, 0).build()).toBe('query.is_baby ? -8 : 0');
    expect(add(1, ternary(q.isBaby, 1, 2)).build()).toBe(
      '1 + (query.is_baby ? 1 : 2)',
    );
    expect(ternary(ternary(q.isBaby, 1, 0), 1, 2).build()).toBe(
      '(query.is_baby ? 1 : 0) ? 1 : 2',
    );
  });

  it('builds arrow access', () => {
    expect(arrow(raw('v.cowcow.friend', 10), 'v.test.a').build()).toBe(
      'v.cowcow.friend->v.test.a',
    );
  });
});

describe('Molang v2: tagged template', () => {
  it('matches the roadmap example', () => {
    const speed = v('speed');
    expect(
      molang`${q.isMoving} && ${speed} > 1 ? ${math.clamp(speed, 0, 2)} : 0`.build(),
    ).toBe(
      'query.is_moving && variable.speed > 1 ? math.clamp(variable.speed, 0, 2) : 0',
    );
  });

  it('parenthesises composite interpolations and keeps numbers', () => {
    expect(molang`${add(1, 2)} * ${3}`.build()).toBe('(1 + 2) * 3');
    expect(molang`${-1} * 2`.build()).toBe('-1 * 2');
    expect(molang`${q.isItemEquipped('main_hand')}`.build()).toBe(
      "query.is_item_equipped('main_hand')",
    );
  });

  it('is wrapped when used as an operand', () => {
    expect(mul(molang`1 + 2`, 3).build()).toBe('(1 + 2) * 3');
  });
});

describe('Molang v2: statements', () => {
  it('builds assign and ret', () => {
    expect(assign(v('x'), add(v('x'), 1)).build()).toBe(
      'variable.x = variable.x + 1;',
    );
    expect(ret(1).build()).toBe('return 1;');
    expect(stmt`${v('x')} = 0`.build()).toBe('variable.x = 0;');
    expect(assign(v('x'), 1)).toBeInstanceOf(MolangStatement);
  });

  it('builds loop and forEach', () => {
    expect(
      loop(10, assign(v('x'), add(v('x'), 1)), assign(v('y'), 2)).build(),
    ).toBe('loop(10, {variable.x = variable.x + 1; variable.y = 2;});');
    expect(
      forEach(
        t('pig'),
        query('get_nearby_entities', 4, 'minecraft:pig'),
        assign(v('x'), add(v('x'), 1)),
      ).build(),
    ).toBe(
      "for_each(temp.pig, query.get_nearby_entities(4, 'minecraft:pig'), {variable.x = variable.x + 1;});",
    );
  });
});

describe('Molang v2: config integration', () => {
  it('is accepted by the parse helpers', () => {
    expect(parseMolangExpression(q.isBaby)).toBe('query.is_baby');
    expect(parseMolangStatement(assign(v('x'), 1))).toBe('variable.x = 1;');
    expect(String(q.isBaby)).toBe('query.is_baby');
    expect(`${v('x')}`).toBe('variable.x');
  });
});
