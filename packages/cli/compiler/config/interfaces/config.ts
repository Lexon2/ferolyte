export type ArtifexPackOutput =
  | 'minecraft'
  | 'minecraft-dev'
  | 'minecraft-preview'
  | 'minecraft-preview-dev'
  | 'build'
  | (string & {});

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
}

export interface ArtifexScriptsConfig {
  /**
   * The entry file for the scripts.
   *
   * This is used to resolve the paths to the files in the scripts.
   * @default 'scripts/main.ts'
   */
  entry?: string;
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
}
