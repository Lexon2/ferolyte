import type { MolangBuilder } from '../molang/format-molang-value';
import type { MolangExpr } from '../molang/expr/expr';
import { q } from '../molang/expr/namespaces';
import type { EntityEventTarget } from './constants/event-target';
import type { EntityComponents } from './interfaces/entity-components';
import type {
  EntityEventBase,
  EntityEventNode,
  EntityEventRandomize,
} from './interfaces/entity-events';
import type { MinecraftEvents } from './interfaces/server-entity-config';
import type { PartialEntityEventTrigger } from './interfaces/trigger';

/**
 * Names declared inside one config become literal types (`const` type
 * parameters) and are used to check every reference to them in the same config:
 * `add` / `remove` component groups, `trigger`, event fields of components,
 * `setProperty` keys and values. Anything that is not declared in the config
 * (no `events`, no `componentGroups`, no `properties`) stays unrestricted, so
 * plain `createServerEntity({...})` calls keep their wide types.
 */

type Depth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8];

/** Names of the events declared by the config (plus vanilla ones), or `string`. */
export type DeclaredEvents<C> = C extends { events: infer Ev }
  ? string extends keyof Ev
    ? string
    : (keyof Ev & string) | MinecraftEvents
  : string;

/** Names of the component groups declared by the config, or `string`. */
export type DeclaredGroups<C> = C extends {
  componentGroups: infer Groups extends readonly { name: string }[];
}
  ? string extends Groups[number]['name']
    ? string
    : Groups[number]['name']
  : string;

/** The `properties` map of the config, or `never` when it is not declared. */
export type DeclaredProperties<C> = C extends { properties: infer P }
  ? string extends keyof P
    ? never
    : P
  : never;

/** TypeScript type of the value of an entity property definition. */
export type PropertyValue<P> = P extends {
  type: 'enum';
  values: infer V extends readonly string[];
}
  ? V[number]
  : P extends { type: 'int' | 'float' }
    ? number
    : P extends { type: 'boolean' | 'bool' }
      ? boolean
      : never;

/**
 * `{ 'ns:state': 'idle' | 'angry' }` for an entity config: property id -> value type
 * (usable with `entity.getProperty` in scripts).
 */
export type PropertiesOf<C> = {
  -readonly [K in keyof DeclaredProperties<C>]: PropertyValue<
    DeclaredProperties<C>[K]
  >;
};

/**
 * Maps the keys the user actually wrote in `setProperty` to their value type, or
 * `never` for keys that are not declared properties (an intersection with the
 * wide index signature of the config type turns them into errors).
 */
type SetPropertyKeys<SP, P> = [P] extends [never]
  ? unknown
  : {
      [Q in keyof SP]: Q extends keyof P ? PropertyValue<P[Q]> | MolangBuilder : never;
    };

/** Validates `setProperty` of an event node and of its nested sequences. */
type ValidateNode<N, P> = (N extends { setProperty: infer SP }
  ? { setProperty?: SetPropertyKeys<SP, P> }
  : unknown) &
  (N extends { sequence: infer Seq }
    ? { sequence?: { [I in keyof Seq]: ValidateNode<Seq[I], P> } }
    : unknown) &
  (N extends { randomize: infer Rnd }
    ? { randomize?: { [I in keyof Rnd]: ValidateNode<Rnd[I], P> } }
    : unknown) &
  (N extends { firstValid: infer First }
    ? { firstValid?: { [I in keyof First]: ValidateNode<First[I], P> } }
    : unknown);

type TriggerFor<E extends string> =
  | { target?: 'self'; event?: E }
  | { target: Exclude<EntityEventTarget, 'self'>; event?: string };

type NarrowTriggerUnion<V, E extends string> = V extends string
  ? E
  : V extends PartialEntityEventTrigger
    ? V & TriggerFor<E> & object
    : V extends readonly (infer U)[]
      ? NarrowTriggerUnion<U, E>[]
      : V;

type NarrowField<V, E extends string, D extends number> = [
  Extract<V, PartialEntityEventTrigger>,
] extends [never]
  ? Recurse<V, E, D>
  : NarrowTriggerUnion<V, E>;

type Recurse<V, E extends string, D extends number> = V extends readonly (infer U)[]
  ? NarrowField<U, E, D>[]
  : V extends (...args: never[]) => unknown
    ? V
    : V extends MolangBuilder
      ? V
      : V extends object
        ? NarrowObject<V, E, D>
        : V;

type NarrowObject<T, E extends string, D extends number> = [D] extends [never]
  ? T
  : { [K in keyof T]: NarrowField<T[K], E, Depth[D]> };

/** Declared component types with every event reference restricted to the declared events. */
type NarrowComponents<E extends string> = string extends E
  ? unknown
  : { [K in keyof EntityComponents]?: NarrowField<EntityComponents[K], E, 6> };

type NarrowNode<Groups extends string, Events extends string> = Omit<
  EntityEventNode,
  'add' | 'remove' | 'trigger' | 'sequence' | 'randomize' | 'firstValid'
> & {
  add?: { componentGroups: Groups[] };
  remove?: { componentGroups: Groups[] };
  trigger?: Events;
  sequence?: NarrowNode<Groups, Events>[];
  randomize?: (NarrowNode<Groups, Events> & { weight?: number })[];
  firstValid?: NarrowNode<Groups, Events>[];
};

type EnumDefaultChecks<P> = [P] extends [never]
  ? unknown
  : {
      [K in keyof P]?: P[K] extends {
        type: 'enum';
        values: infer V extends readonly string[];
      }
        ? { default: V[number] }
        : unknown;
    };

/**
 * The checks applied to a config `C` (intersected with it): event / group / property
 * names must be declared in the same config.
 */
export type EntityChecks<C> = {
  properties?: EnumDefaultChecks<DeclaredProperties<C>>;
  events?: C extends { events: infer Ev }
    ? {
        [K in keyof Ev]?: NarrowNode<DeclaredGroups<C>, DeclaredEvents<C>> &
          ValidateNode<Ev[K], DeclaredProperties<C>>;
      }
    : unknown;
  components?: NarrowComponents<DeclaredEvents<C>>;
  componentGroups?: C extends { componentGroups: infer Groups }
    ? { [I in keyof Groups]: { components?: NarrowComponents<DeclaredEvents<C>> } }
    : unknown;
};

/** Phantom-typed Molang expression of an entity property. */
export type PropertyExpr<T> = MolangExpr & { readonly __propertyType?: T };

type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${SnakeToCamel<Capitalize<Tail>>}`
  : S;

type PropertyAccessorName<K> = K extends `${string}:${infer Name}`
  ? SnakeToCamel<Name>
  : K extends string
    ? SnakeToCamel<K>
    : never;

export type EntityPropertyExprs<C> = {
  readonly [K in keyof DeclaredProperties<C> as PropertyAccessorName<K>]: PropertyExpr<
    PropertyValue<DeclaredProperties<C>[K]>
  >;
};

const toAccessorName = (id: string): string =>
  (id.includes(':') ? id.slice(id.indexOf(':') + 1) : id).replace(
    /_([a-z0-9])/g,
    (_, char: string) => char.toUpperCase(),
  );

/**
 * Molang accessors for the properties of an entity config:
 * `props(zombie).state` is `q.property('ns:state')`.
 */
export const props = <const C extends { properties?: object }>(
  entity: C,
): EntityPropertyExprs<C> => {
  const accessors: Record<string, MolangExpr> = {};
  for (const id of Object.keys(entity.properties ?? {})) {
    accessors[toAccessorName(id)] = (q.property as unknown as (id: string) => MolangExpr)(id);
  }

  return Object.freeze(accessors) as unknown as EntityPropertyExprs<C>;
};

export type { EntityEventBase, EntityEventRandomize };
