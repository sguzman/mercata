# IndieList v1.0: reviewless games are missing from the estimate, not verified zero sellers

**Reviewed October 29, 2026.** [Machine record](indielist-v1-reviewless-excluded-vs-zero-paid-sale-2026.json) · [synthetic estimator guard](../../site/steam-reviewless-estimator-denominator-guard.mjs) · [regression tests](../../tests/steam-reviewless-estimator-denominator-guard.test.mjs).

## Public model inputs and calibration limits

The operator publishes a [machine-readable v1.0 specification](https://indielist.games/methodology/sales-v1.json) and a related [human methodology](https://indielist.games/methodology). They are descriptions of **one vendor's model**, not independent evidence validating its outputs. The published formula starts with a Boxleiter **50** reviews-to-copies multiplier, adjusts it additively for release year, initial USD price, positive-review percentage, team size and genre keywords, and clamps it to **15–150**. The resulting modeled unit count is **reviews × adjusted multiplier**. The display range is always **0.6–1.4×** the midpoint: **this is a fixed heuristic band, not a calibrated confidence or prediction interval**. The vendor reports deterministic TypeScript/Python implementation parity but **not** ground-truth sale backtesting.

The spec's simplified net calculation is **units × list price × 0.85 × 0.96 × 0.70 = units × price × 0.5712**. These are assumptions for regional prices/discounts, refunds and platform share, **not** a historical tax or settlement ledger. It does not deduct publisher splits or all personal taxes and does not identify deposited proceeds, development costs, or profit.

## Missing review data must not become zero paid orders

The machine spec explicitly excludes **`titles_without_reviews`**. An eligible app with no public reviews does not produce a source-backed zero transaction count; indeed, those apps are **outside** the model's estimated-game frame. A pure synthetic estimator returning **null** for zero-review fixtures is therefore faithful to the published exclusion, even though the abstract formula could algebraically multiply zero by a multiplier.

Mercata's previous [Crazy City Golf report](crazy-city-golf-dayone-four-sales-wishlist-conversion-denominators-2026.md) records an **unauthenticated second-person report of four copies** beside a store snapshot with **no reviews**. This illustrates why an absence of reviews cannot certify zero orders. It is **not** independent verification of the four transactions and **not** a calibration example with authenticated financial records.

A sampled revenue distribution based on reviews can exclude both titles with actual purchases and zero-sale titles. Imputing every missing reviewless title as zero, or excluding them from a market-wide denominator without adjustment, can shift a zero-sale rate and median unpredictably. No direction or magnitude is justified without a complete cohort and matched real merchant sales.

## Reproducible illustrative arithmetic, without invented validation

The [synthetic guard](../../site/steam-reviewless-estimator-denominator-guard.mjs) accepts only explicitly labelled invented fixtures; tests check the additive factor boundary, the published net factor, and the null outcome for reviewless games. They **do not assert a model-accuracy rate** and never read real AppIDs, private partner histories or customer records.

**Still unknown:** true paid orders in reviewless games, model selection and interval calibration against actual merchant records, legal-publisher cash, the first-game income median, and the exact market fraction with no paid sale.
