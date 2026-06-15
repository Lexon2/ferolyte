export interface FerolyteConfigTemplateInput {
  alias: string;
  namespace: string;
}

export const createFerolyteConfigTemplate = ({
  alias,
  namespace,
}: FerolyteConfigTemplateInput): string => `import { defineFerolyteConfig } from '@ferolyte/cli/compiler/config/define-config';

export default defineFerolyteConfig({
  profiles: {
    default: {
      packs: {
        alias: '${alias}',
        namespace: '${namespace}',
        output: 'build',
        archive: false,
      },
    },
    development: {
      packs: {
        alias: '${alias}',
        namespace: '${namespace}',
        output: 'minecraft-dev',
      },
      scripts: {
        entry: 'packs/scripts/main.ts',
      },
    },
  },
});
`;
