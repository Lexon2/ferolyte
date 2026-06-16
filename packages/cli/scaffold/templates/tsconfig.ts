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

const FEROLYTE_PATHS = {
  '@ferolyte/pack/*': ['node_modules/@ferolyte/pack/*'],
  '@ferolyte/common/*': ['node_modules/@ferolyte/common/*'],
  '@ferolyte/cli/*': ['node_modules/@ferolyte/cli/*'],
};

export const createTsconfigTemplate = ({
  pathAlias,
}: TsconfigTemplateInput): string => {
  const config = {
    compilerOptions: {
      ...SHARED_COMPILER_OPTIONS,
      paths: {
        [`${pathAlias}/*`]: ['packs/*'],
        ...FEROLYTE_PATHS,
      },
    },
    include: ['packs/**/*', 'ferolyte.config.mts'],
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
        ...FEROLYTE_PATHS,
      },
    },
    include: ['packs/scripts/**/*'],
    exclude: ['node_modules'],
    compileOnSave: false,
  };

  return `${JSON.stringify(config, null, 2)}\n`;
};
