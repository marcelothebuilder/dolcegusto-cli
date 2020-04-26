const { Argv } = require("./Argv");
const { askCoupon, askContinue } = require("./Prompts");
const { isCouponInvalid, InvalidCouponError } = require("./model/Coupon");

const getCouponSource = async function* () {
  if (Argv.coupon) {

    const coupons = Argv.coupon.split(/\s*,\s*/);

    coupons.forEach((c) => {
        if (isCouponInvalid(c)) {
            throw Error(`${InvalidCouponError} (${c})`);
        }
    });

    for (const coupon of coupons)
        yield coupon;

  } else {
    do {
      yield await askCoupon();
    } while (await askContinue());
  }
};

module.exports = { getCouponSource };