const { DolceGustoApi, DolceGustoApiError } = require("./DolceGustoApi");
const fs = require("fs").promises;
const chalk = require("chalk");
const { log, error } = console;
const Configstore = require("configstore");
const packageJson = require("../package.json");
const inquirer = require("inquirer");
const figlet = require("figlet");
const { askCredentials, askCoupon, askContinue } = require("./Prompts");
const argv = require("minimist")(process.argv.slice(2));

const config = new Configstore(packageJson.name);

const bannerStyle = chalk.green;
const printBanner = async () => {
  log(
    bannerStyle.bold(
      figlet.textSync("DolceGusto Cli", {
        horizontalLayout: "full",
        font: "Straight",
      })
    )
  );
  log(bannerStyle("Not affiliated with Nescafé!"));
  log();
};

const askCredentialsIfNeeded = async () => {
  if (config.has("email")) return;
  const answers = await askCredentials();
  config.set("email", answers.email);
  config.set("password", answers.password);
};

const getCredentials = () => ({
  email: argv.email || config.get("email"),
  password: argv.password || config.get("password"),
});

(async () => {
  await printBanner();
  
  if (argv.clearConfig) {
    config.clear();
    log(chalk.green("Config cleared!\n"));
  }

  await askCredentialsIfNeeded();

  do {
    await new DolceGustoApi(getCredentials()).postCoupon({
      coupon: await askCoupon(),
    });
  } while (await askContinue());
})().catch((err) => {
  if (err instanceof DolceGustoApiError) {
    error(chalk.red.bold(err.message));
    (err.messages || []).forEach((message) => {
      error(chalk.red(`\t${message}`));
    });
    if (err.step === DolceGustoApiError.Step.LOGIN) {
      error(
        chalk.red(
          "You can reset the saved credentials by passing --clearConfig"
        )
      );
    }
  } else {
    error(err);
  }
  process.exit(-1);
});
