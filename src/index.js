const { DolceGustoApi, DolceGustoApiError } = require("./DolceGustoApi");
const { askCredentials, askCoupon, askContinue } = require("./Prompts");
const { success, error, errorTitle, logBanner } = require("./Logger");
const { Config } = require("./Config");
const { Argv } = require("./Argv");

const askCredentialsIfNeeded = async () => {
  if (Config.has("email")) return;
  const answers = await askCredentials();
  Config.set("email", answers.email);
  Config.set("password", answers.password);
};

const getCredentials = () => ({
  email: Argv.email || Config.get("email"),
  password: Argv.password || Config.get("password"),
});

(async () => {
  logBanner();

  if (Argv.clearConfig) {
    Config.clear();
    success("Config cleared!\n");
  }

  await askCredentialsIfNeeded();

  do {
    await new DolceGustoApi(getCredentials()).postCoupon({
      coupon: await askCoupon(),
    });
  } while (await askContinue());
})().catch((err) => {
  if (err instanceof DolceGustoApiError) {
    errorTitle(err.message);
    (err.messages || []).forEach((message) => {
      error(`\t${message}`);
    });
    if (err.step === DolceGustoApiError.Step.LOGIN) {
      error("You can reset the saved credentials by passing --clearConfig");
    }
  } else {
    error(err);
  }
  process.exitCode = -1;
});
