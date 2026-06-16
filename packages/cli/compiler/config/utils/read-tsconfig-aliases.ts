import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseJsonc } from 'jsonc-parser';

const stripWildcard = (value: string) => value.replace(/\/\*$/, '');

export const readTsconfigAliases = async (
  cwd: string = process.cwd(),
): Promise<Record<string, string>> => {
  const configPath = join(cwd, 'tsconfig.json');

  if (!existsSync(configPath)) {
    return {};
  }

  const content = await readFile(configPath, 'utf8');
  const parsed = parseJsonc(content) as {
    compilerOptions?: { paths?: Record<string, string[]> };
  };
  const paths = parsed.compilerOptions?.paths;

  if (!paths) {
    return {};
  }

  const aliases: Record<string, string> = {};

  for (const [key, values] of Object.entries(paths)) {
    const target = values?.[0];

    if (!target) {
      continue;
    }

    aliases[stripWildcard(key)] = resolve(cwd, stripWildcard(target));
  }

  return aliases;
};
