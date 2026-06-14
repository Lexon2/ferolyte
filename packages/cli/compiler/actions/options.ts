export interface CompilerActionOptions {
  profile: string;
  /** Build progress, timing, success messages. Default: true */
  debug?: boolean;
  /** Content validation diagnostics. Default: true */
  diagnostics?: boolean;
}

export interface ContentBuildOptions {
  debug: boolean;
  diagnostics: boolean;
}

export const resolveCompilerOptions = (
  options: CompilerActionOptions,
): CompilerActionOptions & ContentBuildOptions => ({
  profile: options.profile,
  debug: options.debug ?? true,
  diagnostics: options.diagnostics ?? true,
});
