# Steam developer refund reporting: period rates versus purchase-cohort refunds

**Reviewed October 28, 2026.** [Structured definitions](refund-reporting-period-versus-purchase-cohort-2026.json). Official Valve reporting rules and synthetic examples; **no protected reports or player refund comments were accessed**.

Valve's [Developer Refund Reporting](https://partner.steamgames.com/doc/finance/refunds) describes a partner's package-specific **Refund Data** page showing week, month and lifetime views with unit counts, a rate, refund reasons and optionally written player feedback.

## The core denominator problem

Valve defines the published refund **period rate** as

\[ \text{Period refund ratio} = \frac{\text{units returned in period}}{\text{units purchased in period}} \]

The numerator can contain units **purchased earlier**. For instance, after a holiday sale ends, new weekly purchase volume can fall before refunds from the prior sale arrive. Valve explicitly warns of volatility around discounted weeks. This metric is **not** the probability that a randomly selected purchaser from a fixed launch cohort eventually requests or receives a refund.

**Purely synthetic example:** a prior week had 100 purchases. The following week has 4 new purchases and 6 returns from earlier orders. That week's period ratio would be **6/4 = 150%**, without implying 150% of the new week's buyers were refunded. If there were **zero** new purchases in a period, the ratio is undefined, not zero. The [synthetic rate guard](../../site/steam-refund-period-units.mjs) preserves this distinction; it does not estimate a game-specific real-world rate.

## What a purchase-cohort metric would require

To measure actual propensity to refund, define a paid-order cohort by a fixed original purchase interval and track its approved returns through a fixed follow-up horizon (for example 30 days), including late reversals and a transparent approach to censoring. A **same-week period count** and **same-buyer cohort outcome** are different methods, and neither can simply be equated to per-game profit.

[Valve's Reporting and Payments](https://partner.steamgames.com/doc/finance/payments_salesreporting) distinguishes near-real-time gross reports, which exclude deductions, from monthly reports that incorporate refunds, chargebacks and taxes. Refund-rate units alone cannot recover actual merchant net receipts, royalty shares, bank conversion or labor costs.

## Buyer comments are not public research records

The refund report also contains categorized customer reasons and optional written notes. Those come from the population who submitted a refund request; they do not form a random all-buyer sample. Such private comments may contain information unsuitable for publication, and **this study has not collected them**. Valve's documentation does not establish a representative mean, median or typical refund rate for Steam indie games.

**Blocked data:** complete consented paid cohorts, returns by original order, net merchant revenue, and any game-specific empirical rate. These remain unknown, not zero.

## First-year author example with ambiguous net accounting stage — October 30, 2026

The [RogueCraft first-year case](steam-roguecraft-firstyear-refund-net-stage-and-review-observation-2026.md) records one voluntary author report of 1,674 sold copies and 220 refunds, with an author-rounded 13.1% refund rate. The naive quotient 220/1,674 is approximately 13.14%, but **does not verify that all refund events belong to those same original purchase transactions**. Its $14,992 gross versus $11,888 source-defined net numbers likewise do not identify platform-share deduction, legal publisher bank remittance or after-labor profit. The source reports approximately one year after release; the official release and post dates are 371 calendar days apart. A [fictional arithmetic guard](../../site/steam-firstyear-selfreport-stage-guard.mjs) and [tests](../../tests/steam-firstyear-roguecraft-cash-stage.test.mjs) preserve those limits rather than pooling this case with distinct period-return metrics.
