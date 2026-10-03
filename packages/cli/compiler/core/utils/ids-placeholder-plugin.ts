import type { Plugin } from 'esbuild';

/** Exports of `.ferolyte/types/ids.ts` (kept in sync with the generator by a test). */
export const IDS_EXPORTS = [
  'EntityId',
  'ItemId',
  'BlockId',
  'AnimationId',
  'AnimationControllerId',
  'BpAnimationId',
  'BpAnimationControllerId',
  'AttachableId',
  'RenderControllerId',
  'RecipeId',
  'SpawnRuleId',
  'GeometryId',
  'ItemTextureKey',
  'SoundId',
  'EntityEvent',
  'EntityProperty',
  'BlockState',
] as const;

/**
 * Bootstrap stand-in of `@ferolyte/ids`: every export is a deep proxy, so content that reads ids of other content
 * (`EntityId.Zombie`, `EntityEvent.Zombie.Angry`, ...) evaluates before `ids.ts` exists. Its values are placeholders:
 * the bootstrap pass only collects the ids the content defines and never writes what it builds.
 */
const source = (): string => `
const marker = (path) => new Proxy(function () {}, {
  get: (_, key) => {
    if (key === Symbol.toPrimitive) return () => '__ferolyte_id_placeholder__:' + path;
    if (key === 'toString' || key === 'valueOf' || key === 'toJSON') return () => '__ferolyte_id_placeholder__:' + path;
    if (key === 'then' || typeof key === 'symbol') return undefined;
    return marker(path + '.' + key);
  },
  apply: () => marker(path + '()'),
});
${IDS_EXPORTS.map((name) => `export const ${name} = marker('${name}');`).join('\n')}
`;

export const idsPlaceholderPlugin = (): Plugin => ({
  name: 'ferolyte-ids-placeholder',
  setup(build) {
    build.onResolve({ filter: /^@ferolyte\/ids$/ }, (args) => ({
      path: args.path,
      namespace: 'ferolyte-ids-placeholder',
    }));
    build.onLoad({ filter: /.*/, namespace: 'ferolyte-ids-placeholder' }, () => ({
      contents: source(),
      loader: 'js',
    }));
  },
});
