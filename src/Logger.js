const chalk = require('chalk')
const figlet = require('figlet')
const { log } = console

const styles = {
  bannerArt: chalk.green.bold,
  bannerSubtitle: chalk.green,
  error: chalk.red,
  errorTitle: chalk.red.bold,
  success: chalk.green
}

module.exports = {
  styles,
  success: (msg) => log(styles.success(msg)),
  error: (msg, source) => {
    if (source) log(styles.error(msg + '\n'), source)

    log(styles.error(msg))
  },
  errorTitle: (msg) => log(styles.errorTitle(msg)),
  logBanner: async () => {
    log(
      styles.bannerArt(
        figlet.textSync('DolceGusto Cli', {
          horizontalLayout: 'full',
          font: 'Straight'
        })
      )
    )
    log(styles.bannerSubtitle('Not affiliated with Nescafé!'))
    log()
  }
}
