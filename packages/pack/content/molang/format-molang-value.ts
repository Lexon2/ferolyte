export interface MolangBuilder {
  build(): string;
}

export type MolangValue = number | string | MolangBuilder;

export type MolangBuilderCallback<T extends MolangBuilder = MolangBuilder> = (
  builder: T,
) => void;

export const formatMolangValue = (value: MolangValue): string => {
  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return value.build();
};

export const appendMolangValue = <T extends MolangBuilder>(
  append: (fragment: string) => void,
  value: MolangValue | MolangBuilderCallback<T>,
  createBuilder: () => T,
): void => {
  if (typeof value === 'function') {
    const nested = createBuilder();
    value(nested);
    append(nested.build());
    return;
  }

  append(formatMolangValue(value));
};
