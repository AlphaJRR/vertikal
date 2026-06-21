/**
 * AVA uses local notifications only. expo-notifications adds aps-environment by
 * default, which requires Push Notifications on the provisioning profile. Strip it
 * on every npm install (including EAS Build).
 */
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '../node_modules/expo-notifications/plugin/build/withNotificationsIOS.js'
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const marker = 'AVA: local notifications only';
let source = fs.readFileSync(target, 'utf8');

if (source.includes(marker)) {
  process.exit(0);
}

const block =
  "config = (0, config_plugins_1.withEntitlementsPlist)(config, (config) => {\n        if (!config.modResults['aps-environment']) {\n            config.modResults['aps-environment'] = mode;\n        }\n        return config;\n    });";

if (!source.includes(block)) {
  console.warn('[patch-expo-notifications] unexpected file shape — skipping');
  process.exit(0);
}

source = source.replace(
  block,
  '// AVA: local notifications only — skip aps-environment (no push provisioning profile required)'
);

fs.writeFileSync(target, source);
console.log('[patch-expo-notifications] removed aps-environment entitlement hook');
