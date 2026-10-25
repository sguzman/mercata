# YouTube audience-scale crosswalk: monthly use, daily use and advertising reach

**Evidence reviewed October 24, 2026.** [Machine crosswalk](audience-population-crosswalk.json), [metric compatibility audit](../../site/audience-population-audit.mjs) and [tests](../../tests/audience-population-audit.test.mjs). These are separate published observations, not an inferred worldwide unique-user count.

## Surveyed past-month use is not global MAU

[DataReportal's April 2026 GWI global summary](https://datareportal.com/reports/digital-2026-mid-year-global-update-report) reports **55.3%** past-month YouTube usage among surveyed internet users age 16+ across its covered markets, including China and Russia. Its **70.6%** figure comes from a *different geographic base* excluding China and Russia. The smaller base has a higher rate; neither number is 55.3% or 70.6% of all humans, nor a platform-confirmed unique user count.

True deduplicated MAU would need coverage of registered, signed-out and shared-device viewers over a fixed monthly or rolling window, and meaningful cross-account deduplication. No platform-wide comparable person census was obtained. Creator-owner Studio rolling 28-day audience refers to one channel, not YouTube globally.

## The 2025 daily U.S. adult rate has its own denominator

[Pew's November 2025 release](https://www.pewresearch.org/internet/2025/11/20/americans-social-media-use-2025/) reports that **48% of U.S. adults** said they visited YouTube at least daily in a **February 24-March 2, 2025 survey of 5,123 U.S. adults**. Of that same adult population, **33%** reported several visits daily: this is a subset of the 48%, **not** a second group to add. Pew's separate 84% *ever-use* result came from 5,022 U.S. adults surveyed February 5-June 18, 2025. The daily-rate figure is not a server-measured U.S. DAU count or global DAU, and cannot be multiplied by a generic global resident total.

## Country-specific estimated advertising reach

DataReportal's [Mexico](https://datareportal.com/reports/digital-2026-mexico), [United States](https://datareportal.com/reports/digital-2026-united-states-of-america) and [Brazil](https://datareportal.com/reports/digital-2026-brazil) reports use Google's **late-2025 YouTube advertising-planner** estimates:

| Country | Ad-planning reach estimate | Unit |
| --- | ---: | --- |
| Mexico | 85 million | eligible addressable ad audience estimate |
| United States | 254 million | eligible addressable ad audience estimate |
| Brazil | 150 million | eligible addressable ad audience estimate |

These are neither confirmed monthly *active users* nor views or subscribers. Estimated reach may vary with eligibility, targeting, geography and algorithm updates, and cross-country totals have unverified overlap/coverage. No deduplicated global sum is made.

## What remains unknown

Worldwide distinct MAU, distinct DAU, deduplication of signed-in vs signed-out accounts and shared-device viewers, the distribution of paying/creating people, and cross-market reach under one population frame all remain **unmeasured**. Survey rates and ad-reach menu estimates are useful *bounded* evidence, but reporting them as MAU/DAU counts would invent a denominator and could mislead opportunity research.

## Seven dated U.S. adult ever-use observations (2018–2026)

The [2026 Pew social media historical fact sheet](https://www.pewresearch.org/internet/fact-sheet/social-media/) publishes successive U.S.-adult **ever-used-YouTube** survey percentages, not platform MAU or accounts. Missing YouTube years are not estimated.

| Survey closing date | Ever use | Survey collection mode |
| --- | ---: | --- |
| 2018-01-10 | 73% | telephone |
| 2019-02-07 | 73% | telephone |
| 2021-02-08 | 81% | telephone |
| 2023-09-05 | 83% | web / mail |
| 2024-06-10 | 85% | web / mail / phone |
| 2025-06-18 | 84% | web / mail / phone |
| 2026-06-18 | 84% | web / mail / phone |

No YouTube observation is published here for **2020** or **2022**. Pew's surveys used telephone through 2021, web/mail in 2023, and web/mail/phone from 2024 onward. The source's 2026 overall margin of error is ±1.8 percentage points, not a margin for older years or changes. Both **2025 and 2026 = 84%** are point estimates from different samples; they are not zero subscriber turnover, constant population size or measured platform active users. The machine register and [audit](../../site/us-ever-use-history-audit.mjs) enforce these limits.
