import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AnimationControllerBuilder,
  createAnimationController,
  defineBpState,
  defineRpState,
} from '@ferolyte/pack/animation';
import { not, q } from '@ferolyte/pack/molang';
import { schemasAvailable, validateAgainst } from '../helpers/schema';

const idle = defineRpState({
  animations: ['idle'],
  transitions: [{ walk: q.isMoving }],
});
const walk = defineRpState({
  animations: [{ walk: q.modifiedMoveSpeed }],
  transitions: [{ idle: not(q.isMoving) }, { idle: 'query.is_dead' }],
  blendTransition: 0.2,
  blendViaShortestPath: true,
  onEntry: ['variable.t = 0'],
  onExit: ['variable.t = 1'],
  particleEffects: [{ effect: 'dust', locator: 'foot', bindToActor: false }],
  soundEffects: [{ effect: 'step' }],
  variables: { speed: { input: q.modifiedMoveSpeed, remapCurve: { '0.0': 0, '1.0': 1 } } },
});

const rp = () =>
  createAnimationController({
    id: 'controller.animation.zombie.move',
    initialState: 'idle',
    states: { idle, walk },
  });

describe('AnimationControllerBuilder', () => {
  afterEach(() => vi.restoreAllMocks());

  it('builds an RP controller with Molang v2 and strings', () => {
    const json = rp().build();
    const controller = json.animation_controllers['controller.animation.zombie.move'];

    expect(json.format_version).toBe('1.10.0');
    expect(controller.initial_state).toBe('idle');
    expect(controller.states.idle).toEqual({
      animations: ['idle'],
      transitions: [{ walk: 'query.is_moving' }],
    });
    expect(controller.states.walk.animations).toEqual([
      { walk: 'query.modified_move_speed' },
    ]);
    expect(controller.states.walk.transitions).toEqual([
      { idle: '!query.is_moving' },
      { idle: 'query.is_dead' },
    ]);
    expect(controller.states.walk.blend_transition).toBe(0.2);
    expect(controller.states.walk.on_entry).toEqual(['variable.t = 0;']);
    expect(controller.states.walk.on_exit).toEqual(['variable.t = 1;']);
    expect(rp().kind).toBe('rp');
    expect(rp().metadata).toBe('ferolyte-pack:animation-controller-rp');
  });

  it('is a BP controller when built from BP states', () => {
    const builder = createAnimationController({
      id: 'controller.animation.zombie.logic',
      states: {
        default: defineBpState({
          animations: ['check'],
          onEntry: ['/say hi', '@s ns:start'],
          transitions: [{ done: 'query.is_dead' }],
        }),
        done: defineBpState({ onEntry: ['variable.x = 1;'] }),
      },
    });

    expect(builder.kind).toBe('bp');
    expect(builder.metadata).toBe('ferolyte-pack:animation-controller-bp');
    expect(builder.build().animation_controllers['controller.animation.zombie.logic'].initial_state).toBe('default');
  });

  it('puts several controllers into one file', () => {
    const other = createAnimationController({
      id: 'controller.animation.zombie.other',
      states: { default: defineRpState({ animations: ['idle'] }) },
    });
    const file = AnimationControllerBuilder.buildFile([rp(), other]);

    expect(Object.keys(file.animation_controllers)).toEqual([
      'controller.animation.zombie.move',
      'controller.animation.zombie.other',
    ]);
  });

  it('reports unknown targets, bad ids and missing initial state', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const builder = createAnimationController({
      id: 'controller.animation.zombie.bad' as `controller.animation.${string}`,
      initialState: 'missing' as 'a',
      states: { a: defineRpState({ transitions: [{ nowhere: 'true' } as any] }) },
    }).withBuildContext({ sourceFile: 'x.ac.rp.ts' });
    const json = builder.build();

    expect(error).toHaveBeenCalledTimes(2);
    expect(json.animation_controllers['controller.animation.zombie.bad'].states.a).toEqual({});

    const badId = createAnimationController({
      id: 'zombie.bad' as `controller.animation.${string}`,
      states: { default: defineRpState({}) },
    }).withBuildContext({ sourceFile: 'x.ac.rp.ts' });
    badId.build();
    expect(error).toHaveBeenCalledTimes(3);
  });

  it.skipIf(!schemasAvailable)('validates against the bedrock schemas', () => {
    expect(validateAgainst('animation_controller_rp', rp().build())).toEqual([]);

    const bp = createAnimationController({
      id: 'controller.animation.zombie.logic',
      states: {
        default: defineBpState({
          animations: ['check', { fast: 'query.is_moving' }],
          onEntry: ['/say hi', '@s ns:start'],
          onExit: ['variable.x = 1'],
          transitions: [{ done: 'query.is_dead' }],
        }),
        done: defineBpState({}),
      },
    });
    expect(validateAgainst('animation_controller_bp', bp.build())).toEqual([]);
  });
});
