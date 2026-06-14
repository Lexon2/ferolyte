import {
  ColorComponent,
  Color2Component,
  MarkVariantComponent,
  SkinIdComponent,
  TransformationComponent,
  TypeFamilyComponent,
  VariantComponent
} from './transformation-and-variants';

export interface EntityTransformationComponents {
  color?: ColorComponent;
  color2?: Color2Component;
  markVariant?: MarkVariantComponent;
  skinId?: SkinIdComponent;
  transformation?: TransformationComponent;
  typeFamily?: TypeFamilyComponent;
  variant?: VariantComponent;
}
