import { EntityAIComponents } from './components/entity-ai-components';
import { EntityAttributeComponents } from './components/entity-attribute-components';
import { EntityCombatComponents } from './components/entity-combat-components';
import { EntityControlComponents } from './components/entity-control-components';
import { EntityEventHooksComponents } from './components/entity-event-hooks-components';
import { EntityInteractionComponents } from './components/entity-interaction-components';
import { EntityMiscellaneousComponents } from './components/entity-miscellaneous-components';
import { EntityNavigationComponents } from './components/entity-navigation-components';
import { EntityPhysicalComponents } from './components/entity-physical-components';
import { EntitySensorComponents } from './components/entity-sensor-components';
import { EntityStateComponents } from './components/entity-state-components';
import { EntityTimerComponents } from './components/entity-timer-components';
import { EntityTradeComponents } from './components/entity-trade-components';
import { EntityTransformationComponents } from './components/entity-transformation-components';
import { EntityBehaviors } from './entity-behaviors';

export interface EntityBehaviorsComponents {
  behaviors?: Partial<EntityBehaviors>;
}

export interface EntityComponents
  extends EntityAIComponents,
    EntityAttributeComponents,
    EntityCombatComponents,
    EntityControlComponents,
    EntityEventHooksComponents,
    EntityInteractionComponents,
    EntityMiscellaneousComponents,
    EntityNavigationComponents,
    EntityPhysicalComponents,
    EntitySensorComponents,
    EntityStateComponents,
    EntityTimerComponents,
    EntityTradeComponents,
    EntityTransformationComponents,
    EntityBehaviorsComponents {}
