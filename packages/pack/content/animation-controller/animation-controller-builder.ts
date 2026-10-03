import { cloneConfig } from '@ferolyte/common/object/clone-config';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ContentBuilder } from '@ferolyte/common/content/interfaces/content-builder';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import { parseMolangExpression } from '../molang/parse-molang-expression';
import type {
  AnimationControllerConfig,
  AnyStateDefinition,
  ControllerAnimation,
  ControllerMolang,
  ControllerTransitions,
  RpStateDefinition,
} from './types';

const ID_PREFIX = 'controller.animation.';
const DEFAULT_VERSION = '1.10.0';

/** Commands and events are kept as written, anything else is a Molang statement. */
const formatAction = (value: ControllerMolang): string => {
  const text = parseMolangExpression(value);
  if (text.startsWith('/') || text.startsWith('@s ')) {
    return text;
  }

  return text.endsWith(';') ? text : `${text};`;
};

const formatAnimations = (animations: ControllerAnimation[]) =>
  animations.map((animation) =>
    typeof animation === 'string'
      ? animation
      : Object.fromEntries(
          Object.entries(animation).map(([name, value]) => [
            name,
            parseMolangExpression(value),
          ]),
        ),
  );

export class AnimationControllerBuilder implements ContentBuilder {
  readonly metadata:
    | typeof CONTENT_METADATA.ANIMATION_CONTROLLER_BP
    | typeof CONTENT_METADATA.ANIMATION_CONTROLLER_RP;

  private config: AnimationControllerConfig;

  private buildContext?: ContentDiagnosticContext;

  constructor(config: AnimationControllerConfig) {
    this.config = config;
    const kinds = new Set(Object.values(config.states).map((s) => s.kind));
    this.metadata =
      kinds.size === 1 && kinds.has('bp')
        ? CONTENT_METADATA.ANIMATION_CONTROLLER_BP
        : CONTENT_METADATA.ANIMATION_CONTROLLER_RP;
  }

  /** `bp` or `rp`, decided by the kind of the states. */
  public get kind(): 'bp' | 'rp' {
    return this.metadata === CONTENT_METADATA.ANIMATION_CONTROLLER_BP
      ? 'bp'
      : 'rp';
  }

  public withBuildContext(ctx: ContentDiagnosticContext): this {
    this.buildContext = {
      contentType:
        this.kind === 'bp'
          ? 'animation-controller-bp'
          : 'animation-controller-rp',
      ...ctx,
    };
    return this;
  }

  public cloneConfig(): AnimationControllerConfig {
    return cloneConfig(this.config);
  }

  public get id(): string {
    return this.config.id;
  }

  /** One file with every controller of the list. */
  public static buildFile(builders: AnimationControllerBuilder[]): any {
    const controllers: Record<string, unknown> = {};
    let version = DEFAULT_VERSION;
    for (const builder of builders) {
      controllers[builder.config.id] = builder.buildController();
      version = builder.config.version ?? version;
    }

    return { format_version: version, animation_controllers: controllers };
  }

  public build(): any {
    return AnimationControllerBuilder.buildFile([this]);
  }

  private ctx(fieldPath: string): ContentDiagnosticContext | undefined {
    return (
      this.buildContext && {
        ...this.buildContext,
        identifier: this.config.id,
        fieldPath,
      }
    );
  }

  private buildController() {
    const { id, initialState, states } = this.config;
    const names = Object.keys(states);

    if (!id.startsWith(ID_PREFIX) || id.length === ID_PREFIX.length) {
      logContentError(
        this.ctx('id'),
        `Controller id must start with "${ID_PREFIX}"`,
      );
    }

    if (new Set(Object.values(states).map((state) => state.kind)).size > 1) {
      logContentError(
        this.ctx('states'),
        'A controller cannot mix defineRpState and defineBpState states',
      );
    }

    const initial =
      initialState ?? (names.includes('default') ? 'default' : undefined);
    if (initial === undefined || !names.includes(initial)) {
      logContentError(
        this.ctx('initialState'),
        `Initial state "${String(initial ?? 'default')}" is not one of: ${names.join(', ')}`,
      );
    }

    const controller: Record<string, unknown> = {};
    if (initial !== undefined) {
      controller.initial_state = initial;
    }
    controller.states = Object.fromEntries(
      names.map((name) => [name, this.buildState(name, states[name], names)]),
    );

    return controller;
  }

  private formatTransitions(
    name: string,
    transitions: ControllerTransitions,
    names: string[],
  ) {
    const result: Record<string, string>[] = [];
    for (const item of transitions) {
      for (const [target, condition] of Object.entries(item)) {
        if (!names.includes(target)) {
          logContentError(
            this.ctx(`states.${name}.transitions`),
            `Transition target "${target}" is not a state of this controller`,
          );
          continue;
        }
        result.push({
          [target]: parseMolangExpression(condition as ControllerMolang),
        });
      }
    }

    return result;
  }

  private buildState(
    name: string,
    state: AnyStateDefinition,
    names: string[],
  ) {
    const out: Record<string, unknown> = {};

    if (state.animations?.length) {
      out.animations = formatAnimations(state.animations);
    }
    if (state.kind === 'rp') {
      this.buildRpFields(out, state);
    }
    if (state.onEntry?.length) {
      out.on_entry = state.onEntry.map(formatAction);
    }
    if (state.onExit?.length) {
      out.on_exit = state.onExit.map(formatAction);
    }
    if (state.transitions?.length) {
      const transitions = this.formatTransitions(
        name,
        state.transitions,
        names,
      );
      if (transitions.length) {
        out.transitions = transitions;
      }
    }

    return out;
  }

  private buildRpFields(
    out: Record<string, unknown>,
    state: RpStateDefinition,
  ) {
    if (state.blendTransition !== undefined) {
      out.blend_transition = state.blendTransition;
    }
    if (state.blendViaShortestPath !== undefined) {
      out.blend_via_shortest_path = state.blendViaShortestPath;
    }
    if (state.particleEffects?.length) {
      out.particle_effects = state.particleEffects.map((effect) => ({
        effect: effect.effect,
        ...(effect.locator !== undefined && { locator: effect.locator }),
        ...(effect.preEffectScript !== undefined && {
          pre_effect_script: parseMolangExpression(effect.preEffectScript),
        }),
        ...(effect.bindToActor !== undefined && {
          bind_to_actor: effect.bindToActor,
        }),
      }));
    }
    if (state.soundEffects?.length) {
      out.sound_effects = state.soundEffects.map((effect) => ({ ...effect }));
    }
    if (state.variables) {
      out.variables = Object.fromEntries(
        Object.entries(state.variables).map(([key, variable]) => [
          key,
          {
            input: parseMolangExpression(variable.input),
            ...(variable.remapCurve !== undefined && {
              remap_curve: variable.remapCurve,
            }),
          },
        ]),
      );
    }
  }
}
