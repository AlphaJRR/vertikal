const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

for (const ext of ["mov", "mp4", "html", "css"]) {
  if (!config.resolver.assetExts.includes(ext)) {
    config.resolver.assetExts.push(ext);
  }
}

// RN 0.81+ removed Libraries/Renderer/shims/ReactNative; RNGH 2.28 still imports it.
const reactNativeShim = path.resolve(
  __dirname,
  "node_modules/react-native/Libraries/Renderer/shims/ReactFabric.js",
);

const bufferShim = path.resolve(
  __dirname,
  "node_modules/whatwg-url-without-unicode/node_modules/buffer/index.js",
);
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native/Libraries/Renderer/shims/ReactNative") {
    return { type: "sourceFile", filePath: reactNativeShim };
  }
  if (moduleName === "buffer") {
    return { type: "sourceFile", filePath: bufferShim };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
