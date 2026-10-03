import { build } from 'esbuild';
import { describe, expect, it } from 'vitest';

import { generateIdsSource } from '../../registry/ids-generator';
import { createEmptyIndex } from '../../registry/project-registry';
import { IDS_EXPORTS, idsPlaceholderPlugin } from './ids-placeholder-plugin';

const evaluate = async (source: string): Promise<any> => {
  const result = await build({
    stdin: { contents: source, resolveDir: process.cwd(), loader: 'ts' },
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node',
    logLevel: 'silent',
    plugins: [idsPlaceholderPlugin()],
  });
  const module = { exports: {} as any };
  new Function('module', 'exports', result.outputFiles[0].text)(module, module.exports);

  return module.exports;
};

describe('@ferolyte/ids placeholder (bootstrap pass)', () => {
  it('evaluates content that reads ids of other content, at any depth', async () => {
    const exports = await evaluate(`
      import { EntityId, EntityEvent, BlockState, RecipeId } from '@ferolyte/ids';
      export const a = { id: EntityId.Zombie, event: EntityEvent.Zombie.Angry, state: BlockState.Ore['ns:level'] };
      export const b = \`\${RecipeId.X}\`;
      export const c = String(EntityEvent.Deep.A.B.C);
    `);

    expect(String(exports.a.id)).toContain('__ferolyte_id_placeholder__:EntityId.Zombie');
    expect(String(exports.a.event)).toContain('EntityEvent.Zombie.Angry');
    expect(exports.b).toContain('RecipeId.X');
    expect(exports.c).toContain('EntityEvent.Deep.A.B.C');
  });

  it('exports every section of the generated ids file', () => {
    const { text } = generateIdsSource(createEmptyIndex());
    const generated = [...text.matchAll(/^export const (\w+) =/gm)].map((m) => m[1]).sort();

    expect([...IDS_EXPORTS].sort()).toEqual(generated);
  });
});
