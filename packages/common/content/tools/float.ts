export class Float {
  constructor(
    public value: number,
    public digits: number = 1,
  ) {}
  toJSON() {
    return `$ferolyte_float[${this.value.toFixed(this.digits)}]`;
  }
}
