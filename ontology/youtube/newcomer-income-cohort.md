# Measuring first-year YouTube creator income without survivor bias

**Snapshot: October 23, 2026.** This is a pre-measurement protocol, **not a completed income survey**. [Machine-readable protocol](newcomer-income-cohort.json). All proposed newcomer earnings estimates remain `null`.

## The target question

What are the revenue, cash profit and labor returns of people or creator businesses that **attempt to enter YouTube publishing during a specified enrollment window**? The denominator must include creators who never pass YPP review, never publish again, become inactive, delete their channel, or earn exactly zero. A survey of successful channels, or of creators already earning from another platform, cannot answer this question without a defensible sample model.

Study unit: one independently owned creator or creator business, with multiple channels reconciled under that unit for financial outcomes. Observation windows, geography, owner definition, follow-up duration and currencies are predeclared; they are *not presently measured*.

## Why the sources so far cannot provide a typical newcomer earning figure

- [AIR Media-Tech's 297-channel study](https://air.io/en/monetization/how-much-does-youtube-pay-after-monetization) starts **after YPP monetization**, excluding people who never qualify.
- [The 2026 Patreon-linked academic dataset](https://doi.org/10.1093/icc/dtag044) concerns selected Patreon earnings above a positive threshold, not native YouTube payouts or creator profit.
- [NeoReach's 2025 industry survey](https://neoreach.com/reports/creator-earnings-report-2025/) and [its partner publication](https://influencermarketinghub.com/creator-earnings-report-2025/) are **one underlying respondent dataset**, not two replications. Participants span multiple creator platforms.
- [Creator Spotlight's 2025 survey](https://www.creatorspotlight.com/p/monetization-report-2025) recruited engaged newsletter readers and is likewise cross-platform.
- [The Germany/Austria/Switzerland academic inequality study](https://doi.org/10.1162/EUSO.a.42) is currently indexed from an abstract/publisher summary; the full data construction and population definition are not verified.

These are useful bounded observations, but none supplies an all-new-entrant YouTube income distribution inclusive of zero earners.

## Minimum reproducible design

1. **Pre-register an entry event and cohort period.** Recruit independently of YPP success. A public YouTube search cannot by itself enumerate every new channel or new human creator, so the sampling frame and its omissions must be disclosed rather than presented as random.
2. **Follow everyone in the initial frame.** Record publishing, cessation, account closure, nonresponse and zero earnings; report attrition with original cohort denominators. Survivor-only analysis is a separate subgroup, not the population headline.
3. **Distinguish economics by base.** YouTube native payout, external sponsorship or product receipts, gross cash receipts, cash costs, before-tax net cash profit, and unpaid labor hours are different outcomes. Avoid double-counting revenue shares.
4. **Keep missingness distinct from zero.** `0` is an actual recorded zero; `null` means unavailable or inapplicable and needs a missingness code. Negative profit is possible even at zero gross revenue.
5. **Record sampling and uncertainty.** Recruitment, response and verification rates, statistical weights when defensible, country/period coverage, currency conversion and uncertainty methods accompany any eventual point estimate. Self-reports and independently documented account payouts must remain distinguishable.
6. **Publish aggregates only.** Do not commit private personal details, individual financial records or identifying respondent rows. Review data access terms and consent before analysis.

The [production cost instrument](production-costs.md) has categories for cash and work time, while the [country scope](geographic-scope.md) separates viewer and creator geography. They must be joined at the correct creator-business and period level before estimating hourly return.

## Explicit non-findings

There is currently no defensible median or mean native YouTube payout for a first-year entrant, no representative zero-earner proportion, no general first-year cash-profit distribution, no typical creator labor hours, and no verified country-by-niche comparative income distribution. The machine protocol preserves these as missing observations rather than replacing them with plausible-sounding numbers.

The research task can be called complete only after the specified sampling, evidence, missingness and uncertainty acceptance gates are met; writing the protocol alone is partial progress.
