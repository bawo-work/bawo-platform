# Bawo Cold Start Strategy
## Benchmark Datasets + Points Program

**Problem:** Chicken-and-egg between workers and clients. Workers leave if no tasks; clients won't commit without proven capacity.

**Solution:** Build demonstrable benchmark datasets using a points-based incentive system. Workers earn points during low-volume periods, points convert to cash as revenue grows. Datasets become sales collateral and proof of quality.

---

## Part 1: Benchmark Datasets to Build

### Why This Works

1. **For workers:** Steady "work" even before paying clients
2. **For clients:** See actual labeled data quality before committing
3. **For Bawo:** Training data for QA systems; marketing collateral; potential direct sales
4. **For the ecosystem:** Publishable datasets build credibility in NLP community

### Dataset Specifications

#### Dataset 1: Swahili Sentiment Analysis
**Why valuable:** 115M speakers, poor AI model performance, high demand from African market AI companies

| Attribute | Specification |
|-----------|---------------|
| **Size** | 5,000 labeled examples |
| **Source text** | Kenyan Twitter, news comments, product reviews |
| **Labels** | Positive / Negative / Neutral + confidence score |
| **Consensus** | 3 workers per example |
| **Total annotations** | 15,000 |
| **Languages** | Pure Swahili, Swahili-English code-switch |
| **Estimated time** | 2-3 weeks with 50 workers |
| **Points cost** | ~75,000 points (5 points/annotation) |

**Client appeal:** "Here's 5,000 labeled Swahili sentiment examples. Test our quality. If it works, we can do 50,000 more."

#### Dataset 2: Kenyan Code-Switching Detection
**Why valuable:** Unique dataset; no good public alternative; critical for any Kenya-focused NLP

| Attribute | Specification |
|-----------|---------------|
| **Size** | 3,000 labeled examples |
| **Source text** | Social media, chat messages, informal writing |
| **Labels** | Language tags per segment (EN/SW/Sheng/Mixed) |
| **Task type** | Span annotation (mark which parts are which language) |
| **Consensus** | 3 workers per example |
| **Total annotations** | 9,000 |
| **Estimated time** | 2 weeks with 30 workers |
| **Points cost** | ~54,000 points (6 points/annotation - harder task) |

**Client appeal:** "Code-switching is the hardest problem in African NLP. We have ground-truth data."

#### Dataset 3: Sheng Lexicon + Sentiment
**Why valuable:** Sheng is Nairobi street slang; ~10M speakers; virtually zero NLP resources exist

| Attribute | Specification |
|-----------|---------------|
| **Size** | 2,000 labeled examples + 500-word lexicon |
| **Source text** | Nairobi social media, music lyrics, informal chat |
| **Labels** | Sentiment + Sheng word identification + meaning |
| **Task type** | Multi-label (sentiment + vocabulary extraction) |
| **Consensus** | 5 workers per example (higher for novel vocab) |
| **Total annotations** | 10,000 |
| **Estimated time** | 3 weeks with 40 workers |
| **Points cost** | ~70,000 points (7 points/annotation) |

**Client appeal:** "The only Sheng sentiment dataset in existence. If you're building for Kenya, you need this."

#### Dataset 4: East African Voice Samples (Phase 2)
**Why valuable:** Speech recognition needs accent diversity; African accents severely underrepresented

| Attribute | Specification |
|-----------|---------------|
| **Size** | 1,000 speakers × 10 phrases = 10,000 clips |
| **Content** | Common phrases, numbers, commands in English + Swahili |
| **Metadata** | Age, gender, region, native language |
| **Task type** | Recording + transcription verification |
| **Quality check** | Audio clarity score + accent authenticity |
| **Estimated time** | 4 weeks with 100 workers |
| **Points cost** | ~150,000 points (15 points/recording set) |

**Client appeal:** "Diverse East African voice data for ASR training. 1,000 unique speakers."

### Dataset Monetization Options

| Option | Price Point | Notes |
|--------|-------------|-------|
| **Free sample** | 100 examples | Lead generation |
| **Academic license** | $500-2,000 | Researchers, citations |
| **Commercial license** | $5,000-20,000 | Startups, per-dataset |
| **Exclusive license** | $25,000+ | One buyer owns it |
| **Custom extension** | $0.50-2/label | "We want 50K more like this" |

---

## Part 2: Points Program Design

### Core Mechanics

**Earning Points:**

| Activity | Points | Notes |
|----------|--------|-------|
| Complete training task | 5 | Benchmark dataset work |
| Complete paid task | 0 | Paid in cash, not points |
| Pass golden task (QA) | +2 bonus | Quality incentive |
| Referral (after referee does 10 tasks) | 50 | Growth driver |
| 7-day streak | 25 | Retention |
| 30-day streak | 150 | Retention |
| Language verification passed | 100 | One-time per language |
| Top 10 weekly leaderboard | 50-200 | Competition |
| Bug report accepted | 25 | Product improvement |

**Spending Points:**

| Redemption | Points Cost | Notes |
|------------|-------------|-------|
| $1 cUSD to wallet | 100 | Base conversion rate |
| Priority task access | 500/week | See paid tasks first |
| Skip training requirement | 200 | For experienced workers |
| Custom profile badge | 50 | Status/gamification |
| Referral bonus boost (2x) | 100 | Double next referral |

**Conversion Rate:** 100 points = $1 (but only redeemable when Bawo has revenue)

### Points Treasury Management

**The key insight:** Points are a liability. We need to manage them carefully.

**Rules:**

1. **Cap total points issued:** Max 500,000 points outstanding (~$5,000 liability)
2. **Redemption requires revenue:** Workers can only redeem when Bawo monthly revenue > total redemption requests
3. **Monthly redemption cap:** Max 20% of monthly revenue goes to point redemptions
4. **Points expire:** 12 months from issuance (use it or lose it)
5. **Transparency:** Workers see total points outstanding vs. redemption pool

**Example scenario:**

| Month | Revenue | Redemption Pool (20%) | Points Outstanding | Redeemable? |
|-------|---------|----------------------|-------------------|-------------|
| 1 | $0 | $0 | 50,000 | No |
| 2 | $500 | $100 | 80,000 | Yes, up to $100 |
| 3 | $2,000 | $400 | 100,000 | Yes, up to $400 |
| 4 | $5,000 | $1,000 | 90,000 | Yes, up to $1,000 |

**Worker communication:**
> "Points are your share of Bawo's future success. As we grow, your points become real money. Early workers who help us build quality datasets will benefit most."

### Founding Worker Program

**Goal:** Lock in 50-100 committed early workers who understand the vision

**Benefits for Founding Workers (first 100 sign-ups who complete 50+ tasks):**

| Benefit | Value |
|---------|-------|
| 2x points multiplier | For first 3 months |
| "Founding Worker" badge | Permanent, visible on profile |
| Priority access to paid tasks | Forever |
| Direct Slack/WhatsApp access to founder | Feedback channel |
| Revenue share bonus | 0.1% of first $100K GMV split among founding workers |

**Revenue share math:**
- First $100K GMV = $1,000 bonus pool
- Split among ~50 active founding workers = ~$20 each
- Small but meaningful; aligns incentives

**Commitment required:**
- Complete 50 training tasks in first 2 weeks
- Maintain 85%+ accuracy
- Stay active (10+ tasks/week) for first 3 months

### Anti-Gaming Measures

| Risk | Mitigation |
|------|------------|
| Points farming with low quality | Points only awarded if accuracy >80% |
| Multi-account for referrals | Self Protocol = 1 passport = 1 account |
| Colluding on answers | Randomized task variants; pattern detection |
| Redeem and leave | Redemption requires ongoing activity (10 tasks in last 30 days) |
| Inflating points then dumping | Monthly redemption cap; 12-month expiry |

---

## Part 3: Cold Start Sequencing

### Phase 0: Seed (Week 1-2)
**Goal:** 30 founding workers, systems working

| Action | Target | Cost |
|--------|--------|------|
| Recruit via WhatsApp/Twitter | 50 sign-ups | $0 |
| Onboard through MiniPay + Self | 30 verified | $0 |
| Create 500 training tasks (Swahili sentiment) | Internal | Time only |
| Workers complete training, earn points | 30 workers × 20 tasks = 600 annotations | 3,000 points |
| Validate quality, identify top performers | 10 "gold" workers | - |

**End state:** 30 workers with points balances, 600 labeled examples, quality baseline established

### Phase 1: Dataset Build (Week 3-6)
**Goal:** Complete Dataset 1 (Swahili Sentiment), 100 workers

| Week | Workers | Annotations | Points Issued | Dataset Progress |
|------|---------|-------------|---------------|------------------|
| 3 | 50 | 3,000 | 15,000 | 20% |
| 4 | 70 | 5,000 | 25,000 | 53% |
| 5 | 90 | 5,000 | 25,000 | 87% |
| 6 | 100 | 2,000 | 10,000 | 100% ✓ |

**Total:** 15,000 annotations, 75,000 points issued (~$750 future liability)

**Parallel actions:**
- Cold outreach to 30 potential clients
- Share sample data with interested leads
- Post dataset teaser on Twitter/LinkedIn
- Submit to Masakhane community for visibility

### Phase 2: First Revenue (Week 7-10)
**Goal:** Convert dataset interest to paying pilot

| Scenario | Approach |
|----------|----------|
| Client wants custom labels | "We can extend this dataset. $0.50/label, 48hr turnaround." |
| Client wants different task | "Let us build a sample. 100 free, then $X for more." |
| Client wants to buy dataset | License negotiation; $2-10K depending on exclusivity |

**Points transition:**
- Paid tasks pay cash, not points
- Open redemption pool (20% of revenue)
- Workers see "Redemption pool: $X available"

**Example:** First client pays $2,000 for pilot
- $400 goes to redemption pool
- Workers can now cash out up to 40,000 points
- Creates urgency: "Redeem now while pool is available"

### Phase 3: Sustainable Growth (Week 11+)
**Goal:** Balance paid work and points-based training

| Revenue Level | Paid Task % | Training Task % | Points Redemption |
|---------------|-------------|-----------------|-------------------|
| $0-1K/mo | 20% | 80% | Limited |
| $1-5K/mo | 50% | 50% | $200-1,000/mo |
| $5-20K/mo | 70% | 30% | $1,000-4,000/mo |
| $20K+/mo | 85% | 15% | Uncapped (within 20%) |

**Long-term points role:**
- Training new workers (always needed)
- Building new language datasets (expansion)
- Quality bonus on top of cash pay
- Referral incentives

---

## Part 4: Dataset Sales Strategy

### Target Buyers

| Buyer Type | Dataset Interest | Price Sensitivity | Sales Cycle |
|------------|------------------|-------------------|-------------|
| **Academic researchers** | Novel languages, publishable | High (grant-funded) | 2-4 weeks |
| **African market startups** | Swahili, local languages | Medium | 1-2 weeks |
| **Global AI labs** | Diversity, edge cases | Low | 4-8 weeks |
| **Speech/voice companies** | Accent data | Low | 2-4 weeks |

### Sales Collateral

**For each dataset, create:**

1. **Data card** (1-pager)
   - Size, languages, task type
   - Collection methodology
   - Quality metrics (inter-annotator agreement)
   - Sample examples (10-20)
   - Pricing tiers

2. **Sample pack** (free)
   - 100 labeled examples
   - Full schema documentation
   - Quality report

3. **Technical report** (for academics)
   - Annotation guidelines
   - Worker demographics
   - Disagreement analysis
   - Comparison to existing datasets

### Outreach Targets

**Academic (20 targets):**
- Masakhane NLP community
- Stanford HAI African AI initiative
- CMU Language Technologies Institute
- Google Research Africa
- Microsoft Research Africa

**Startup (30 targets):**
- African fintech with AI features
- Local e-commerce (sentiment on reviews)
- African language translation startups
- Voice assistant companies expanding to Africa

**Enterprise (10 targets):**
- Meta AI (African language models)
- Google (Search, Translate, ASR)
- Amazon (Alexa expansion)
- OpenAI (GPT African languages)

---

## Part 5: Financial Model (Cold Start Phase)

### Costs (Month 1-3)

| Item | Month 1 | Month 2 | Month 3 |
|------|---------|---------|---------|
| Infrastructure | $100 | $150 | $200 |
| Points liability created | $500 | $700 | $500 |
| Founding worker bonus pool | $0 | $0 | $200 |
| Marketing/outreach | $100 | $200 | $300 |
| **Total cash out** | **$200** | **$350** | **$700** |
| **Total liability created** | **$500** | **$700** | **$500** |

### Revenue (Month 1-3)

| Source | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|
| Dataset license sales | $0 | $500 | $2,000 |
| Pilot projects | $0 | $500 | $1,500 |
| **Total** | **$0** | **$1,000** | **$3,500** |

### Points Liability Management

| Month | Points Issued | Cumulative Liability | Revenue | Redemption Pool | Net Exposure |
|-------|---------------|---------------------|---------|-----------------|--------------|
| 1 | 50,000 | $500 | $0 | $0 | $500 |
| 2 | 70,000 | $1,200 | $1,000 | $200 | $1,000 |
| 3 | 50,000 | $1,700 | $3,500 | $700 | $1,000 |
| 4 | 30,000 | $2,000 | $6,000 | $1,200 | $800 |
| 5 | 20,000 | $2,200 | $10,000 | $2,000 | $200 |
| 6 | 10,000 | $2,300 | $15,000 | $3,000 | -$700 ✓ |

**Break-even on points liability:** ~Month 6

After month 6, redemption pool exceeds outstanding liability. Points become a sustainable incentive, not a debt.

---

## Part 6: Risk Mitigation

### What Could Go Wrong

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Workers farm points, never convert to real work | Medium | Medium | Points expire; redemption requires activity |
| Dataset doesn't sell | Medium | High | Use for marketing anyway; pivot to services |
| Points liability exceeds revenue | Low | High | Cap issuance; 20% redemption cap |
| Quality too low to sell | Medium | High | Golden tasks; spot checks; only release if >90% agreement |
| Competitors copy datasets | Low | Low | First-mover; build next one faster |

### Kill Switches

**If points liability gets dangerous (>$5K with <$2K revenue):**
1. Stop issuing new points
2. Convert to "waitlist" for new workers
3. Focus 100% on closing revenue
4. Communicate transparently with workers

**If dataset quality is poor:**
1. Don't release it
2. Re-label with tighter QA
3. Identify and remove low-quality workers
4. Treat as expensive learning

---

## Summary: The Cold Start Playbook

| Week | Worker Focus | Client Focus | Dataset Focus |
|------|--------------|--------------|---------------|
| 1-2 | Recruit 30 founding workers | Identify 30 targets | Design Dataset 1 |
| 3-4 | Scale to 70 workers | Send cold outreach | Build 40% of Dataset 1 |
| 5-6 | Scale to 100 workers | Share samples, get pilots | Complete Dataset 1 |
| 7-8 | Maintain; add as needed | Close first $2K+ | Start Dataset 2 |
| 9-10 | Balance paid + training | Scale pilots | License Dataset 1 |
| 11-12 | Grow with demand | Repeatables sales | Complete Dataset 2 |

**The flywheel:**
```
Points attract workers → Workers build datasets → Datasets attract clients
       ↑                                                      ↓
       └──────────── Revenue funds points redemption ←────────┘
```

**Success metric:** By Month 6, points redemption is fully funded by revenue, and we have 2 sellable datasets + 5 recurring clients.
