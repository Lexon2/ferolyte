import { readdir, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dirArgIndex = args.indexOf('--dir');
const targetDir =
  dirArgIndex !== -1 && args[dirArgIndex + 1]
    ? join(rootDir, args[dirArgIndex + 1])
    : null;

if (!targetDir) {
  console.error('Usage: node generate-barrel.mjs --dir <relative-path> [--dry-run]');
  process.exit(1);
}

async function collectTsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    if (
      !entry.name.endsWith('.ts') ||
      entry.name.endsWith('.d.ts') ||
      entry.name.endsWith('.test.ts') ||
      entry.name === 'index.ts'
    ) {
      continue;
    }

    files.push(entry.name.replace(/\.ts$/, ''));
  }

  return files.sort();
}

const files = await collectTsFiles(targetDir);
const lines = files.map((file) => `export * from './${file}';`);
const content = `${lines.join('\n\n')}\n`;

if (dryRun) {
  console.log(content);
  console.log(`// ${files.length} exports`);
} else {
  await writeFile(join(targetDir, 'index.ts'), content, 'utf8');
  console.log(`Wrote ${join(targetDir, 'index.ts')} (${files.length} exports)`);
}
