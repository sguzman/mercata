# Steam revenue models: snapshot drift, selective validation and low-end bounds

**Reviewed October 28, 2026.** [Structured evidence](model-validation-and-low-end-bounds-2026.json) and [deterministic bounds helper](../../site/steam-model-bounds.mjs). This checkpoint **does not** establish actual Steam paid orders or a representative median publisher income.

## The most consequential validation gap

[Gamalytic's own May 13, 2023 methodology](https://gamalytic.com/blog/how-to-accurately-estimate-steam-sales) discusses a self-collected sample of roughly **120** games with developer-disclosed unit totals. It **excludes games below 1,000 sales** from the stated model validation. This means its reported individual accuracy rates and aggregate accuracy cannot establish precision for obscure low-selling games or distinguish zero real sales from very small positive sales. Gamalytic's [definitions](https://gamalytic.com/about) differentiate owners, players and direct Steam purchase estimates, which are not interchangeable.

A method that matches aggregate sales can be poor at the median: a few extremely successful titles can dominate the total. Also, accuracy on games that disclosed sales figures does not guarantee accuracy on games that never did.

## October 2025 provides a broader—but incomplete—market snapshot

A [GamesRadar October 2025 article](https://www.gamesradar.com/games/over-5-000-games-released-on-steam-this-year-didnt-make-enough-money-to-recover-the-usd100-fee-to-put-a-game-on-valves-store-research-estimates/) reports the following provider-modeled metrics for **12,732** titles launched since January 1, 2025:

| Model-based reported outcome | Figure |
| --- | ---: |
| Releases in partial-year snapshot | 12,732 |
| Estimated gross revenue below $1,000 | 8,388 / 12,732 = **65.9%** |
| Fewer than 100 estimated copies sold | **47.4%** |
| More than $100,000 modeled gross | Approximately **8%** |

Another contemporaneous [October 23 report](https://gaming.news/news/2025-10-23/gamalytic-reveals-over-60-perc-of-games-released-this-year-havent-recouped-steams-100-registration-fee/) reports **12,875 titles** and **8,502 below $1,000**, around **66.0%**. Both describe the **same underlying Gamalytic estimator**. Dataset updates and snapshot timing can change the counts; they are **not independent cross-checks**.

Crucially, these are **partial 2025** all-game/monetization snapshots that may contain Free to Play titles. They are not final 2025 counts, all initially-paid premium games, exact zero orders or actual after-fee publisher profit. Neither comparison with a 2026 cohort nor a cash-survival claim is valid from these figures alone.

## A stronger January cohort still has unknown true zero sales

The [January 2026 GameDiscoverCo release-month model](january-2026-modeled-paid-release-distribution.md) lists **1,230** provider-defined paid Steam releases. [Egmatic's reanalysis](https://egmatic.com/blog/how-many-copies-does-the-median-indie-game-sell) reports 412 *modeled zero-copy results* among **1,211** with estimates, leaving **19 missing model estimates**.

Without guessing the missing values, the conditional model-zero fraction over 1,230 titles lies in:
`412/1230 ≈ 33.50%` through `431/1230 ≈ 35.04%`.

This is a partial-identification bound on **model output labels only**. It does **not** bound the real-world fraction of games with zero completed paid purchases. The true fraction can be anywhere from zero to all games in the absence of independently validated error constraints.

The [pure bounds helper](../../site/steam-model-bounds.mjs) checks that counts are consistent, computes within-snapshot percentages, and rejects merging mismatched provider-defined cohorts. Its test fixtures contain no real per-game data.

## Wishlist correlations are particularly weak evidence for tiny releases

The [VG Insights July 2025 wishlist report](https://vginsights.com/assets/reports/VGI_Wishlist_Report_July_2025.pdf) reports approximately **0.70** pooled correlation between launch wishlists and modeled first-month sales for a sample of **5,744** games. However, it filters games with **20 or fewer reviews**. Its separate charts show only about **0.17** correlation below **100,000 launch wishlists**, versus about **0.71** among titles above that threshold. These correlations concern selected games, not all tiny first releases; no causal intervention or low-end calibration is identified.

## What remains blocked

- A complete, dated originally-paid AppID panel including later-retired titles.
- Actual paid-order receipts for low-signal games, including zeros.
- Several **matched** release months, observed at identical 30/90/365-day horizons.
- Contractual developer royalties, labor, taxes and refund-adjusted net payouts.
- Truly held-out ground truth comparing multiple estimators on the same games.

**Status:** More substantial source data and explicit uncertainty boundaries, but no validated complete Steam median, zero fraction, paid purchaser total, actual seller cash or developer profits.
