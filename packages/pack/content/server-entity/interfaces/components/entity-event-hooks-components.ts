import {
  OnDeathComponent,
  OnFriendlyAngerComponent,
  OnHurtByPlayerComponent,
  OnHurtComponent,
  OnIgniteComponent,
  OnStartLandingComponent,
  OnStartTakeoffComponent,
  OnTargetAcquiredComponent,
  OnTargetEscapeComponent,
  OnWakeWithOwnerComponent
} from './event-hooks';

export interface EntityEventHooksComponents {
  onDeath?: OnDeathComponent;
  onFriendlyAnger?: OnFriendlyAngerComponent;
  onHurtByPlayer?: OnHurtByPlayerComponent;
  onHurt?: OnHurtComponent;
  onIgnite?: OnIgniteComponent;
  onStartLanding?: OnStartLandingComponent;
  onStartTakeoff?: OnStartTakeoffComponent;
  onTargetAcquired?: OnTargetAcquiredComponent;
  onTargetEscape?: OnTargetEscapeComponent;
  onWakeWithOwner?: OnWakeWithOwnerComponent;
}
