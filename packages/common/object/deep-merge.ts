export const deepMerge = (target: any, source: any): any => {
  if (typeof source !== 'object' || source === null) {
    return source;
  }

  // If both are arrays, concatenate them
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  }

  const result: any = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source)) {
    if (key in target) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
};
