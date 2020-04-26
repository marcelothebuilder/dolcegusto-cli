const { Config } = require("./Config");
const { Argv } = require("./Argv");
const { askCredentials } = require("./Prompts");

const getCredentials = () => ({
  email: Argv.email || Config.get("email"),
  password: Argv.password || Config.get("password"),
});

const askCredentialsIfNeeded = async () => {
  if (Argv.email && Argv.password) return;
  if (Config.has("email") && Config.has("password")) return;
  const answers = await askCredentials();
  Config.set("email", answers.email);
  Config.set("password", answers.password);
};

module.exports = {
  getCredentials,
  askCredentialsIfNeeded,
};
