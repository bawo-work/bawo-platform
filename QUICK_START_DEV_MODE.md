# Quick Start: MiniPay Dev Mode Testing

## Immediate Testing (5 minutes)

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Install MetaMask
If you don't have MetaMask installed:
1. Go to https://metamask.io
2. Click "Download" for your browser
3. Follow installation instructions
4. Create or import a wallet

### Step 3: Open Onboarding Page
```bash
# Open in your browser
http://localhost:3000/onboard
```

### Step 4: Verify Dev Mode
You should see:
- ✅ An amber badge: "DEV MODE: Using MetaMask for testing"
- ✅ Wallet connects automatically (MetaMask popup)
- ✅ No "Open in MiniPay" error message
- ✅ Success message: "Test wallet for development"

### Step 5: Test the Flow
1. Complete onboarding
2. Navigate to dashboard
3. Start a task (if available)
4. Test withdrawal flow

---

## What's Working Now

✅ **Local Development**
- Any Ethereum wallet works (MetaMask, Coinbase Wallet, etc.)
- Fast iteration without Android device
- Full flow testing on desktop

✅ **Visual Feedback**
- Clear dev mode indicator
- Distinguishes test wallet from production

✅ **Production Safety**
- `NODE_ENV=production` still enforces MiniPay-only
- Desktop users will see "Open in MiniPay" in production

---

## When You Need Real MiniPay Testing

Before deploying to production, you MUST test with real MiniPay:

### Requirements
- Android device (Tecno, Infinix, Samsung A-series recommended)
- MiniPay app from Play Store
- ngrok installed: `npm install -g ngrok`

### Steps
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: ngrok tunnel
ngrok http 3000

# Copy ngrok URL (e.g., https://abc123.ngrok-free.app)
# Open in MiniPay app on Android device
```

### What to Test
- [ ] Zero-click wallet auto-connection
- [ ] No "Connect Wallet" button needed
- [ ] Payment arrives in <5 seconds
- [ ] 3G load time <3 seconds
- [ ] Full worker flow works

---

## Troubleshooting

### "No Ethereum provider detected"
- Install MetaMask browser extension
- Refresh the page after installing
- Check that MetaMask is enabled for the site

### Dev mode badge not showing
- Check `NODE_ENV=development` in your environment
- Restart dev server: `npm run dev`
- Clear browser cache

### Wallet won't connect
- Click the MetaMask extension icon
- Unlock MetaMask if locked
- Select the account you want to use
- Approve the connection request

### Still seeing "Open in MiniPay" error
- Verify dev server is running with `NODE_ENV=development`
- Check console for errors: `window.ethereum` should exist
- Try in a different browser

---

## Documentation

- **Full Implementation Details**: `MINIPAY_DEV_MODE_IMPLEMENTATION.md`
- **Complete Testing Checklist**: `LOCAL_TESTING_CHECKLIST.md` (section 2.5)
- **Environment Setup**: `.env.example` (MiniPay section)

---

## Production Checklist

Before deploying to production:

- [ ] Test with real MiniPay on Android device (using ngrok)
- [ ] Verify payment transactions work on Alfajores testnet
- [ ] Test full worker flow: onboard → task → withdraw
- [ ] Confirm desktop shows "Open in MiniPay" in production
- [ ] Monitor wallet connection analytics after launch

---

**Status**: ✅ Ready for local testing
**Next**: Test with MetaMask, then ngrok + real MiniPay before production
