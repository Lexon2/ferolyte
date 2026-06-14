import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { entityAiComponentConvertorsFactory } from './components/ai/entity-ai-component-convertors.factory';
import { entityAttributeComponentConvertorsFactory } from './components/attribute/entity-attribute-component-convertors.factory';
import { entityCombatComponentConvertorsFactory } from './components/combat/entity-combat-component-convertors.factory';
import { entityControlComponentConvertorsFactory } from './components/control/entity-control-component-convertors.factory';
import { entityEventHooksComponentConvertorsFactory } from './components/event-hooks/entity-event-hooks-component-convertors.factory';
import { entityInteractionComponentConvertorsFactory } from './components/interaction/entity-interaction-component-convertors.factory';
import { entityMiscellaneousComponentConvertorsFactory } from './components/miscellaneous/entity-miscellaneous-component-convertors.factory';
import { entityNavigationComponentConvertorsFactory } from './components/navigation-movement/entity-navigation-component-convertors.factory';
import { entityPhysicalComponentConvertorsFactory } from './components/physical/entity-physical-component-convertors.factory';
import { entitySensorComponentConvertorsFactory } from './components/sensors/entity-sensor-component-convertors.factory';
import { entityStateComponentConvertorsFactory } from './components/states/entity-state-component-convertors.factory';
import { entityTimerComponentConvertorsFactory } from './components/timers-and-schedulers/entity-timer-component-convertors.factory';
import { entityTradeComponentConvertorsFactory } from './components/trade/entity-trade-component-convertors.factory';
import { entityTransformationComponentConvertorsFactory } from './components/transformation-and-variants/entity-transformation-component-convertors.factory';

export type EntityComponentConvertor = (
  value?: unknown,
  ctx?: ContentDiagnosticContext,
) => Record<string, unknown> | undefined;

export const entityComponentConvertorsFactory: Record<
  string,
  EntityComponentConvertor
> = {
  ...entityAiComponentConvertorsFactory,
  ...entityAttributeComponentConvertorsFactory,
  ...entityCombatComponentConvertorsFactory,
  ...entityControlComponentConvertorsFactory,
  ...entityEventHooksComponentConvertorsFactory,
  ...entityInteractionComponentConvertorsFactory,
  ...entityMiscellaneousComponentConvertorsFactory,
  ...entityNavigationComponentConvertorsFactory,
  ...entityPhysicalComponentConvertorsFactory,
  ...entitySensorComponentConvertorsFactory,
  ...entityStateComponentConvertorsFactory,
  ...entityTimerComponentConvertorsFactory,
  ...entityTradeComponentConvertorsFactory,
  ...entityTransformationComponentConvertorsFactory,
};
