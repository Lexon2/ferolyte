import { Float } from '@ferolyte/common/content/tools/float';
import {
  EntityBooleanProperty,
  EntityFloatProperty,
  EntityProperties,
  EntityIntProperty,
  EntityEnumProperty,
} from '../interfaces/entity-properties';
import {
  validateBoolean,
  validateInteger,
  validateNumber,
  validateString,
  validateStringArray,
  validateVector2,
} from './common/validation';

const convertPropertyBase = (
  property:
    | EntityIntProperty
    | EntityFloatProperty
    | EntityEnumProperty
    | EntityBooleanProperty,
): any | undefined => {
  const result: any = {};

  if (property.clientSync) {
    if (!validateBoolean(property.clientSync, 'clientSync')) {
      return undefined;
    }
    result.client_sync = property.clientSync;
  }

  return result;
};

export const convertIntProperty = (
  property: EntityIntProperty,
): any | undefined => {
  const result: any = convertPropertyBase(property);

  if (result === undefined) {
    return undefined;
  }

  result.type = 'int';

  if (property.range) {
    if (!validateVector2(property.range, 'range')) {
      return undefined;
    }
    result.range = property.range;
  }

  if (property.default !== undefined) {
    if (
      !validateInteger(property.default, 'default') ||
      property.range?.[0] > property.default ||
      property.range?.[1] < property.default
    ) {
      return undefined;
    }
    result.default = property.default;
  }

  return result;
};

export const convertFloatProperty = (
  property: EntityFloatProperty,
): any | undefined => {
  const result: any = convertPropertyBase(property);

  if (result === undefined) {
    return undefined;
  }

  result.type = 'float';

  if (property.range) {
    if (!validateVector2(property.range, 'range')) {
      return undefined;
    }
    result.range = [new Float(property.range[0]), new Float(property.range[1])];
  }

  if (property.default !== undefined) {
    if (
      !validateNumber(property.default, 'default') ||
      property.range?.[0] > property.default ||
      property.range?.[1] < property.default
    ) {
      return undefined;
    }
    result.default = new Float(property.default);
  }

  return result;
};

export const convertEnumProperty = (
  property: EntityEnumProperty,
): any | undefined => {
  const result: any = convertPropertyBase(property);

  if (result === undefined) {
    return undefined;
  }

  result.type = 'enum';

  if (property.values) {
    if (!validateStringArray(property.values, 'values')) {
      return undefined;
    }
    result.values = property.values;
  }

  if (property.default !== undefined) {
    if (
      !validateString(property.default, 'default') ||
      !property.values.includes(property.default)
    ) {
      return undefined;
    }
    result.default = property.default;
  }

  return result;
};

export const convertBooleanProperty = (
  property: EntityBooleanProperty,
): any | undefined => {
  const result: any = convertPropertyBase(property);

  if (result === undefined) {
    return undefined;
  }

  if (property.default !== undefined) {
    if (!validateBoolean(property.default, 'default')) {
      return undefined;
    }
    result.default = property.default;
  }

  result.type = 'bool';

  return result;
};

/**
 * Converts the entity properties to the Minecraft format
 * @param properties - The properties to convert
 * @returns The converted properties
 */
export const convertEntityProperties = (properties: EntityProperties) => {
  const result: any = {};

  for (const property in properties) {
    const propertyData = properties[property];
    if (propertyData.type === 'int') {
      const convertedProperty = convertIntProperty(propertyData);
      if (convertedProperty === undefined) {
        console.error(`Error converting int property ${property}`);

        continue;
      }
      result[property] = convertedProperty;
    } else if (propertyData.type === 'float') {
      const convertedProperty = convertFloatProperty(propertyData);
      if (convertedProperty === undefined) {
        console.error(`Error converting float property ${property}`);

        continue;
      }
      result[property] = convertedProperty;
    } else if (propertyData.type === 'enum') {
      const convertedProperty = convertEnumProperty(propertyData);
      if (convertedProperty === undefined) {
        console.error(`Error converting enum property ${property}`);

        continue;
      }
      result[property] = convertedProperty;
    } else if (
      propertyData.type === 'boolean' ||
      propertyData.type === 'bool'
    ) {
      const convertedProperty = convertBooleanProperty(propertyData);
      if (convertedProperty === undefined) {
        console.error(`Error converting boolean property ${property}`);

        continue;
      }
      result[property] = convertedProperty;
    }
  }

  return result;
};
