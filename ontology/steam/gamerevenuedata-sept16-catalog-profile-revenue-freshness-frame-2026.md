# GameRevenueData: 157,684 catalog entries are not 23,189 profiles or verified sales

**Reviewed October 29, 2026.** [Machine record](gamerevenuedata-sept16-catalog-profile-revenue-freshness-frame-2026.json) · [synthetic audit](../../site/steam-catalog-profile-freshness-guard.mjs) · [regression tests](../../tests/steam-gamerevenuedata-coverage-freshness-guard.test.mjs).

## Four separate denominators

The [GameRevenueData September 16 export manifest](https://gamerevenuedata.com/data-release.json) identifies **157,684 tracked catalog entries** and **23,189 published game profiles**, with release ID `2f12e765a2b53cdfdc72f190`. Profile pages thus represent **14.7% of tracked catalog entries**, not 14.7% of all historical paid Steam games, verified owners, completed orders or commercial success. These values are a *vendor data export*, not Steam's own exhaustive census.

Its per-profile metric-age classifications are stark:

| Profile field | Recent | Older than 48 hours | Observation age unknown | Total classified profiles |
| --- | ---: | ---: | ---: | ---: |
| Revenue | 0 | 20,371 | 2,818 | 23,189 |
| Concurrent players | 0 | 1,069 | 22,120 | 23,189 |

These counts **sum to the profile-page population**, not the 157,684 catalog entries. They do not establish revenue accuracy or actual purchases. The manifest says data came from **multi-query capture, not an atomic upstream snapshot**, and was exported **September 16, 2026**. An export's timestamp is *not* the observation time of every model input. A value collected before an export cannot be presented as live.

The [operator's methodology](https://gamerevenuedata.com/methodology/) distinguishes several more frames. The **Top Reviewed** ranking requires **100+ reviews**. A **revenue-eligible** model ranking requires **an estimate and 10+ reviews**. The **top 15,000 revenue-eligible games plus other ranked entries** receive dedicated published profile pages, whereas full catalog search covers titles without a profile; individual rankings display at most **1,000 rows**. This is layered selection, not four independent Steam game samples.

## Model money is not actual income

The site estimates unit ranges from Steam review counts and a variable Boxleiter multiplier. Gross approximates checkout spending after pricing/discount adjustment; modeled net subtracts estimated platform and other deductions. Its relative **0%–100% confidence indicator** is **not** a calibrated probability of accuracy. Lifetime-to-observation modeled amounts are not release-year earnings or bank cash, and the site's methods exclude delisted titles, DLC, other storefront purchases and in-app revenue.

Missing estimates do **not** represent zero merchant purchases. A game with no model, insufficient reviews, or no profile may still have real sales, while an unlisted/delisted title may be absent entirely. Dividing modeled income sums by any of the catalog, profile or ranking denominators cannot give a representative first-paid-game cash median, zero-sale fraction, or true payout distribution.

The pure [synthetic guard](../../site/steam-catalog-profile-freshness-guard.mjs) checks that reported metric-age buckets reconcile to a declared profile population, does not substitute the catalog count, and always returns **null** for real zero-sale outcomes or payout estimates.

**Unresolved:** eligibility-verified historical first-paid releases, merchant-complete paid-order counts including zeros, matched payment and refund ledgers, and representative legal-publisher profits.
