import { convertColorComponent } from './color-component.convertor';
import { convertColor2Component } from './color2-component.convertor';
import { convertMarkVariantComponent } from './mark-variant-component.convertor';
import { convertSkinIdComponent } from './skin-id-component.convertor';
import { convertTransformationComponent } from './transformation-component.convertor';
import { convertTypeFamilyComponent } from './type-family-component.convertor';
import { convertVariantComponent } from './variant-component.convertor';

export const entityTransformationComponentConvertorsFactory = {
  color: convertColorComponent,
  color2: convertColor2Component,
  markVariant: convertMarkVariantComponent,
  skinId: convertSkinIdComponent,
  transformation: convertTransformationComponent,
  typeFamily: convertTypeFamilyComponent,
  variant: convertVariantComponent
};
