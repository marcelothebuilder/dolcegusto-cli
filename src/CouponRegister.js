const { DolceGustoApi } = require("./DolceGustoApi");
const { askCoupon, askContinue } = require("./Prompts");
const { getCredentials } = require("./Credentials");

const runCouponRegisterLoop = async () => {
  do {
    await new DolceGustoApi(getCredentials()).postCoupon({
      coupon: await askCoupon(),
    });
  } while (await askContinue());
};

module.exports = { runCouponRegisterLoop };
