const isPlainObject = (value: object): boolean => {
  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
};

/**
 * Deep copy of a content config: plain objects and arrays are copied, everything else is kept by reference.
 * Unlike `structuredClone` it accepts Molang builders (`q.isMoving` is a callable object, `molang` templates and
 * `v('x')` are class instances), which are immutable and safe to share; other class instances and functions are shared too.
 */
export const cloneConfig = <T>(value: T): T => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(cloneConfig) as T;
  }
  if (!isPlainObject(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, cloneConfig(child)]),
  ) as T;
};
