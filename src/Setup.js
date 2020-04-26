const { Config } = require('./Config')
const { Argv } = require('./Argv')
const { askCredentialsIfNeeded } = require('./Credentials')
const { success } = require('./Logger')

const runUserSetup = async () => {
  if (Argv.clearConfig) {
    Config.clear()
    success('Config cleared!\n')
  }
  await askCredentialsIfNeeded()
}

module.exports = { runUserSetup }
