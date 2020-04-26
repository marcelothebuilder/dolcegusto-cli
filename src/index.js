const { ErrorHandler } = require("./ErrorHandler");
const { logBanner } = require("./Logger");
const { runUserSetup } = require("./Setup");
const { runCouponRegisterLoop } = require("./CouponRegister");

(async () => {
  await logBanner();
  await runUserSetup();
  await runCouponRegisterLoop();
})().catch(ErrorHandler);
