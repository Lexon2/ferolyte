import type { Plugin } from 'esbuild';

/**
 * Replaces `@minecraft/*` modules with an inert stub so content files that
 * import game APIs can be evaluated outside of Minecraft.
 */
const STUB_SOURCE = `
const create = () => new Proxy(function () {}, {
  get: (_, key) => (key === '__esModule' ? false : key === 'then' ? undefined : create()),
  apply: () => create(),
  construct: () => create(),
});
module.exports = create();
`;

export const stubMinecraftPlugin = (): Plugin => ({
  name: 'ferolyte-stub-minecraft',
  setup(build) {
    build.onResolve({ filter: /^@minecraft\// }, (args) => ({
      path: args.path,
      namespace: 'ferolyte-stub',
    }));
    build.onLoad({ filter: /.*/, namespace: 'ferolyte-stub' }, () => ({
      contents: STUB_SOURCE,
      loader: 'js',
    }));
  },
});
