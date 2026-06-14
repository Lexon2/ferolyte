export const snakeToCamel = (snake: string): string =>
  snake.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());

export const camelToSnake = (camel: string): string =>
  camel.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
