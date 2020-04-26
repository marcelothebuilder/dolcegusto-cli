const inquirer = require('inquirer')
const { isCouponInvalid, InvalidCouponError } = require('./model/Coupon')

const validateNonEmpty = (nullMessage) => (value) => {
  if (value && value.trim().length) {
    return true
  } else {
    return nullMessage
  }
}

const validateCoupon = (coupon) => {
  if (isCouponInvalid(coupon)) {
    return InvalidCouponError
  }
  return true
}

module.exports = {
  askContinue: async () => {
    const questions = [
      {
        name: 'continue',
        type: 'confirm',
        message: 'Continue entering coupons?'
      }
    ]
    return (await inquirer.prompt(questions)).continue
  },
  askCoupon: async () => {
    const questions = [
      {
        name: 'coupon',
        type: 'input',
        message: 'Enter the coupon to register',
        validate: validateCoupon
      }
    ]
    return (await inquirer.prompt(questions)).coupon
  },
  askCredentials: () => {
    const questions = [
      {
        name: 'email',
        type: 'input',
        message: 'Enter your Dolcegusto e-mail address:',
        validate: validateNonEmpty('Please enter your e-mail address.')
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: validateNonEmpty('Please enter your password.')
      }
    ]
    return inquirer.prompt(questions)
  }
}
