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
