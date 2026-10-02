import { writeFile } from 'node:fs/promises';

import { defineCommand } from 'citty';

import {
  INSPECT_EXIT,
  inspectWithProfile,
} from '../../compiler/inspect/inspect-file';

export const inspectCommand = defineCommand({
  meta: {
    name: 'inspect',
    description:
      'Compile one content file and print the resulting JSON (no files are written)',
  },
  args: {
    file: {
      type: 'positional',
      description: 'Content file (e.g. cow.ce.ts)',
      required: true,
    },
    profile: {
      type: 'string',
      description: 'Config profile name from ferolyte.config.mts',
      default: 'default',
    },
    out: {
      type: 'string',
      description: 'Write the JSON to this file instead of stdout',
    },
    compact: {
      type: 'boolean',
      description: 'Print minified JSON',
      default: false,
    },
    diagnostics: {
      type: 'boolean',
      description: 'Print content validation diagnostics to stderr',
      default: false,
    },
  },
  async run({ args }) {
    // stdout carries only the JSON; everything else goes to stderr.
    console.log = console.error;
    console.info = console.error;

    const result = await inspectWithProfile(args.file, args.profile, {
      diagnostics: args.diagnostics,
    });

    if (!result.ok) {
      process.stderr.write(`${result.message}\n`);
      process.exit(result.code);
    }

    const text = JSON.stringify(result.json, null, args.compact ? undefined : 2);
    if (args.out) {
      await writeFile(args.out, `${text}\n`, 'utf-8');
    } else {
      process.stdout.write(`${text}\n`);
    }

    process.exit(INSPECT_EXIT.OK);
  },
});
