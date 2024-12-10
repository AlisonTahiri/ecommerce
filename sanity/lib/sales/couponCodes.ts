export const COUPON_CODES = {
  BFRIDAY: "BFRIDAY",
  XMAS2022: "XMAS2022",
  NY2022: "NY2022",
} as const;

export type CouponCode = keyof typeof COUPON_CODES;