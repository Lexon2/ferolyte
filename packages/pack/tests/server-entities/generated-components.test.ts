import { afterEach, describe, expect, it, vi } from 'vitest';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import { ServerEntityBuilder } from '@ferolyte/pack/content/server-entity/server-entity-builder';

import { minimalServerEntityConfig } from './helpers/fixtures';

/** Builds an entity with `components` and returns its components plus the diagnostics. */
const build = (components: Record<string, unknown>) => {
  const collector = collectDiagnostics({ silent: true });
  const entity = new ServerEntityBuilder(
    minimalServerEntityConfig({ components: components as never }),
  )
    .withBuildContext({
      identifier: 'test:entity',
      contentType: 'server-entity',
    })
    .build();
  collector.stop();

  return {
    components: (entity['minecraft:entity'].components ?? {}) as Record<
      string,
      any
    >,
    errors: collector.records.filter((r) => r.severity === 'error'),
    warnings: collector.records.filter((r) => r.severity === 'warning'),
  };
};

const behavior = (name: string, config: unknown) =>
  build({ behaviors: { [name]: config } });

describe('schema-generated entity components', () => {
  afterEach(() => vi.restoreAllMocks());

  describe('marker components', () => {
    it('emits {} for `{}`, `true` and `{ value: true }`', () => {
      for (const config of [{}, true, { value: true }]) {
        const { components, errors } = build({ fireImmune: config });
        expect(components['minecraft:fire_immune']).toEqual({});
        expect(errors).toEqual([]);
      }
    });

    it('omits the component for `{ value: false }`', () => {
      expect(build({ fireImmune: { value: false } }).components).toEqual({});
    });

    it('keeps a bare boolean where the schema accepts one (can_fly)', () => {
      expect(build({ canFly: true }).components['minecraft:can_fly']).toBe(
        true,
      );
    });

    it.each([
      ['notPickableFromInside', 'minecraft:not_pickable_from_inside'],
      ['canStandOnPowderSnow', 'minecraft:can_stand_on_powder_snow'],
      ['freezingImmune', 'minecraft:freezing_immune'],
      ['freezingVulnerable', 'minecraft:freezing_vulnerable'],
      ['spawnEggInteraction', 'minecraft:spawn_egg_interaction'],
    ])('supports %s', (key, minecraftKey) => {
      expect(build({ [key]: {} }).components[minecraftKey]).toEqual({});
    });
  });

  describe('key renaming and diagnostics', () => {
    it('renames camelCase keys exactly as the schema names them', () => {
      expect(
        build({ ageable: { growUp: { event: 'e', target: 'self' } } })
          .components['minecraft:ageable'],
      ).toEqual({ grow_up: { event: 'e', target: 'self' } });
    });

    it('reports unknown fields with a did-you-mean and does not write them', () => {
      const { components, errors } = build({
        ageable: { duraton: 1 },
      });

      expect(components['minecraft:ageable']).toEqual({});
      expect(errors).toHaveLength(1);
      expect(errors[0].fieldPath).toBe('components.ageable.duraton');
      expect(errors[0].message).toContain('Did you mean "duration"');
    });

    it('hints at camelCase when a snake_case key is used', () => {
      const { errors } = build({ ageable: { grow_up: {} } });

      expect(errors[0].message).toContain('Did you mean "growUp"');
    });

    it('reports invalid values with camelCase paths', () => {
      const { errors } = build({
        damageSensor: { triggers: [{ cause: 'all', dealsDamage: 'invalid' }] },
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].fieldPath).toBe(
        'components.damageSensor.triggers[0].dealsDamage',
      );
      expect(errors[0].message).toContain('Must be one of');
    });

    it('does not report when diagnostics are disabled', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      new ServerEntityBuilder(
        minimalServerEntityConfig({
          components: { ageable: { nope: 1 } } as never,
        }),
      )
        .withBuildContext({ diagnostics: false, contentType: 'server-entity' })
        .build();

      expect(spy).not.toHaveBeenCalled();
    });

    it('reports unknown components', () => {
      const { errors, components } = build({ goalSelector: {} });

      expect(components).toEqual({});
      expect(errors[0].message).toContain('goalSelector');
    });
  });

  describe('normalizers', () => {
    it('converts ranges to the form the schema asks for', () => {
      expect(
        behavior('randomHover', { hoverHeight: [1, 4] }).components[
          'minecraft:behavior.random_hover'
        ],
      ).toEqual({ hover_height: { min: 1, max: 4 } });
      expect(
        behavior('timerFlag1', { cooldownRange: [1, 2] }).components[
          'minecraft:behavior.timer_flag_1'
        ],
      ).toEqual({ cooldown_range: { min: 1, max: 2 } });
    });

    it('keeps a plain number where the schema allows `number | range`', () => {
      expect(
        behavior('timerFlag1', { cooldownRange: 3 }).components[
          'minecraft:behavior.timer_flag_1'
        ],
      ).toEqual({ cooldown_range: 3 });
    });

    it('wraps a single trigger where the schema requires a list', () => {
      const { components, errors } = behavior('avoidBlock', {
        onEscape: { event: 'escaped', target: 'self' },
      });

      expect(errors).toEqual([]);
      expect(components['minecraft:behavior.avoid_block'].on_escape).toEqual([
        { event: 'escaped', target: 'self' },
      ]);
    });

    it('converts filters with the existing filter convertors', () => {
      const { components } = build({
        lookedAt: {
          filters: {
            allOf: [{ test: 'is_family', subject: 'other', value: 'player' }],
          },
        },
      });

      expect(components['minecraft:looked_at'].filters).toEqual({
        all_of: [{ test: 'is_family', subject: 'other', value: 'player' }],
      });
    });

    it('wraps single items into lists (interact)', () => {
      const { components, errors } = build({
        interact: {
          interactions: { playSounds: 'pop', spawnEntities: 'minecraft:bee' },
        },
      });

      expect(errors).toEqual([]);
      expect(components['minecraft:interact'].interactions).toBeDefined();
    });
  });

  describe('1.26.40 / 1.26.50 additions', () => {
    it('supports pushable_by_entity presets', () => {
      const { components, errors } = build({
        pushableByEntity: {
          presets: [{ pushMode: 'ball', requireCollisionOverlap: false }],
        },
      });

      expect(errors).toEqual([]);
      expect(components['minecraft:pushable_by_entity']).toEqual({
        presets: [{ push_mode: 'ball', require_collision_overlap: false }],
      });
    });

    it('supports apply_knockback_rules slowdown_scale and knockback_mode', () => {
      const { components, errors } = build({
        applyKnockbackRules: {
          presets: [{ slowdownScale: 0.5, knockbackMode: 'hit_direction' }],
        },
      });

      expect(errors).toEqual([]);
      expect(components['minecraft:apply_knockback_rules']).toEqual({
        presets: [{ slowdown_scale: 0.5, knockback_mode: 'hit_direction' }],
      });
    });

    it('supports projectile should_bounce and impact_damage additions', () => {
      const { components, errors } = build({
        projectile: {
          shouldBounce: 'if_invulnerable',
          hitWater: true,
          onHit: {
            impactDamage: {
              ceilPreCriticalDamage: true,
              difficultyRandomization: 'multiplicative',
              damage: { min: 1, max: 2 },
            },
          },
        },
      });

      expect(errors).toEqual([]);
      expect(components['minecraft:projectile']).toEqual({
        should_bounce: 'if_invulnerable',
        hit_water: true,
        on_hit: {
          impact_damage: {
            ceil_pre_critical_damage: true,
            difficulty_randomization: 'multiplicative',
            damage: { min: 1, max: 2 },
          },
        },
      });
    });

    it('supports ranged_attack in_range_movement_mode', () => {
      expect(
        behavior('rangedAttack', { inRangeMovementMode: 'hold_position' })
          .components['minecraft:behavior.ranged_attack'],
      ).toEqual({ in_range_movement_mode: 'hold_position' });
    });

    it('supports aquatic_charge_attack', () => {
      const { components, errors } = behavior('aquaticChargeAttack', {
        priority: 1,
        chargeCooldownTime: [1, 3],
        chargeSpeed: 0.1,
      });

      expect(errors).toEqual([]);
      expect(components['minecraft:behavior.aquatic_charge_attack']).toEqual({
        priority: 1,
        charge_cooldown_time: { min: 1, max: 3 },
        charge_speed: 0.1,
      });
    });

    it.each(['delayedAttack', 'meleeAttack', 'meleeBoxAttack', 'stompAttack'])(
      'supports on_kill for %s',
      (name) => {
        const { components, errors } = behavior(name, {
          onKill: { event: 'killed', target: 'self' },
        });

        expect(errors).toEqual([]);
        expect(Object.values(components)[0].on_kill).toEqual({
          event: 'killed',
          target: 'self',
        });
      },
    );

    it('supports teleport projectile fields', () => {
      const { components, errors } = build({
        teleport: {
          teleportsOnProjectileHit: true,
          projectileFilter: { test: 'actor_health', value: 1 },
        },
      });

      expect(errors).toEqual([]);
      expect(components['minecraft:teleport']).toEqual({
        teleports_on_projectile_hit: true,
        projectile_filter: { test: 'actor_health', value: 1 },
      });
    });

    it('accepts an item descriptor `{ tags }` in item lists (round-trip bug)', () => {
      const { errors } = behavior('pickupItems', {
        excludedItems: [{ tags: "q.all_tags('minecraft:is_spear')" }, 'a:b'],
      });

      expect(errors).toEqual([]);
    });
  });

  describe('filters', () => {
    const filtersOf = (filters: unknown) => build({ lookedAt: { filters } });

    it('converts tests, groups and lists', () => {
      const { components, errors } = filtersOf({
        anyOf: [
          { test: 'is_family', subject: 'other', value: 'player' },
          { allOf: [{ test: 'on_fire', value: true }] },
        ],
      });

      expect(errors).toEqual([]);
      expect(components['minecraft:looked_at'].filters).toEqual({
        any_of: [
          { test: 'is_family', subject: 'other', value: 'player' },
          { all_of: [{ test: 'on_fire', value: true }] },
        ],
      });
    });

    it('reports unknown tests and invalid values', () => {
      expect(filtersOf({ test: 'no_such_test' }).errors[0].message).toContain(
        'Unknown filter test',
      );
      expect(
        filtersOf({ test: 'is_family', subject: 'nobody', value: 'x' }).errors,
      ).not.toEqual([]);
    });

    it('keeps legacy AND groups as written', () => {
      expect(
        filtersOf({ AND: [{ test: 'is_family', subject: 1, value: 'p' }] })
          .components['minecraft:looked_at'].filters,
      ).toEqual({ AND: [{ test: 'is_family', subject: 1, value: 'p' }] });
    });
  });

  describe('removed and free-form components', () => {
    const buildWith = (version: string | undefined, components: object) => {
      const collector = collectDiagnostics({ silent: true });
      const entity = new ServerEntityBuilder(
        minimalServerEntityConfig({ version, components: components as never }),
      )
        .withBuildContext({
          identifier: 'test:entity',
          contentType: 'server-entity',
        })
        .build();
      collector.stop();

      return {
        components: (entity['minecraft:entity'].components ?? {}) as Record<
          string,
          any
        >,
        errors: collector.records.filter((r) => r.severity === 'error'),
        warnings: collector.records.filter((r) => r.severity === 'warning'),
      };
    };

    it('minecraft:pushable only warns (and is written) while the corpus still uses it (1.26.0)', () => {
      const { components, errors, warnings } = buildWith('1.26.0', {
        pushable: { isPushable: false },
      });

      expect(components['minecraft:pushable']).toEqual({ is_pushable: false });
      expect(errors).toEqual([]);
      expect(
        warnings.some((w) => w.message.includes('not in the Bedrock schemas')),
      ).toBe(true);
    });

    it.each(['1.26.10', '1.26.20'])(
      'minecraft:pushable is an error and is not written at %s',
      (version) => {
        const { components, errors } = buildWith(version, {
          pushable: { isPushable: false },
        });

        expect(components['minecraft:pushable']).toBeUndefined();
        expect(errors).toHaveLength(1);
        expect(errors[0].message).toContain(
          'pushableByEntity / pushableByBlock',
        );
        expect(errors[0].message).toContain('not written');
      },
    );

    it('minecraft:pushable is written with its schema keys below 1.26.10', () => {
      const { components } = buildWith('1.26.0', {
        pushable: { isPushable: false, isPushableByPiston: true },
      });

      expect(components['minecraft:pushable']).toEqual({
        is_pushable: false,
        is_pushable_by_piston: true,
      });
    });

    it('uses the profile minGameVersion when the config has no version', () => {
      const collector = collectDiagnostics({ silent: true });
      const entity = new ServerEntityBuilder(
        minimalServerEntityConfig({ components: { pushable: {} } as never }),
      )
        .withBuildContext({
          contentType: 'server-entity',
          minGameVersion: '1.26.20',
        })
        .build();
      collector.stop();

      expect(
        entity['minecraft:entity'].components?.['minecraft:pushable'],
      ).toBeUndefined();
      expect(collector.errorCount()).toBe(1);
    });

    it('deprecated (not proven removed) behaviors warn and are still written', () => {
      const { components, errors, warnings } = buildWith('1.26.50', {
        behaviors: { followTargetCaptain: { priority: 1 } },
      });

      expect(errors).toEqual([]);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].message).toContain('deprecated');
      expect(components['minecraft:behavior.follow_target_captain']).toEqual({
        priority: 1,
      });
    });

    it('warns about camelCase keys of free-form components and writes them as is', () => {
      const { components, errors, warnings } = buildWith('1.26.20', {
        underwaterMountBreathing: { isThing: true, snake_key: 1 },
      });

      expect(errors).toEqual([]);
      expect(components['minecraft:underwater_mount_breathing']).toEqual({
        isThing: true,
        snake_key: 1,
      });
      expect(warnings).toHaveLength(1);
      expect(warnings[0].message).toContain('"isThing" looks camelCase');
    });

    it('still supports the schema-backed endermen behaviors without warnings', () => {
      const { errors, warnings } = buildWith('1.26.20', {
        behaviors: { endermanTakeBlock: { priority: 1 } },
      });

      expect(errors).toEqual([]);
      expect(warnings).toEqual([]);
    });
  });

  describe('field level markers (official schema differences)', () => {
    const behaviorWith = (version: string, name: string, config: object) => {
      const collector = collectDiagnostics({ silent: true });
      const entity = new ServerEntityBuilder(
        minimalServerEntityConfig({
          version,
          components: { behaviors: { [name]: config } } as never,
        }),
      )
        .withBuildContext({
          identifier: 'test:entity',
          contentType: 'server-entity',
        })
        .build();
      collector.stop();

      return {
        output: Object.values(
          (entity['minecraft:entity'].components ?? {}) as Record<string, any>,
        )[0],
        errors: collector.records.filter((r) => r.severity === 'error'),
        warnings: collector.records.filter((r) => r.severity === 'warning'),
      };
    };

    it('writes official fields that Blockception lacks (barter.controlFlags)', () => {
      const { output, errors, warnings } = behaviorWith('1.26.20', 'barter', {
        controlFlags: ['move'],
      });

      expect(output).toEqual({ control_flags: ['move'] });
      expect(errors).toEqual([]);
      expect(warnings).toEqual([]);
    });

    it('warns below the version a field was introduced in (still written)', () => {
      const { output, errors, warnings } = behaviorWith('1.21.90', 'barter', {
        controlFlags: ['move'],
      });

      expect(output).toEqual({ control_flags: ['move'] });
      expect(errors).toEqual([]);
      expect(warnings).toHaveLength(1);
      expect(warnings[0].message).toContain(
        'introduced in format version 1.26.20',
      );
    });

    it('a field dropped by the official schemas is an error and not written from that version on', () => {
      const old = behaviorWith('1.26.40', 'rangedAttack', { attackRadius: 10 });
      expect(old.output).toEqual({ attack_radius: 10 });
      expect(old.errors).toEqual([]);
      expect(old.warnings).toHaveLength(1);

      const current = behaviorWith('1.26.50', 'rangedAttack', {
        attackRadius: 10,
      });
      expect(current.output).toEqual({});
      expect(current.errors).toHaveLength(1);
      expect(current.errors[0].message).toContain('attackRange');
    });

    it('fields without proof of removal only warn and are written (x-deprecated)', () => {
      const { output, errors, warnings } = behaviorWith(
        '1.26.50',
        'meleeAttack',
        {
          maxDist: 5,
        },
      );

      expect(output).toEqual({ max_dist: 5 });
      expect(errors).toEqual([]);
      expect(warnings[0].message).toContain('deprecated');
    });
  });
});
