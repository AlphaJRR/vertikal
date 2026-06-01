const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

for (const ext of ["mov", "mp4", "html", "css"]) {
  if (!config.resolver.assetExts.includes(ext)) {
    config.resolver.assetExts.push(ext);
  }
}

module.exports = config;
