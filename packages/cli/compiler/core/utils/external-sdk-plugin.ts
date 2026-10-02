import type { Plugin } from 'esbuild';

const SDK_PATTERN = /^@ferolyte\/(pack|common)(\/|$)/;

/**
 * Keeps `@ferolyte/pack` and `@ferolyte/common` out of content bundles: the SDK
 * (megabytes of generated code) is evaluated once per process and shared.
 * A project that maps these packages to its own sources through tsconfig
 * `paths` (a workspace, tests) keeps bundling them.
 */
export const externalSdkPlugin = (aliases: Record<string, string>): Plugin => ({
  name: 'ferolyte-external-sdk',
  setup(build) {
    // Escape hatch: FEROLYTE_BUNDLE_SDK=1 bundles the SDK into every content file (slower).
    if (process.env.FEROLYTE_BUNDLE_SDK === '1') {
      return;
    }

    const aliased = (specifier: string) =>
      Object.keys(aliases).some((key) => {
        const prefix = key.replace(/\/\*$/, '');

        return specifier === prefix || specifier.startsWith(`${prefix}/`);
      });

    build.onResolve({ filter: SDK_PATTERN }, (args) =>
      aliased(args.path) ? undefined : { path: args.path, external: true },
    );
  },
});
