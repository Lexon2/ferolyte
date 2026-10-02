import { buildContentSuffixRegistry } from './content/utils/content-suffix-registry';

export const BUILD_CONTEXT = {
  IS_LOADED: false,
  SERVER: {
    PORT: 8080,
    HTTP: false as false | { port: number; host: string },
    RELOAD_ON_PACK_CHANGE: false,
  },
  TS: {
    CONFIG_PATH: '',
    ALIASES: {} as Record<string, string>,
  },
  PACKS: {
    PACK_ALIAS: '',
    NAMESPACE: '',
    MIN_GAME_VERSION: '',
    OUTPUT_NAMESPACE_PATH: '',
    OUTPUT_BEHAVIOR_PACK_PATH: '',
    OUTPUT_RESOURCE_PACK_PATH: '',
    SCRIPT_ENTRY_PATH: '',
    SCRIPT_MINIFY: false,
    MINIFY_JSON: false,
    ARCHIVE: false,
    INPUT_BASE_PATH: '',
    INPUT_BEHAVIOR_PACK_PATH: '',
    INPUT_RESOURCE_PACK_PATH: '',
    CACHE_PATH: '',
    LANG: {
      DEFAULT_LOCALE: 'en_US',
      LOCALES: [] as string[],
    },
    CONTENT_SUFFIX_REGISTRY: buildContentSuffixRegistry(),
  },
};
