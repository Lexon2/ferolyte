export interface CartesianInput extends Record<string, unknown[]> {}

export type CartesianProduct<T extends CartesianInput> = {
  [K in keyof T]: T[K][number];
};

export const cartesianMerge = <T extends CartesianInput>(
  options: T,
): CartesianProduct<T>[] => {
  const keys = Object.keys(options) as (keyof T)[];
  if (keys.length === 0) return [];

  const values = keys.map((key) =>
    Array.isArray(options[key]) && options[key].length > 0
      ? options[key]
      : [null],
  );

  const routes: CartesianProduct<T>[] = [];
  const stack: { index: number; current: Partial<CartesianProduct<T>> }[] = [
    { index: 0, current: {} },
  ];

  while (stack.length > 0) {
    const { index, current } = stack.pop()!;

    if (index === keys.length) {
      const filtered = Object.fromEntries(
        Object.entries(current).filter(([, v]) => v !== null),
      ) as CartesianProduct<T>;
      if (Object.keys(filtered).length > 0) {
        routes.push(filtered);
      }
      continue;
    }

    const key = keys[index];
    for (const val of values[index]) {
      stack.push({
        index: index + 1,
        current: { ...current, [key]: val },
      });
    }
  }

  return routes;
};
