# MVP Launch Readiness Checklist

## Technical

- [ ] All unit tests passing (80%+ coverage)
- [ ] E2E tests passing (critical paths)
- [ ] Bundle size <150kb gzipped (run `npm run analyze`)
- [ ] Initial load <3s on 3G (run `npm run lighthouse`)
- [ ] Payment transactions working on Celo mainnet
- [ ] Self Protocol verification working (or fallback enabled)
- [ ] Database backups enabled (Supabase)
- [ ] Monitoring configured (Axiom, BetterStack)
- [ ] Error tracking configured (Vercel)

## Security

- [ ] HTTPS enforced
- [ ] RLS policies enabled on all tables
- [ ] Hot wallet private key secured (environment variable)
- [ ] Rate limiting enabled on auth endpoints
- [ ] No PII stored (Self Protocol ZK proofs only)

## Business

- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Client pricing confirmed ($0.08/label minimum)
- [ ] Worker payment confirmed (60% of client price)
- [ ] Points program treasury cap set (500K points max)

## Content

- [ ] Landing page live
- [ ] Worker onboarding tutorial (5 training tasks)
- [ ] Client onboarding documentation (how to create project)
- [ ] FAQ page (workers + clients)

## Launch

- [ ] 50 founding workers recruited
- [ ] 1 pilot client committed ($1K+ project)
- [ ] WhatsApp group created ("Bawo Beta - Kenya")
- [ ] Twitter/X account active
- [ ] DNS configured (bawo.work)

---

## Performance Validation

### Bundle Size Analysis

```bash
npm run analyze
```

Expected output:
- Main bundle: <100kb gzipped
- Client dashboard bundle: <30kb gzipped
- Worker app bundle: <50kb gzipped
- Total JS: <150kb gzipped

### 3G Load Time Test

```bash
npm run lighthouse
```

Expected metrics:
- First Contentful Paint: <2s
- Time to Interactive: <5s
- Total Blocking Time: <300ms
- Lighthouse Performance Score: >90

### MiniPay Testing

1. Deploy to staging (Vercel)
2. Open in MiniPay browser on test device
3. Verify:
   - Wallet auto-detection works
   - PWA install prompt appears
   - Offline mode functions
   - Touch targets are 48x48px minimum
   - Load time <3s on 3G

---

## Go/No-Go Criteria

**GO if:**
- All Technical items complete
- All Security items complete
- Bundle size <150kb
- 3G load <3s
- At least 10 founding workers recruited

**NO-GO if:**
- Any Security item incomplete
- Bundle size >200kb
- 3G load >5s
- Self Protocol unavailable AND phone verification broken
