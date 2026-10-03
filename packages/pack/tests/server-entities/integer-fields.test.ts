import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';
import { ServerEntityBuilder } from '@ferolyte/pack/content/server-entity/server-entity-builder';

import { minimalServerEntityConfig } from './helpers/fixtures';

const here = path.dirname(fileURLToPath(import.meta.url));

describe('integer-only schema fields', () => {
  it('are documented with @integer in the generated types', () => {
    const behaviors = readFileSync(
      path.join(here, '../../content/generated/entity/behaviors.ts'),
      'utf8',
    );
    const roar = behaviors.slice(behaviors.indexOf('export interface KnockbackRoarBehavior'));
    const field = roar.slice(0, roar.indexOf('knockbackHorizontalStrength?:'));

    expect(field.slice(field.lastIndexOf('/**'))).toContain('@integer');
  });

  it('are rejected with an integer-specific message', () => {
    const collector = collectDiagnostics({ silent: true });
    new ServerEntityBuilder(
      minimalServerEntityConfig({
        components: {
          behaviors: { knockbackRoar: { priority: 1, knockbackHorizontalStrength: 4.5 } },
        },
      }),
    )
      .withBuildContext({ diagnostics: true, contentType: 'server-entity' })
      .build();
    collector.stop();

    expect(
      collector.records
        .filter((r) => r.severity === 'error')
        .map((r) => `${r.fieldPath}: ${r.message}`),
    ).toEqual([
      expect.stringContaining('knockbackHorizontalStrength: Must be an integer'),
    ]);
  });
});
