export class MolangExpression {
  private buffer = '';

  append(fragment: string): this {
    this.buffer += fragment;
    return this;
  }

  build(): string {
    return this.buffer;
  }

  toString(): string {
    return this.buffer;
  }

  isEmpty(): boolean {
    return this.buffer.length === 0;
  }
}
