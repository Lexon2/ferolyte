import { CompilerActionOptions } from '../../compiler/actions/options';
import { logger, resolveLogLevel } from '../../compiler/utils/logger';
import { setStrictReferences } from '../../compiler/registry/project-registry';

export const profileArg = {
  type: 'positional' as const,
  description: 'Config profile name from ferolyte.config.mts',
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

export const quietFlag = {
  type: 'boolean' as const,
  description: 'Only print errors',
  default: false,
};

export const verboseFlag = {
  type: 'boolean' as const,
  description: 'Print output paths and full error details',
  default: false,
};

export const strictFlag = {
  type: 'boolean' as const,
  description: 'Treat unknown references (geometry, animation, texture, events...) as errors',
  default: false,
};

export const compilerCommandArgs = {
  strict: strictFlag,
  profile: profileArg,
  debug: debugFlag,
  diagnostics: diagnosticsFlag,
  quiet: quietFlag,
  verbose: verboseFlag,
};

export interface CompilerCliArgs {
  profile: string;
  debug: boolean;
  diagnostics: boolean;
  quiet?: boolean;
  strict?: boolean;
  verbose?: boolean;
}

export const toCompilerOptions = (
  args: CompilerCliArgs,
): CompilerActionOptions => {
  logger.setLevel(resolveLogLevel(args));
  setStrictReferences(args.strict === true);

  return {
  profile: args.profile,
  debug: args.debug,
  diagnostics: args.diagnostics,
  };
};
