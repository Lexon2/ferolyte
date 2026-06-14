import { createRequire } from 'node:module';

import { defineCommand } from 'citty';

import { createProject } from '../../scaffold/create-project';
import { installProjectDependencies } from '../../scaffold/utils/install-project-dependencies';

const { version } = createRequire(import.meta.url)('../../../package.json') as {
  version: string;
};

export const initCommand = defineCommand({
  meta: {
    name: 'init',
    description: 'Scaffold a new Artifex project',
  },
  args: {
    projectName: {
      type: 'positional',
      description: 'Project name (used for folder name and display title)',
      required: true,
    },
    alias: {
      type: 'positional',
      description: 'Pack alias for output folders (e.g. cool → COOL_BP)',
      required: true,
    },
    install: {
      type: 'boolean',
      description: 'Run npm install in the new project',
      default: true,
    },
  },
  async run({ args }) {
    const { projectDir, slug } = await createProject({
      projectName: args.projectName,
      alias: args.alias,
      cliVersion: version,
    });

    if (args.install) {
      console.log(`Installing dependencies in ${slug}/...`);
      await installProjectDependencies(projectDir);
    }

    console.log(`Created ${slug}/`);
    console.log(`  cd ${slug}`);

    if (!args.install) {
      console.log('  npm install');
    }

    console.log('  npm run dev');
    console.log('');
    console.log(`Project path: ${projectDir}`);
  },
});
