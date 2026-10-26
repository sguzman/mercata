# Channel size and subscriber progress: two large vendor-index cohorts

**Dated evidence reviewed October 24, 2026.** [Machine channel cohorts](channel-cohort-observations-2026.json), [pure sample accounting checks](../../site/channel-cohort-audit.mjs), and [tests](../../tests/channel-cohort-audit.test.mjs).

## July 2026 indexed channel-size distribution

vidIQ's [July 20, 2026 benchmark](https://vidiq.com/research/youtube-subscriber-benchmarks-2026/) examined **61,186,246 indexed channels with at least one public subscriber**, excluding 1,391,713 zero-subscriber and 731 missing-count rows from a larger 62,578,690-row provider snapshot. The study reported the following **cumulative** milestones:

| Minimum public subscribers | Sample channels | Published share |
| ---: | ---: | ---: |
| 100 | 41,748,268 | 68.2% |
| 500 | 29,649,907 | 48.5% |
| 1,000 | 24,813,187 | 40.6% |
| 10,000 | 4,836,743 | 7.90% |
| 100,000 | 792,376 | 1.30% |
| 1,000,000 | 79,570 | 0.13% |

These are **not** the percentages of all YouTube channel creators. The sample is a nonrandom third-party index; 0-subscriber channels, deletions and non-indexed channels are not represented.

A separate **11,752,034**-channel subset was selected because its public video count **increased** over 90 days ending July 20. Its tier-specific median *monthly net subscriber changes* cannot count actual uploads, unique owners, newly created channels or people earning creator income.

## September 2026 cohort: below 1,000 subscribers at baseline

vidIQ's [September 11 report](https://vidiq.com/research/youtube-uploads-1000-subscribers/) tracks **32,926,088 channels** that had **below 1,000 subscribers and at least one video 360 days earlier**, with available endpoint counts and a nonnegative net change in public video objects.

| Net public-video-count change over 360 days | Eligible channels | Ended at ≥1,000 subscribers | Published percent |
| --- | ---: | ---: | ---: |
| 0 | 27,360,211 | 56,008 | 0.20% |
| +1 to +11 | 3,423,276 | 63,657 | 1.86% |
| +12 to +51 | 1,259,198 | 108,952 | 8.65% |
| +52 or more | 883,403 | 271,792 | 30.77% |
| **Total** | **32,926,088** | **500,409** | *No causal success probability* |

The source says this is a **360-day** two-endpoint comparison, **not** a record of uploads by date. A channel can upload and delete a video without a net change in count; channels with negative net change, missing history or no baseline public video were excluded. Channels below 1,000 at baseline were **not necessarily new entrants**. Differences between these groups are observational and can reflect baseline size, maturity, niche, budgets and selection. A net increase of 52 public video objects does **not** establish a weekly cadence; a channel ending at 1,000 subscribers does **not** establish YPP admission, earnings, profit, or even eligibility.

## What remains unavailable

The two studies and an [earlier vidIQ upload-frequency study](publishing-cadence-evidence.md) may draw from overlapping vendor coverage and must not be added as distinct samples of people or claimed to independently replicate the same outcome. Representative zero-subscriber entrants, inactive/deleted channels, distinct owner counts, native payouts, costs, hours, causal uplift and an all-channel frequency distribution remain **unknown**.

The audit checks all subgroup counts sum exactly to the publisher totals, cumulative milestones decrease appropriately, and **published percentages are rounded**. It explicitly rejects a monetization or causal interpretation of threshold crossing.

## Newer versus established channels: niche-conditional vendor studies (September 2026)

The following two selected studies address different questions. **Neither is a representative sample of all new channels.**

**TubeAI's [September 2026 niche analysis](https://tubeai.app/blog/youtube-growth/too-late-to-start-youtube)** selects **122,341 vendor-served creator channels** with at least **10,000 subscribers** and an upload in the prior 180 days. Of them, 14,624 were created on or after January 1, 2024. Its category table describes **newer channels' fraction among currently successful, still-active, indexed channels**, not the fraction of all new entrants who succeeded.

| Selected niche | All active, indexed channels with 10k+ | Newer (created 2024+) | Newer fraction |
| --- | ---: | ---: | ---: |
| AI & Machine Learning | 990 | 245 | 24.7% |
| History & Society | 1,588 | 357 | 22.5% |
| Gaming | 24,958 | 3,420 | 13.7% |
| Animation & VFX | 3,931 | 573 | 14.6% |

Among **80,139 selected channels** with 10k–99,999 subscribers, the source reports 11,928 newer and 68,211 older channels. Their reported medians were **146 versus 410 catalog videos** and **17,622 versus 10,474 average views per video**; median subscriber counts were **22,400 versus 26,300**. These are success- and activity-conditioned descriptive measures, not causal estimates of whether an older or newer *initially comparable* channel can grow. The article identifies its writer as a vendor AI strategist; the vendor's stated measurements have not been independently audited against raw data. Its article metadata says published September 27, with data queried September 28, 2026; do not imply an earlier query time.

In contrast, [vidIQ's September 2026 360-day niche cohort](https://vidiq.com/research/minecraft-roblox-small-creators/) follows **36,163 selected newer gaming channels** (age at baseline ≤365 days, below 1,000 subscribers, and meeting initial content/metadata filters). Endpoint ≥1,000 subscriber counts were **718/2,752 Minecraft (26.09%)**, **1,102/2,604 Roblox (42.32%)** and **4,977/30,807 other gaming (16.16%)**. The respective endpoint ≥10,000 counts were **75, 136 and 400**. These figures are conditional on a *different* provider's inclusion criteria, not the startup odds of all new creators and not a matched established-channel comparison. A channel account's age is not a creator's first upload or first professional activity.

**Do not pool these datasets.** TubeAI's composition is conditional on already reaching 10k subscribers and staying active; vidIQ's endpoint counts are conditional on vendor-indexed, initially small, eligible newer gaming channels. Even the gaming labels and age-selection definitions differ. The studies cannot determine a universal least-crowded niche, creator earnings, causal upload frequency, creator-exit rate, all-newcomer survival curve, or probability that a person launching a new channel will succeed. Those remain `null` in the machine record.


## Historical illustrative ad-income model by **disjoint subscriber tier** (2019)

[Rieder, Borra, Coromina and Matamoros-Fernández (2023)](https://journals.sagepub.com/doi/full/10.1177/20563051231180628) summarize a prior **2019 sample exceeding 36 million YouTube channels** and allocate a modeled **USD 8.25 billion annual creator advertising payout** from Google's USD 15 billion reported YouTube advertising revenue across subscriber-size groups using **view share as a proxy**. The resulting tier values are **assumed annual *means***, not actual payments, measured income medians, after-cost profit or forecasts for current creators.

| 2019 subscriber interval | Historical sampled channels | Authors' modeled mean annual ads income per channel (USD) |
| --- | ---: | ---: |
| Below 1,000 | 31,727,531 | **Not estimated** (modeled YPP share assigned 0%) |
| 1,000 to below 10,000 | 3,491,938 | $295 |
| 10,000 to below 100,000 | 769,472 | $2,058 |
| 100,000 to below 1 million | 138,284 | $16,346 |
| 1 million to below 10 million | 14,969 | $165,892 |
| 10 million or more | 517 | $1,707,446 |

The categories are **nonoverlapping** subscriber-count bins. The source's displayed view shares and modeled payout shares sum to **99.9% each** because of publisher rounding; do not silently normalize. The unreported modeled income in the first tier remains `null` rather than an observed $0. The 2019 subscriber-conditioned assumptions should **not** be read as evidence that every channel under 1,000 subscribers has no income, nor that 2019 conditions hold under later YPP policies.

Critically, the article also examines a **separate approximately 153,000-channel elite cohort** for linking and off-platform monetization. That elite-channel link sample is **not** the same as the larger historical channel-size model. This table cannot be joined with the **2026 vidIQ indexed channel snapshots**, AIR monetized-channel **RPM** studies, or CreatorIQ's paid **brand campaigns** into a time trend, net-pay calculation or representative typical income by size. Subscribers alone do not determine watch volume, ad placement, geography, expenses, eligibility or business ownership. The machine record stores explicit incompatibility and `null` for unverified 2019 payouts and present-day income.

