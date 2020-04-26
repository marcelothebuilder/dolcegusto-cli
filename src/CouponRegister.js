const { DolceGustoApi } = require("./DolceGustoApi");
const { getCouponSource } = require("./CouponSource");
const { getCredentials } = require("./Credentials");

const runCouponRegisterLoop = async () => {
  const couponSource = getCouponSource();
  
  for await (const coupon of couponSource) {
    await new DolceGustoApi(getCredentials()).postCoupon({
      coupon: coupon,
    });
  }
};

module.exports = { runCouponRegisterLoop };
