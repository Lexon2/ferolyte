import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { BodyRotationAlwaysFollowsHeadComponent } from '../../../interfaces/components/navigation-movement';
import { convertStateObject } from '../../common/state-object';

export const convertBodyRotationAlwaysFollowsHeadComponent = (
  component: Partial<BodyRotationAlwaysFollowsHeadComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:body_rotation_always_follows_head'?: any } | undefined => {
  const result = convertStateObject(component);
  if (!result) {
    return undefined;
  }

  return {
    'minecraft:body_rotation_always_follows_head': result,
  };
};
