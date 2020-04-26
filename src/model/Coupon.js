const ValidCouponSize = 12;
const ValidCouponRegex = new RegExp(`^[A-Za-z1-9]{${ValidCouponSize}}$`);
const InvalidCouponError = `Coupon must be a ${ValidCouponSize} alphanumeric string.`;

const isCouponInvalid = (c) => !ValidCouponRegex.test(c);

module.exports = {
  ValidCouponSize,
  InvalidCouponError,
  isCouponInvalid
};
