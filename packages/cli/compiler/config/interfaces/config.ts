import { ArtifexPlugin } from '../../plugins/types';

export type ArtifexPackOutput =
  | 'minecraft'
  | 'minecraft-dev'
  | 'minecraft-preview'
  | 'minecraft-preview-dev'
  | 'build'
  | (string & {});

export type ArtifexContentTypeKey =
  | 'block'
  | 'item'
  | 'server-entity'
  | 'client-entity';

export type ArtifexContentSuffixConfig = Partial<
  Record<ArtifexContentTypeKey, string | string[]>
>;

export interface ArtifexPackConfig {
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
   * @default 1.21.80
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
  output?: ArtifexPackOutput;

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
  contentSuffixes?: ArtifexContentSuffixConfig;
}

export interface ArtifexScriptsConfig {
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

export interface ArtifexProfileConfig {
  packs: ArtifexPackConfig;
  scripts?: ArtifexScriptsConfig;
  /**
   * The path to the tsconfig file for the pack.
   *
   * This is used to resolve the paths to the files in the pack.
   */
  tsconfig?: string;
}

export interface ArtifexConfig {
  profiles: Record<string, ArtifexProfileConfig>;
  plugins?: ArtifexPlugin[];
}
