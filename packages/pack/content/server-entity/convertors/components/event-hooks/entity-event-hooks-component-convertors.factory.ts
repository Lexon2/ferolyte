import { convertOnDeathComponent } from './on-death-component.convertor';
import { convertOnFriendlyAngerComponent } from './on-friendly-anger-component.convertor';
import { convertOnHurtByPlayerComponent } from './on-hurt-by-player-component.convertor';
import { convertOnHurtComponent } from './on-hurt-component.convertor';
import { convertOnIgniteComponent } from './on-ignite-component.convertor';
import { convertOnStartLandingComponent } from './on-start-landing-component.convertor';
import { convertOnStartTakeoffComponent } from './on-start-takeoff-component.convertor';
import { convertOnTargetAcquiredComponent } from './on-target-acquired-component.convertor';
import { convertOnTargetEscapeComponent } from './on-target-escape-component.convertor';
import { convertOnWakeWithOwnerComponent } from './on-wake-with-owner-component.convertor';

export const entityEventHooksComponentConvertorsFactory = {
  onDeath: convertOnDeathComponent,
  onFriendlyAnger: convertOnFriendlyAngerComponent,
  onHurtByPlayer: convertOnHurtByPlayerComponent,
  onHurt: convertOnHurtComponent,
  onIgnite: convertOnIgniteComponent,
  onStartLanding: convertOnStartLandingComponent,
  onStartTakeoff: convertOnStartTakeoffComponent,
  onTargetAcquired: convertOnTargetAcquiredComponent,
  onTargetEscape: convertOnTargetEscapeComponent,
  onWakeWithOwner: convertOnWakeWithOwnerComponent
};
