const { DolceGustoApiError } = require('./DolceGustoApi')
const { error, errorTitle } = require('./Logger')

const ErrorHandler = (err) => {
  if (err instanceof DolceGustoApiError) {
    errorTitle(err.message);
    (err.messages || []).forEach((message) => {
      error(`\t${message}`)
    })
    if (err.step === DolceGustoApiError.Step.LOGIN) {
      error('You can reset the saved credentials by passing --clearConfig')
    }
  } else {
    error('Unknown error', err)
  }
  process.exitCode = -1
}

module.exports = { ErrorHandler }
