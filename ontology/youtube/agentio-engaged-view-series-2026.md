# August 2026 view-count revision: observed versus modeled permissioned samples

**Checked:** 2026-10-24. Source: [Agentio prechange projection, August 21, 2026](https://www.agentio.com/blog/youtube-view-vs-engaged-view) and [postchange observed cohort, September 3, 2026](https://www.agentio.com/blog/youtube-new-view-count-60-engaged-view-rate). Official platform definitions: [YouTube's August 2026 announcement](https://blog.youtube/inside-youtube/engaged-views-youtube-explained/). The vendor is a creator-advertising marketplace; its permissioned creator cohort is not a representative YouTube census. Its two studies can overlap and are **not independent replications**.

## Different measurement levels after August 24

YouTube's changed public video view counter measures playback from the **first frame** on August 24, 2026. Qualified or engaged viewing remains a separately measured event visible through owner-authorized analytics. Neither a raw public playback start nor a qualified engaged event is a **unique person** or a completed purchase.

Before the change, the vendor's August 21 model used early video retention for **35,800** selected long-form videos from June–July 2026. It assumed **30 seconds** as an engagement threshold and projected roughly **30% more public than engaged views**. The actual organic threshold is not published; the 30% was a **model projection**, not observed postchange conversion. The same source reported a separate selected 550-Short sample's 65% measured public-vs-engaged gap; that cannot be pooled with the modeled long-form cohort.

## Observed permissioned results published September 3

The newer vendor report analyzes **more than 75,000 videos**, uploaded from June 1 onward, with events occurring after August 24. It reports approximately **549 million public view events** and **330 million engaged view events** (about **60%** engaged over public). Rounded millions and selected cohort conditioning mean this is **not** a universal platform multiplier.

| Selected subgroup | Reported engaged share of public views |
|---|---:|
| Micro creator tier, under 50k average engaged views | 54% |
| Mid tier, 50k to under 300k | 57% |
| Macro tier, at least 300k | 67% |
| Education | 63% |
| Gaming | 56% |
| Technology | 46% |

The topic rows and channel-size tiers are **not mutually exclusive partitions of the whole sample**, so they are not additive or interpretable as creator-income ranks.

The vendor describes 20% engagement for **Browse/feed events** versus 85% for **watch-page events**. It attributes 77% of *the gap between public and engaged view events* to Browse and 23% to Watch pages. **77% of the gap is not 77% of all views**; the report separately says Browse accounts for approximately 38% of public view events. Do not combine metrics with different denominators.

## Pricing and economic boundary

At a **hypothetical** contract quoted at USD 30 per thousand public events with a 60% engaged-to-public ratio, the same contract implies USD 50 per thousand engaged events (30 ÷ 0.60). This is arithmetic conditional on unverified contract terms, not evidence an advertiser actually overpaid or any creator received extra revenue.

Neither the vendor's 2026 ratio, channel-tier variations nor genre rates establish actual monetization eligibility, causal effects, unique audiences, buyer outcomes, channel-level cash profits or a cross-August historical growth rate. Those remain unknown.

[Machine source-aligned observations](agentio-engaged-view-series-2026.json) · [unit auditor](../../site/agentio-engaged-view-audit.mjs) · [regression tests](../../tests/agentio-engaged-view-audit.test.mjs).
