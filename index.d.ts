declare module "random-numbers-with-exclusions" {
  interface RandomNumbersOptions {
    exclude?: number | number[] | { start: number; end: number };
  }

  function randomNumbers(
    min: number,
    max?: number,
    options?: RandomNumbersOptions
  ): number | null;

  export = randomNumbers;
}
