import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { isVersionAtLeast } from '@ferolyte/common/content/versions/compare-version';
import type { ComponentOverride } from '../generated/runtime';

/** Entity format version from which the game parses entity files strictly (an invalid file fails to load). */
export const STRICT_ENTITY_FORMAT = '1.26.60';
/** `minecraft:timer` `time` is a `{ min, max }` object from this entity format version on. */
export const TIMER_RANGE_FORMAT = '1.26.50';

type Config = Record<string, unknown>;

const isObject = (value: unknown): value is Config =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Whether the `format_version` written to the file is `version` or newer. */
const writtenAtLeast = (ctx: ContentDiagnosticContext | undefined, version: string) =>
  ctx?.outputVersion !== undefined && isVersionAtLeast(ctx.outputVersion, version);

/** A plain number where only `{ min, max }` is accepted: `{ min: n, max: n }`. */
const numberToRange = (value: unknown) =>
  typeof value === 'number' ? { min: value, max: value } : value;

/** A single value where only a list is accepted: a one-element list. */
const toList = (value: unknown) =>
  value === undefined || Array.isArray(value) ? value : [value];

/** Rewrites the listed fields of a component config (shallow copy; the config of the user is not changed). */
const rewrite = (
  config: unknown,
  fields: Record<string, (value: unknown) => unknown>,
): unknown => {
  if (!isObject(config)) {
    return config;
  }
  const out: Config = { ...config };
  for (const [field, fix] of Object.entries(fields)) {
    if (out[field] !== undefined) {
      out[field] = fix(out[field]);
    }
  }

  return out;
};

/** Applies `fields` only when the written format version is `since` or newer. */
const from = (
  since: string,
  fields: Record<string, (value: unknown) => unknown>,
): ComponentOverride => ({
  pre: (config, ctx) => (writtenAtLeast(ctx, since) ? rewrite(config, fields) : config),
});

/**
 * `on_rider_enter_event` / `on_rider_exit_event` are event ids (the event runs on the ridden entity). The game
 * rejects an event object ("unknown child schema option type. Allowed types: 'string'"), and the event never fires.
 */
const riderEvent =
  (field: string, ctx: ContentDiagnosticContext | undefined) => (value: unknown) => {
    if (!isObject(value)) {
      return value;
    }
    const event = typeof value.event === 'string' ? value.event : undefined;
    logContentError(
      ctx === undefined ? undefined : { ...ctx, fieldPath: field },
      `rideable.${field} takes an event id string, not an event object (the game rejects it and the event never fires): write ${field}: '${event ?? '<namespace>:<event>'}'`,
    );

    return event ?? value;
  };

/**
 * SDK rules of entity components on top of the generated conversion. From entity format 1.26.60 the game parses
 * entity files strictly; the shapes older formats accepted are rewritten to the accepted ones there.
 */
export const entityOverrides: Record<string, ComponentOverride> = {
  rideable: {
    pre: (config, ctx) => {
      const events = rewrite(config, {
        onRiderEnterEvent: riderEvent('onRiderEnterEvent', ctx),
        onRiderExitEvent: riderEvent('onRiderExitEvent', ctx),
      });

      return writtenAtLeast(ctx, STRICT_ENTITY_FORMAT) ? rewrite(events, { seats: toList }) : events;
    },
  },
  timer: from(TIMER_RANGE_FORMAT, { time: numberToRange }),
  movementJump: from(STRICT_ENTITY_FORMAT, { jumpDelay: numberToRange }),
  economyTradeTable: from(STRICT_ENTITY_FORMAT, {
    curedDiscount: numberToRange,
    maxCuredDiscount: numberToRange,
  }),
  transformation: {
    pre: (config, ctx) => {
      if (!writtenAtLeast(ctx, STRICT_ENTITY_FORMAT)) {
        return config;
      }
      const delay = isObject(config) ? config.delay : undefined;
      if (isObject(delay) && (delay.rangeMin !== undefined || delay.rangeMax !== undefined)) {
        logContentError(
          ctx === undefined ? undefined : { ...ctx, fieldPath: 'delay' },
          `transformation.delay.rangeMin / rangeMax are not accepted by entity format ${STRICT_ENTITY_FORMAT}: use delay: { value }`,
        );
      }

      return rewrite(config, {
        delay: (value) => (typeof value === 'number' ? { value } : value),
        beginTransformSound: toList,
        transformationSound: toList,
      });
    },
  },
  spellEffects: from(STRICT_ENTITY_FORMAT, {
    addEffects: (value) =>
      Array.isArray(value)
        ? value.map((effect) => (typeof effect === 'string' ? { effect } : effect))
        : value,
    removeEffects: toList,
  }),
  healable: from(STRICT_ENTITY_FORMAT, {
    items: (value) =>
      Array.isArray(value)
        ? value.map((item) => rewrite(item, { effects: toList }))
        : value,
  }),
};
