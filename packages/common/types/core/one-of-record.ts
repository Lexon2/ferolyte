export type OneOfRecord<T extends string, V> = {
  [K in T]: { [P in K]: V };
}[T];
