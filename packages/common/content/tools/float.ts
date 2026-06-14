export class Float {
  constructor(
    public value: number,
    public digits: number = 1,
  ) {}
  toJSON() {
    return `$artifex_float[${this.value.toFixed(this.digits)}]`;
  }
}
