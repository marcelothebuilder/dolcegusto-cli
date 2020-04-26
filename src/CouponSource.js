const { Argv } = require('./Argv')
const { AppError } = require('./AppError')
const { askCoupon, askContinue } = require('./Prompts')
const { isCouponInvalid, InvalidCouponError } = require('./model/Coupon')

const getCouponSource = async function * () {
  if (Argv.coupon) {
    const coupons = String(Argv.coupon).split(/\s*,\s*/);

    coupons.forEach((c) => {
      if (isCouponInvalid(c)) {
        throw new AppError(`${InvalidCouponError} (${c})`)
      }
    })

    for (const coupon of coupons) { yield coupon }
  } else {
    do {
      yield await askCoupon()
    } while (await askContinue())
  }
}

module.exports = { getCouponSource }
