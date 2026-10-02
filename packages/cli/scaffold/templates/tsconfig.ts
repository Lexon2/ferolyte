export interface TsconfigTemplateInput {
  pathAlias: string;
}

const SHARED_COMPILER_OPTIONS = {
  module: 'ESNext',
  target: 'es2020',
  lib: ['es2020', 'dom'],
  moduleResolution: 'bundler',
  rootDir: '.',
  declaration: false,
  noEmit: true,
  noEmitHelpers: true,
  sourceMap: false,
  pretty: true,
  forceConsistentCasingInFileNames: true,
  strict: true,
  skipLibCheck: true,
  resolveJsonModule: true,
  allowSyntheticDefaultImports: true,
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
};

export const createTsconfigTemplate = ({
  pathAlias,
}: TsconfigTemplateInput): string => {
  const config = {
    compilerOptions: {
      ...SHARED_COMPILER_OPTIONS,
      paths: {
        [`${pathAlias}/*`]: ['./packs/*'],
        '@ferolyte/ids': ['./.ferolyte/types/ids.ts'],
      },
    },
    include: ['packs/**/*', 'ferolyte.config.mts', '.ferolyte/types/**/*'],
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
        [`${pathAlias}/*`]: ['./packs/*'],
        '@ferolyte/ids': ['./.ferolyte/types/ids.ts'],
      },
    },
    include: ['packs/scripts/**/*'],
    exclude: ['node_modules'],
    compileOnSave: false,
  };

  return `${JSON.stringify(config, null, 2)}\n`;
};
