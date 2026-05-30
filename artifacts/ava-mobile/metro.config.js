const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes("mov")) {
  config.resolver.assetExts.push("mov");
}

module.exports = config;
