interface BaseEntityProperty<T, D> {
  type: T;
  default: D;
  clientSync?: boolean;
}

export interface EntityIntProperty extends BaseEntityProperty<'int', number> {
  range: [number, number];
}

export interface EntityFloatProperty
  extends BaseEntityProperty<'float', number> {
  range: [number, number];
}

export interface EntityEnumProperty extends BaseEntityProperty<'enum', string> {
  values: string[];
}

export interface EntityBooleanProperty
  extends BaseEntityProperty<'boolean' | 'bool', boolean> {}

/**
 * Represents the properties of an entity.
 * @interface EntityProperties
 */
export interface EntityProperties {
  [key: string]:
    | EntityIntProperty
    | EntityFloatProperty
    | EntityEnumProperty
    | EntityBooleanProperty;
}
