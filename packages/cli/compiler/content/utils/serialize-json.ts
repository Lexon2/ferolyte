import { BUILD_CONTEXT } from '../../build-context';

export const serializeJson = (value: unknown): string =>
  JSON.stringify(
    value,
    null,
    BUILD_CONTEXT.PACKS.MINIFY_JSON ? undefined : 2,
  );
