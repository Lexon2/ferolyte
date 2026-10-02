import { FerolytePlugin } from '../../plugins/types';

export type FerolytePackOutput =
  | 'minecraft'
  | 'minecraft-dev'
  | 'minecraft-preview'
  | 'minecraft-preview-dev'
  | 'build'
  | (string & {});

export type FerolyteContentTypeKey =
  | 'block'
  | 'item'
  | 'server-entity'
  | 'client-entity'
  | 'animation-controller-bp'
  | 'animation-controller-rp';

export type FerolyteContentSuffixConfig = Partial<
  Record<FerolyteContentTypeKey, string | string[]>
>;

export interface FerolyteLangConfig {
  /**
   * Locale used for plain-string `displayName` values.
   * @default 'en_US'
   */
  defaultLocale?: string;

  /**
   * Locales that always get a `texts/<locale>.lang` file. Entries without a
   * translation fall back to the default locale.
   */
  locales?: string[];
}

export interface FerolytePackConfig {
  /**
   * The alias for the pack.
   *
   * This is used to create the pack folder name in the output directory.
   *
   * For example:
   * - `test`: The pack will be named `TEST_BP` and `TEST_RP` in the output directory.
   */
  alias: string;

  /**
   * The namespace for the pack.
   *
   * This is used to create the pack folder name in the output directory.
   */
  namespace: string;

  /**
   * The minimum game version for the pack.
   * @default 1.26.20
   */
  minGameVersion?: string;

  /**
   * The output directory for the pack.
   *
   * - `minecraft`: The output directory for the pack will be in the `com.mojang/${BP or RP}` directory.
   * - `minecraft-dev`: The output directory for the pack will be in the `com.mojang/development_${BP or RP}` directory.
   * - `build`: The output directory for the pack will be in the `build` folder in the current working directory.
   * - `custom`: The output directory for the pack will be in the directory specified in the `output` field.
   */
  output?: FerolytePackOutput;

  /**
   * The input directory for the pack.
   *
   * This is used to resolve the paths to the files in the pack.
   * @default 'packs'
   */
  input?: string;

  /**
   * Minifies all output JSON files (compiled from TS and copied JSON).
   * @default false
   */
  minifyJSON?: boolean;

  /**
   * Creates a `{alias}.mcaddon` archive in the project root after a full build.
   * The archive contains `{alias}_BP` and `{alias}_RP` pack folders.
   * @default false
   */
  archive?: boolean;

  /**
   * Input file suffixes per content type (without `.ts`).
   *
   * Output JSON mirrors the matched input suffix, e.g. `cow.e.bp.ts` → `cow.e.bp.json`.
   *
   * @example
   * ```ts
   * contentSuffixes: {
   *   block: ['b', 'bl'],
   *   'server-entity': ['e.bp'],
   *   'client-entity': ['entity', 'e.rp'],
   * }
   * ```
   */
  contentSuffixes?: FerolyteContentSuffixConfig;

  /**
   * Generation of `texts/*.lang` from content `displayName` values.
   * Generated entries are merged with the `texts/*.lang` files of the resource pack input.
   */
  lang?: FerolyteLangConfig;
}

export interface FerolyteScriptsConfig {
  /**
   * The entry file for the scripts.
   *
   * This is used to resolve the paths to the files in the scripts.
   * @default 'packs/scripts/main.ts'
   */
  entry?: string;

  /**
   * Minifies the scripts output.
   * @default false
   */
  minify?: boolean;
}

export interface FerolyteServerHttpConfig {
  port: number;
  /** Only loopback is allowed. */
  host?: '127.0.0.1';
}

export interface FerolyteServerConfig {
  /**
   * Port of the WebSocket hub the game connects to (`/connect localhost:<port>`).
   * @default 8080
   */
  port?: number;

  /**
   * Optional HTTP API (`/status`, `/command`, `/scriptevent`, `/events`, `/subscribe`
   * plus plugin routes). Disabled by default.
   */
  http?: false | FerolyteServerHttpConfig;

  /**
   * Send `/reload` to the game after pack files change in watch mode.
   * @default false
   */
  reloadOnPackChange?: boolean;
}

export interface FerolyteProfileConfig {
  packs: FerolytePackConfig;
  scripts?: FerolyteScriptsConfig;
  server?: FerolyteServerConfig;
  /**
   * The path to the tsconfig file for the pack.
   *
   * This is used to resolve the paths to the files in the pack.
   */
  tsconfig?: string;
}

export interface FerolyteConfig {
  profiles: Record<string, FerolyteProfileConfig>;
  plugins?: FerolytePlugin[];
}
