export interface ArtifexConfigTemplateInput {
  alias: string;
  namespace: string;
}

export const createArtifexConfigTemplate = ({
  alias,
  namespace,
}: ArtifexConfigTemplateInput): string => `import { defineArtifexConfig } from '@artifex/cli/compiler/config/define-config';

export default defineArtifexConfig({
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
