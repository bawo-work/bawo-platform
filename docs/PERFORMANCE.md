# Performance Optimization Guide

## Bundle Size Target: <150kb gzipped

### Current Optimization Strategies

1. **Code Splitting**
   - Route-based chunks (Next.js App Router default)
   - Dynamic imports for heavy components
   - Lazy loading for non-critical features

2. **Tree Shaking**
   - Named imports only: `import { Button } from '@/components/ui/button'`
   - No default exports for utilities
   - `sideEffects: false` in package.json

3. **Dependency Optimization**
   - Zustand (1kb) vs Redux (47kb)
   - SWR (4kb) vs React Query (12kb)
   - Native browser APIs vs polyfills

4. **Image Optimization**
   - Next.js `<Image>` component
   - WebP format
   - Lazy loading
   - Responsive sizes

### Measuring Bundle Size

```bash
npm run analyze
```

Opens webpack-bundle-analyzer in browser showing:
- Size of each bundle
- Dependencies included
- Duplicate modules

**Target breakdown:**
- Main bundle: <100kb gzipped
- Client dashboard: <30kb gzipped
- Worker app: <50kb gzipped

---

## 3G Load Time Target: <3s

### Current Optimization Strategies

1. **Static Generation**
   - Landing pages pre-rendered at build time
   - Incremental Static Regeneration for task lists

2. **CDN Distribution**
   - Vercel Edge Network
   - Static assets cached at edge
   - Automatic brotli compression

3. **Critical CSS**
   - Inline critical styles
   - Defer non-critical CSS
   - Tailwind purging unused classes

4. **Font Optimization**
   - `next/font` with `swap` display
   - Plus Jakarta Sans subset: latin only
   - Preload font files

### Measuring Load Time

```bash
npm run lighthouse
```

Simulates 3G connection (1.6 Mbps down, 150ms RTT) and measures:
- First Contentful Paint (FCP): <2s
- Time to Interactive (TTI): <5s
- Total Blocking Time (TBT): <300ms
- Largest Contentful Paint (LCP): <2.5s

**Lighthouse targets:**
- Performance score: >90
- Accessibility: >95
- Best Practices: >95

---

## MiniPay-Specific Optimizations

### 1. Touch Target Sizing

All interactive elements: **48x48px minimum**

```tsx
<Button style={{ minHeight: '48px', minWidth: '48px' }}>
  Submit
</Button>
```

### 2. Warm Color Palette

Optimized for cheap LCD screens:
- Background: `#FEFDFB` (Warm White)
- Primary: `#1A5F5A` (Teal)
- Accent: `#C45D3A` (Terracotta)

### 3. PWA Configuration

- Service Worker for offline caching
- Manifest for install prompt
- App icons (192x192, 512x512)

### 4. Wallet Auto-Detection

Zero-click wallet connection:
```typescript
if (window.ethereum?.isMiniPay) {
  const address = await window.ethereum.request({
    method: 'eth_accounts'
  });
}
```

---

## Monitoring in Production

### Real User Monitoring (RUM)

Use Vercel Analytics to track:
- Real user load times
- Core Web Vitals
- Geographic distribution
- Device types

### Performance Budget

Set alerts for:
- Bundle size >150kb
- Load time >3s on 3G
- FCP >2s
- TTI >5s

### Continuous Integration

GitHub Actions workflow to fail PRs if:
- Bundle size increases >10%
- Lighthouse performance score <90

---

## Performance Checklist

- [ ] Bundle size <150kb (run `npm run analyze`)
- [ ] 3G load time <3s (run `npm run lighthouse`)
- [ ] All images optimized (WebP, lazy-loaded)
- [ ] Dynamic imports for heavy components
- [ ] Service Worker enabled
- [ ] Font optimization (Plus Jakarta Sans subset)
- [ ] Touch targets 48x48px minimum
- [ ] Lighthouse Performance score >90
