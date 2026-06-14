import { CompilerActionOptions } from '../../compiler/actions/options';

export const profileArg = {
  type: 'positional' as const,
  description: 'Config profile name from artifex.config.mts',
  required: false,
  default: 'default',
};

export const debugFlag = {
  type: 'boolean' as const,
  description: 'Show build progress and timing',
  default: true,
};

export const diagnosticsFlag = {
  type: 'boolean' as const,
  description: 'Enable content validation diagnostics',
  default: true,
};

export const compilerCommandArgs = {
  profile: profileArg,
  debug: debugFlag,
  diagnostics: diagnosticsFlag,
};

export interface CompilerCliArgs {
  profile: string;
  debug: boolean;
  diagnostics: boolean;
}

export const toCompilerOptions = (
  args: CompilerCliArgs,
): CompilerActionOptions => ({
  profile: args.profile,
  debug: args.debug,
  diagnostics: args.diagnostics,
});
