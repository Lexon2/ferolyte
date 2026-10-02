import { readFile } from 'fs/promises';

import type { Plugin } from 'esbuild';

import { parseJsonc } from '../../utils/read-jsonc';

export const jsoncEsbuildPlugin = (): Plugin => ({
  name: 'ferolyte-jsonc',
  setup(build) {
    build.onLoad({ filter: /\.json$/ }, async (args) => {
      const text = await readFile(args.path, 'utf-8');
      const result = parseJsonc(text);

      if (!result.ok) {
        return {
          errors: result.errors.map((error) => ({
            text: error.message,
            location: {
              file: args.path,
              line: error.line,
              column: error.column,
              length: error.length,
              lineText: error.lineText,
            },
          })),
        };
      }

      return { contents: JSON.stringify(result.value), loader: 'json' };
    });
  },
});
