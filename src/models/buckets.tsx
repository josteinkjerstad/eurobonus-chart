export enum PointBuckets {
  Low = "0 - 99.999",
  Medium = "100.000 - 499.999",
  High = "500.0000 - 999.999",
  VeryHigh = "1.000.000 - 1.999.999",
  UltraHigh = "2.000.000 - 4.999.999",
  Elite = "5.000.000+",
}

export const PointBucketRanges: Record<PointBuckets, [number, number | null]> = {
  [PointBuckets.Low]: [0, 99999],
  [PointBuckets.Medium]: [100000, 499999],
  [PointBuckets.High]: [500000, 999999],
  [PointBuckets.VeryHigh]: [1000000, 1999999],
  [PointBuckets.UltraHigh]: [2000000, 4999999],
  [PointBuckets.Elite]: [5000000, null],
};
