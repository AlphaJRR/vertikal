# How to Start Expo Development Server

## ⚠️ Important: Run from the Project Directory

Always run Expo commands from the **Vertikal-App** directory, not from your home directory.

## Steps:

### 1. Open Terminal

### 2. Navigate to Project Directory
```bash
cd /Users/alphavisualartists/Vertikal-App
```

### 3. Verify You're in the Right Place
```bash
pwd
# Should output: /Users/alphavisualartists/Vertikal-App
```

### 4. Start Expo
```bash
npx expo start --clear
```

The `--clear` flag clears the Metro bundler cache, which helps ensure fresh builds.

## Alternative: Use Quick Command

You can also run it all in one line:
```bash
cd /Users/alphavisualartists/Vertikal-App && npx expo start --clear
```

## Verify Data is Loading

Once Expo starts, check the terminal output. You should see:
```
📊 Data loaded: { creators: 200, projects: 100 }
```

This confirms all 200 creators and 100 projects are loaded.

## Troubleshooting

If you still get errors:
1. Make sure you're in `/Users/alphavisualartists/Vertikal-App`
2. Check that `package.json` exists: `ls package.json`
3. Clear cache: `npx expo start -c`
4. Reinstall if needed: `rm -rf node_modules && npm install`

