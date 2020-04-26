const { ErrorHandler } = require('./ErrorHandler')
const { logBanner } = require('./Logger')
const { runUserSetup } = require('./Setup')
const { runCouponRegisterLoop } = require('./CouponRegister')

const Run = async () => {
  try {
    await logBanner()
    await runUserSetup()
    await runCouponRegisterLoop()
  } catch (e) {
    ErrorHandler(e)
  }
}

module.exports = { Run }
