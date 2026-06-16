import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { afterEach, describe, expect, it } from 'vitest';

import { importFerolyteConfig } from './import-config';
import { readTsconfigAliases } from './read-tsconfig-aliases';

const tempDirs: string[] = [];

const createTempProject = async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ferolyte-config-test-'));
  tempDirs.push(dir);

  await mkdir(join(dir, 'src', 'common'), { recursive: true });

  await writeFile(
    join(dir, 'src', 'common', 'constants.ts'),
    `export const ADDON_NAMESPACE = 'test:ns';\n`,
  );

  return dir;
};

afterEach(async () => {
  const { rm } = await import('node:fs/promises');

  for (const dir of tempDirs.splice(0)) {
    await rm(dir, { recursive: true, force: true });
  }
});

describe('importFerolyteConfig', () => {
  it('loads config with extensionless relative imports', async () => {
    const dir = await createTempProject();

    await writeFile(
      join(dir, 'ferolyte.config.mts'),
      `import { ADDON_NAMESPACE } from './src/common/constants';

export default {
  profiles: {
    default: {
      packs: {
        alias: 't',
        namespace: ADDON_NAMESPACE,
      },
    },
  },
};
`,
    );

    const config = await importFerolyteConfig(join(dir, 'ferolyte.config.mts'));

    expect(config?.profiles?.default?.packs?.namespace).toBe('test:ns');
  });

  it('loads config with tsconfig path aliases', async () => {
    const dir = await createTempProject();

    await writeFile(
      join(dir, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@test-common/*': ['src/common/*'],
            },
          },
        },
        null,
        2,
      ),
    );

    await writeFile(
      join(dir, 'ferolyte.config.mts'),
      `import { ADDON_NAMESPACE } from '@test-common/constants';

export default {
  profiles: {
    default: {
      packs: {
        alias: 't',
        namespace: ADDON_NAMESPACE,
      },
    },
  },
};
`,
    );

    const config = await importFerolyteConfig(join(dir, 'ferolyte.config.mts'));

    expect(config?.profiles?.default?.packs?.namespace).toBe('test:ns');
  });
});

describe('readTsconfigAliases', () => {
  it('maps tsconfig paths to esbuild aliases', async () => {
    const dir = await createTempProject();

    await writeFile(
      join(dir, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@test/*': ['src/common/*'],
            },
          },
        },
        null,
        2,
      ),
    );

    const aliases = await readTsconfigAliases(dir);

    expect(aliases['@test']).toBe(join(dir, 'src', 'common'));
  });
});
