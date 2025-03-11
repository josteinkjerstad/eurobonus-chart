export {};

declare global {
  interface String {
    includesAny(values: string[]): boolean;
  }
}

String.prototype.includesAny = function (values: string[]): boolean {
  return values.some(value => this.includes(value));
};
