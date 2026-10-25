# Explicit uncertainty ranges for YouTube creator income scenarios

**Reviewed October 25, 2026.** [Machine range contract](niche-uncertainty-ranges-2026.json), [pure interval calculator](../../site/niche-uncertainty.mjs), and existing [point-input calculator](../../site/scenario.mjs). This is an uncalibrated *conditional sensitivity envelope*, not a measured prediction of any niche or creator.

## What the range means

For a given currency and time/format cohort, a hypothetical user must provide min/max assumptions for **watch-page eligible views**, **creator-side watch-page ad-only RPM**, **eligible Shorts engaged views**, **creator-side Shorts ad-only RPM**, **other net receipts**, **cash costs**, and **all creator labor hours**. No missing assumptions are filled by default. All 128 possible endpoint combinations are run through Mercata's already tested scenario model, and the minimum and maximum cash-profit and cash-profit-per-hour values are recorded.

The same content can have different revenue and cost exposures, and the endpoints may not be simultaneously attainable. The output is an **algebraic boundary over entered assumptions**, not a central forecast, probability of success, confidence interval, creator-wage quantile, or empirically justified worst case. If actual outcomes lie outside the assumed interval, that is not a statistical contradiction.

## Required accounting distinctions

- Official [YouTube Analytics metric definitions](https://developers.google.com/youtube/analytics/metrics) distinguish video events and engaged-view measures. Shorts raw play starts cannot be relabeled as eligible engaged views.
- [YouTube's revenue sharing documentation](https://support.google.com/youtube/answer/72902?hl=en) concerns program-specific creator-side revenue units, not gross advertiser CPM or a guaranteed per-view rate.
- Other net receipts must not duplicate a combined RPM's included Premium, subscriptions or Shopping revenue. Rights claims, refunds and issued/cleared cash remain distinct.
- Creator work hours must be strictly positive to calculate an hourly ratio; abandoned attempts belong to the labor scope, and a modeled time value is **not** a cash payment.
- Paired data need explicit period, currency, geography, video format, monetization eligibility and access basis. Do not pool observations across incompatible samples.

## Acceptance status

The range arithmetic is executable and regression-tested, including negative cash profit, mixed minimum/maximum labor, zeros, disallowed fractional view counts and identical min/max endpoints. **No actual creator receipt, revenue rate, cost, hour, conversion probability or niche success distribution was supplied.** Accordingly the published data has all input bounds `null` and publishes no numeric hypothetical default or ranked niche.

The existing [opportunity assessment](opportunity-framework.md) remains unranked, and the [evergreen search protocol](evergreen-search-window-protocol.md) remains an unexecuted proposal rather than assumed recurring income.
