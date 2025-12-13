# Troubleshooting Expo Issues

## Port Already in Use

If you see "Port 8081 is running":
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Then restart Expo
npx expo start --clear
```

## iOS Simulator Error (xcrun simctl)

If you see: `Error: xcrun simctl help exited with non-zero code: 69`

**This is not critical!** You can still use Expo Go on your phone:

### Option 1: Use Expo Go App (Recommended)
1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. Scan the QR code that appears in the terminal
3. Your app will load on your phone

### Option 2: Fix iOS Simulator (Optional)
If you want to use iOS Simulator:
```bash
# Reset Xcode command line tools
sudo xcode-select --reset
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# Or accept Xcode license
sudo xcodebuild -license accept
```

### Option 3: Use Android Emulator
```bash
# Press 'a' in the Expo terminal to open Android emulator
# (Make sure Android Studio and emulator are installed)
```

## Expo Won't Start

1. **Clear cache:**
   ```bash
   npx expo start -c
   ```

2. **Check you're in the right directory:**
   ```bash
   pwd
   # Should be: /Users/alphavisualartists/Vertikal-App
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

## Data Not Loading

Check the terminal for:
```
📊 Data loaded: { creators: 200, projects: 100 }
```

If you see this, data is loading correctly!

If not:
- Make sure `lib/data.ts` exists
- Check that `App.tsx` imports from `./lib/data`
- Restart Expo with `--clear` flag

