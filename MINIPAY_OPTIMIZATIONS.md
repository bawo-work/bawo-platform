# MiniPay Optimization Summary

**Target User:** 11M MiniPay wallet holders on $50-120 Android phones (Tecno, Infinix, Samsung A-series)

---

## Core MiniPay Optimizations

### 1. Wallet Auto-Connect (Sprint 2)
**No "Connect Wallet" button** - MiniPay wallet auto-detected and connected automatically.

```typescript
// Detects window.ethereum provider injected by MiniPay browser
if (window.ethereum?.isMiniPay) {
  const address = await window.ethereum.request({
    method: 'eth_accounts'
  });
  // Auto-connected ✅
}
```

**User Flow:**
1. Worker clicks WhatsApp link → Opens in MiniPay browser
2. Bawo detects MiniPay → Captures wallet address automatically
3. No manual connection needed
4. Worker proceeds directly to verification

**Why This Matters:** Zero friction onboarding for 11M existing MiniPay users.

---

### 2. Mobile-First PWA (<2MB Constraint)

**Bundle Size Targets:**
- Total JS: <150kb gzipped (current web average: 400kb+)
- Total CSS: <30kb gzipped
- Total PWA install: <2MB (MiniPay constraint)
- Images: WebP format, lazy-loaded, <50kb each

**Implementation:**
- Aggressive code splitting (route-based chunks)
- Tree-shaking unused code
- No heavy libraries (Zustand 1kb vs Redux 47kb)
- Service Worker + IndexedDB for offline (cached locally, not downloaded repeatedly)

**Why This Matters:** $50 phones have 16-32GB storage total. Workers need space for other apps.

---

### 3. 3G Load Performance (<3s Target)

**Performance Budget:**
- Initial load: <3s on 3G (1.6 Mbps down)
- Time to Interactive: <5s
- Task load: <2s
- Payment confirmation: <5s

**Implementation:**
- Cloudflare Edge CDN (routes to nearest POP)
- Static generation for landing pages (pre-rendered at build time)
- Incremental Static Regeneration for task lists
- Lazy loading for non-critical routes
- Image optimization (Next.js Image component)

**Why This Matters:** 86% of web traffic in target markets is mobile. Data is expensive (~$1/GB in Kenya).

---

### 4. Offline Task Caching (Sprint 6)

**Service Worker Strategy:**
- Network-first for API calls
- Cache-first for static assets
- Background sync for task submissions

**IndexedDB Storage:**
- Available tasks cached locally
- Submissions queued when offline
- Auto-sync when reconnected

**User Experience:**
```
Worker completes task → No internet →
"Saved offline, will submit when connected" →
Worker reconnects → Auto-submits → Payment credited
```

**Why This Matters:** Intermittent connectivity is common. Workers shouldn't lose work or earnings.

---

### 5. Instant Payment Visibility

**Celo + MiniPay Integration:**
- Payment sent via Celo blockchain (<5s finality)
- Worker sees balance update in Bawo immediately
- Worker checks MiniPay wallet → cUSD visible
- No "pending" state (Celo L2 is fast)

**Withdrawal Flow:**
1. Worker taps "Withdraw" in Bawo
2. Amount sent to MiniPay wallet (<5s)
3. "Check your MiniPay wallet" notification
4. Worker opens MiniPay → cUSD balance updated
5. Worker taps "Cash out to M-PESA" in MiniPay → 55 seconds to local currency

**Why This Matters:** Instant payment is the core value prop. Workers see money immediately, not in 30-60 days.

---

### 6. Touch Target Sizing (48x48px Minimum)

**WCAG AAA Compliance:**
- All buttons/links: 48x48px minimum (standard is 44x44px)
- Generous spacing between interactive elements
- Large tap zones for common actions

**Why This Matters:**
- Cheap Android phones often have poor touch calibration
- Workers may have large fingers or use phone one-handed
- Accidental taps are frustrating when earning money

---

### 7. Design Tokens (Warm Palette for Workers)

**Worker App Colors:**
- Background: Warm White (#FEFDFB) - reduces eye strain on cheap LCD screens
- Primary: Teal (#1A5F5A) - Celo brand association, trust
- Accent: Terracotta (#C45D3A) - warmth, not cold tech
- Money: Gold (#C4A23A) - earnings feel valuable

**Typography:**
- Plus Jakarta Sans (modern, readable)
- 16px minimum body text (prevents iOS zoom)
- Generous line height (1.5) for readability on small screens

**Why This Matters:** $50 phones have low-resolution screens. Design must be readable in bright sunlight (outdoor work common).

---

### 8. MiniPay Browser Compatibility

**Target Browser:** MiniPay (Chromium-based, bundled with Opera Mini)

**Tested Features:**
- window.ethereum provider detection ✅
- eth_accounts, eth_sendTransaction ✅
- Web3 modal fallbacks for non-MiniPay browsers ✅
- PWA install prompts ✅
- Service Worker support ✅

**Fallback for Non-MiniPay:**
- Show "Open in MiniPay for best experience" banner
- Still functional in Chrome/Safari mobile
- Desktop browser shows "This is optimized for mobile" message

---

### 9. Celo Fee Abstraction (Gas Paid in cUSD)

**No "Buy ETH First" Friction:**
- Workers pay gas fees in cUSD (the stablecoin they earn)
- No need to acquire native token
- Fees deducted from earnings automatically

**Example:**
```
Worker earns $0.05 → Gas fee $0.0002 → Net $0.0498 credited
```

**Why This Matters:** Traditional crypto requires: Buy ETH → Send to wallet → Convert to USDC → Pay gas. MiniPay + Celo eliminates this entirely.

---

### 10. Dollar-Denominated UI (No Crypto Jargon)

**What Workers See:**
- "$0.05 earned" (NOT "0.05 cUSD")
- "Balance: $12.47" (NOT "12.47 Celo Dollars")
- "Withdraw $10" (NOT "Send 10 cUSD to wallet")

**Why This Matters:** Workers think in dollars, not crypto. They're hedging against local currency volatility, not speculating on tokens.

---

## Implementation Checklist

### Sprint 1: Foundation
- [ ] Next.js 14 with App Router (built-in code splitting)
- [ ] Tailwind CSS config with warm palette
- [ ] Bundle size monitoring in CI (Webpack Bundle Analyzer)
- [ ] Lighthouse CI for 3G performance validation

### Sprint 2: MiniPay Integration
- [ ] MiniPay wallet auto-detection (window.ethereum.isMiniPay)
- [ ] Wallet address capture without manual connect
- [ ] Mobile-first responsive layouts (Tailwind breakpoints)
- [ ] 48x48px touch targets for all interactive elements

### Sprint 4: Payments
- [ ] Celo blockchain integration (viem)
- [ ] Fee abstraction (gas paid in cUSD)
- [ ] Instant balance updates (<5s)
- [ ] Withdrawal to MiniPay wallet

### Sprint 6: Offline + Performance
- [ ] Service Worker for offline caching
- [ ] IndexedDB for task queue
- [ ] Image optimization (WebP, lazy loading)
- [ ] Final bundle size audit (<150kb JS gzipped)
- [ ] 3G load time validation (<3s on Lighthouse)

---

## Success Metrics

| Metric | Target | Why |
|--------|--------|-----|
| Initial load (3G) | <3s | Data is expensive |
| Bundle size (JS) | <150kb gzipped | Storage constrained |
| PWA install size | <2MB | MiniPay constraint |
| Touch target size | 48x48px min | Cheap phone calibration |
| Offline sync success | >95% | Intermittent connectivity |
| Payment confirmation | <5s | Core value prop |
| MiniPay detection | 100% | Auto-connect critical |

---

## Validation

**Week 1-2 Testing:**
1. Test on actual Tecno/Infinix/Samsung devices
2. Measure load time on throttled 3G connection
3. Verify MiniPay wallet auto-detection
4. Test offline task submission → sync on reconnect
5. Validate bundle size in production build

**Continuous Monitoring:**
- Lighthouse CI on every PR (mobile 3G profile)
- Webpack Bundle Analyzer in build pipeline
- Sentry for client-side errors
- PostHog for user behavior (task completion rates)

---

**Summary:** Every design decision optimizes for the constraint that workers are on $50 Android phones with MiniPay, using 3G connections, with limited storage and expensive data. This isn't just "mobile-friendly" — it's MiniPay-native.
