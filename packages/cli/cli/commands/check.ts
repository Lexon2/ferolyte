import { defineCommand } from 'citty';

import {
  collectDiagnostics,
  formatDiagnostic,
} from '../../compiler/check/diagnostics-collector';
import { CHECK_EXIT, checkProject } from '../../compiler/check/check-project';
import { setStrictReferences } from '../../compiler/registry/project-registry';
import { profileArg, strictFlag } from '../shared/compiler-args';

export const checkCommand = defineCommand({
  meta: {
    name: 'check',
    description:
      'Validate all content files without writing output (exit 1 on errors)',
  },
  args: {
    profile: profileArg,
    strict: strictFlag,
    types: {
      type: 'boolean',
      description:
        'Also run the project TypeScript (tsc --noEmit) and report its errors as contentType "typescript"',
      default: false,
    },
    json: {
      type: 'boolean',
      description:
        'Print diagnostics as JSON: { file, contentType, component, fieldPath, message, severity }[]',
      default: false,
    },
  },
  async run({ args }) {
    setStrictReferences(args.strict === true);
    const collector = collectDiagnostics({ silent: true });
    // stdout carries only the report; build logs go to stderr
    console.log = console.error;
    const result = await checkProject(args.profile, { types: args.types });
    collector.stop();

    if (result.configError !== undefined) {
      console.error(result.configError);
      process.exit(CHECK_EXIT.USAGE);
    }

    const { records } = collector;
    if (args.json) {
      process.stdout.write(`${JSON.stringify(records, null, 2)}\n`);
    } else {
      for (const record of records) {
        console.error(formatDiagnostic(record));
      }
      console.error(
        `Checked ${result.files} file(s): ${collector.errorCount()} error(s), ${records.length - collector.errorCount()} warning(s)`,
      );
    }

    process.exit(
      collector.errorCount() > 0 ? CHECK_EXIT.ERRORS : CHECK_EXIT.OK,
    );
  },
});
