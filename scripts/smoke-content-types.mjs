// Smoke test on a clean project: packs the three packages, scaffolds a project with `ferolyte init`, adds one file of
// every content type (attachable, render controller, recipe, spawn rule + item, block, entities), then runs
// `ferolyte run --json` and `ferolyte check --types --json`; both must report no errors.
//   npm run smoke:content     (needs the registry for @minecraft/* and typescript)
import { execSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = mkdtempSync(path.join(tmpdir(), 'ferolyte-smoke-'));
const run = (command, cwd) => execSync(command, { cwd, stdio: ['ignore', 'pipe', 'inherit'] }).toString();

const FILES = {
  // Two entities reading each other's generated ids: must build from a clean project in one `check`.
  'packs/BP/entities/ping.se.ts': `import { createServerEntity } from '@ferolyte/pack';
import { EntityEvent } from '@ferolyte/ids';
export default createServerEntity({
  identifier: 'myaddon:ping',
  componentGroups: [{ name: 'myaddon:ping_on', components: { instantDespawn: {} } }],
  events: {
    'myaddon:ping_go': { add: { componentGroups: ['myaddon:ping_on'] } },
    'myaddon:ping_pong': { trigger: EntityEvent.Pong.PongGo },
  },
});
`,
  'packs/BP/entities/pong.se.ts': `import { createServerEntity } from '@ferolyte/pack';
import { EntityEvent } from '@ferolyte/ids';
export default createServerEntity({
  identifier: 'myaddon:pong',
  events: {
    'myaddon:pong_go': { sequence: [] },
    'myaddon:pong_ping': { trigger: EntityEvent.Ping.PingGo },
  },
});
`,
  // Imports an entity id that the scenario below renames: one `run` must write the new id.
  'packs/BP/spawn_rules/pong.spawn.ts': `import { createSpawnRule } from '@ferolyte/pack';
import { EntityId } from '@ferolyte/ids';
export default createSpawnRule({
  identifier: EntityId.Pong,
  populationControl: 'monster',
  conditions: [{ weight: { default: 5 } }],
});
`,
  'packs/BP/items/ruby.item.ts': `import { createItem } from '@ferolyte/pack';
export default createItem({ identifier: 'myaddon:ruby', components: { maxStackSize: 64 } });
`,
  'packs/BP/blocks/ruby_block.block.ts': `import { createBlock } from '@ferolyte/pack';
export default createBlock({ identifier: 'myaddon:ruby_block', components: { friction: 0.6 } });
`,
  'packs/BP/entities/ruby_golem.se.ts': `import { createServerEntity } from '@ferolyte/pack';
export default createServerEntity({ identifier: 'myaddon:ruby_golem', components: { health: { value: 20, max: 20 } } });
`,
  'packs/BP/recipes/ruby_block.recipe.ts': `import { shapedRecipe } from '@ferolyte/pack';
export default shapedRecipe({
  identifier: 'myaddon:ruby_block',
  pattern: ['###', '###', '###'],
  key: { '#': 'myaddon:ruby' },
  result: 'myaddon:ruby_block',
  unlock: 'myaddon:ruby',
});
`,
  'packs/BP/spawn_rules/ruby_golem.spawn.ts': `import { createSpawnRule } from '@ferolyte/pack';
export default createSpawnRule({
  identifier: 'myaddon:ruby_golem',
  populationControl: 'monster',
  conditions: [{ spawnsOnSurface: {}, weight: { default: 10 }, biomeFilter: { test: 'has_biome_tag', value: 'plains' } }],
});
`,
  'packs/RP/render_controllers/golem.rc.ts': `import { createRenderController } from '@ferolyte/pack';
export default createRenderController({
  id: 'controller.render.myaddon.golem',
  geometry: 'Geometry.default',
  materials: [{ '*': 'Material.default' }],
  textures: ['Texture.default'],
});
`,
  'packs/RP/entity/ruby_golem.ce.ts': `import { createClientEntity } from '@ferolyte/pack';
export default createClientEntity({
  identifier: 'myaddon:ruby_golem',
  geometry: 'geometry.myaddon.golem',
  textures: 'textures/entity/golem',
  materials: 'entity_alphatest',
  renderControllers: ['controller.render.myaddon.golem'],
});
`,
  'packs/RP/attachables/ruby_sword.att.ts': `import { createAttachable } from '@ferolyte/pack';
export default createAttachable({
  identifier: 'myaddon:ruby_sword',
  geometry: 'geometry.myaddon.sword',
  textures: 'textures/myaddon/sword',
  materials: 'entity_alphatest',
  renderControllers: ['controller.render.myaddon.golem'],
});
`,
};

try {
  run('npm run build:packages', ROOT);
  run(`npm pack -w @ferolyte/common -w @ferolyte/pack -w @ferolyte/cli --pack-destination "${tmp}"`, ROOT);
  const tarballs = readdirSync(tmp).filter((f) => f.endsWith('.tgz')).map((f) => `"${path.join(tmp, f)}"`).join(' ');

  const boot = path.join(tmp, 'boot');
  mkdirSync(boot);
  run('npm init -y', boot);
  run(`npm i ${tarballs}`, boot);
  run('npx ferolyte init proj myaddon', boot);
  const project = path.join(boot, 'proj');
  // The scaffold depends on the published cli: replace it with the packed one.
  run(`npm i ${tarballs}`, project);

  for (const [file, source] of Object.entries(FILES)) {
    const target = path.join(project, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, source);
  }

  const failures = [];
  // `check` goes first: nothing exists yet (no .ferolyte/types/ids.ts), the ids of both entities must be bootstrapped by it.
  for (const command of ['npx ferolyte check --types --json', 'npx ferolyte run --json']) {
    let output;
    try {
      output = run(command, project);
    } catch (error) {
      output = error.stdout?.toString() ?? '[]';
    }
    const errors = JSON.parse(output || '[]').filter((r) => r.severity === 'error');
    console.log(`${command}: ${errors.length} error(s)`);
    failures.push(...errors);
  }
  // An id of imported content changes: the importer gets the new id in a single `run`.
  const pong = path.join(project, 'packs/BP/entities/pong.se.ts');
  writeFileSync(pong, readFileSync(pong, 'utf8').replace("'myaddon:pong'", "'other:pong'"));
  run('npx ferolyte run --json', project);
  const spawn = JSON.parse(
    readFileSync(path.join(project, 'build/MYADDON_BP/spawn_rules/proj/pong.spawn.json'), 'utf8'),
  );
  if (spawn['minecraft:spawn_rules'].description.identifier !== 'other:pong') {
    failures.push({ message: `importer kept a stale id: ${spawn['minecraft:spawn_rules'].description.identifier}` });
  }

  const ids = readFileSync(path.join(project, '.ferolyte/types/ids.ts'), 'utf8');
  if (!ids.includes("'myaddon:ping_go'") || !ids.includes("'myaddon:pong_go'")) {
    failures.push({ message: 'ids.ts does not contain the events of both entities' });
  }
  if (failures.length > 0) {
    console.error(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  } else {
    console.log('smoke ok: one file of every content type builds and type-checks');
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
