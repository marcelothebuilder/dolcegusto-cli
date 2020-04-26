const Configstore = require("configstore");
const packageJson = require("../package.json");

module.exports.Config = new Configstore(packageJson.name);