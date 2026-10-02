import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { DocumentConfigs } from '../documents/convert-document';
import { DocumentBuilder } from '../documents/document-builder';
import type { SpawnRuleConfig } from './spawn-rule-types';

const IDENTIFIER = /^[a-z0-9_.-]+:[a-z0-9_./-]+$/;

/** Spawn rule with SDK sugar: flat config, structural checks; conditions come from the generated schema. */
export class SpawnRuleBuilder extends DocumentBuilder<'spawnRule'> {
  constructor(private readonly flat: SpawnRuleConfig) {
    super('spawnRule', {
      ...(flat.version !== undefined ? { formatVersion: flat.version } : {}),
      spawnRules: {
        description: {
          identifier: flat.identifier,
          populationControl: flat.populationControl,
        },
        conditions: flat.conditions,
      },
    } as Partial<DocumentConfigs['spawnRule']>);
  }

  public override build(): Record<string, unknown> {
    this.check();

    return super.build();
  }

  private error(fieldPath: string, message: string) {
    const ctx: ContentDiagnosticContext | undefined = this.buildContext && {
      ...this.buildContext,
      identifier: this.flat.identifier,
      fieldPath,
    };
    logContentError(ctx, message);
  }

  private check() {
    const { identifier, conditions } = this.flat;
    if (!IDENTIFIER.test(identifier ?? '')) {
      this.error(
        'identifier',
        `Spawn rule identifier must be the entity id "namespace:name", got "${String(identifier)}"`,
      );
    }
    if (!Array.isArray(conditions) || conditions.length === 0) {
      this.error('conditions', 'A spawn rule needs at least one condition');

      return;
    }
    conditions.forEach((condition, index) => {
      const at = `conditions[${index}]`;
      const range = (name: string, value: unknown, min = 'min', max = 'max') => {
        const bounds = value as Record<string, unknown> | undefined;
        if (
          typeof bounds?.[min] === 'number' &&
          typeof bounds?.[max] === 'number' &&
          (bounds[min] as number) > (bounds[max] as number)
        ) {
          this.error(`${at}.${name}`, `${min} (${String(bounds[min])}) is greater than ${max} (${String(bounds[max])})`);
        }
      };
      const herds = Array.isArray(condition.herd) ? condition.herd : [condition.herd];
      herds.forEach((herd) => range('herd', herd, 'minSize', 'maxSize'));
      range('brightnessFilter', condition.brightnessFilter);
      range('heightFilter', condition.heightFilter);
      range('distanceFilter', condition.distanceFilter);
    });
  }
}
