export enum PointBuckets {
  Low = "0 - 99.999",
  MediumLow = "100.000 - 499.999",
  Medium = "500.0000 - 999.999",
  MediumHigh = "1.000.000 - 1.999.999",
  High = "2.000.000 - 2.999.999",
  SuperHigh = "3.000.000 - 3.999.999",
  UltraHigh = "4.000.000 - 4.999.999",
  Elite = "5.000.000+",
}

export const PointBucketRanges: Record<PointBuckets, [number, number | null]> = {
  [PointBuckets.Low]: [0, 99999],
  [PointBuckets.MediumLow]: [100000, 499999],
  [PointBuckets.Medium]: [500000, 999999],
  [PointBuckets.MediumHigh]: [1000000, 1999999],
  [PointBuckets.High]: [2000000, 2999999],
  [PointBuckets.SuperHigh]: [3000000, 3999999],
  [PointBuckets.UltraHigh]: [4000000, 4999999],
  [PointBuckets.Elite]: [5000000, null],
};
