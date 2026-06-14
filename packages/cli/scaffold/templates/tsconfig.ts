export interface TsconfigTemplateInput {
  pathAlias: string;
}

const SHARED_COMPILER_OPTIONS = {
  module: 'ES2020',
  target: 'es2020',
  lib: ['es2020', 'dom'],
  moduleResolution: 'node',
  rootDir: '.',
  baseUrl: '.',
  declaration: false,
  noEmit: true,
  noEmitHelpers: true,
  sourceMap: false,
  pretty: true,
  forceConsistentCasingInFileNames: true,
  strict: true,
  resolveJsonModule: true,
  allowSyntheticDefaultImports: true,
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
};

export const createTsconfigTemplate = ({ pathAlias }: TsconfigTemplateInput): string => {
  const config = {
    compilerOptions: {
      ...SHARED_COMPILER_OPTIONS,
      paths: {
        [`${pathAlias}/*`]: ['packs/*'],
      },
    },
    include: ['packs/**/*', 'artifex.config.mts'],
    exclude: ['node_modules'],
    compileOnSave: false,
  };

  return `${JSON.stringify(config, null, 2)}\n`;
};

export const createTsconfigScriptsTemplate = ({
  pathAlias,
}: TsconfigTemplateInput): string => {
  const config = {
    compilerOptions: {
      ...SHARED_COMPILER_OPTIONS,
      allowJs: true,
      paths: {
        [`${pathAlias}/*`]: ['packs/*'],
      },
    },
    include: ['packs/scripts/**/*'],
    exclude: ['node_modules'],
    compileOnSave: false,
  };

  return `${JSON.stringify(config, null, 2)}\n`;
};
