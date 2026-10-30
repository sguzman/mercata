# October 29, 2026 review-based Steam gross revenue model: denominator audit

**Source:** [The Steam Revenue Report](https://weloveit.io/developers/steam-revenue-report/), by WeLoveIt.io / Totally Human Media and collaborators. Observed October 29, 2026. The source describes a continuously refreshing public estimator, **not** Valve financial or publisher bank data. This note freezes the values visible at review, not the site's future values. [Machine record](steam-weloveit-review-revenue-snapshot-2026.json), [reproducible count audit](../../site/steam-weloveit-review-coverage.mjs).

## What the reported catalogue actually measures

| Public category | Reported listings | Included in priced, reviewed revenue model? |
| --- | ---: | --- |
| Priced game with at least one review | 103,682 | Yes |
| Paid game with zero reviews | 9,227 | No reliable sales estimate; **not a zero-sale observation** |
| Free game | 19,156 | No upfront price-derived gross |
| No published price in the source | 10,732 | No; not automatically originally free |
| **Total game catalogue** | **142,797** | Not a complete initially-paid Steam release cohort |

Those four published categories add to the reported total. Among **112,909 explicitly priced games in these reported categories**, 9,227 (approximately 8.17%) are below the review model's observation floor. That fraction is a **coverage shortfall**, not an observed zero-sales percentage. The report also describes 366 listings priced above $120 as excluded. Because the relationship of that separate exclusion to the four-category partition is not explicit, those 366 must **not** be subtracted again or counted as a fifth disjoint category.

The source excludes non-game software, adult-only titles and unreleased entries. It lacks a rights-cleared, complete list of all initially paid base-game AppIDs, their original paid release dates, full retirement/transfer histories and verified sales outcomes.

## The estimates and what cannot be inferred

The page's October 29 headline **USD 3,493 median lifetime earnings** and **84.5% share of estimated gross revenue attributed to the top 1%** are **model outputs**, not ledger findings. Its revenue method multiplies reviews by assumed sales per review (default **35×**, selectable **20×** and **50×**) and uses current US list prices rather than historical actual checkout prices. The page acknowledges discount, regional price, DLC, bundles, review propensity and different release ages as error sources.

A key unresolved publication detail: although the displayed measured count explicitly requires a price and at least one review, the headline median refers more broadly to “paid games.” The page does not independently specify whether the 9,227 reviewless paid listings are included in that median's exact rank denominator. Therefore Mercata records the displayed median without assigning an unverified denominator or treating it as an observed cash statistic.

The 84.5% modeled concentration share does not measure seller payouts, developer profit, first-year gross revenue, or a fixed 30/90/365-day original paid-release cohort. Uniformly changing the model multiplier cannot validate the review-to-sales ratio; the concentration share may remain invariant while every estimated dollar amount changes. Release years are not necessarily first paid playable Steam release dates, and 2026 titles have less time to accrue reviews.

## Practical acceptance gate

Use this source for **method-comparison and selection-bias research only**. Do not infer exact no-sale shares, representative publisher earnings, real revenue concentration or take-home cash from its modeled estimates. Genuine income analysis still requires a qualified originally-paid release population with retained zero-review and delisted titles, per-title financial permissions, release-aligned horizons, package attribution and transfer reconciliations. No private transaction data or financial access keys were used.
