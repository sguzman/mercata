# YouTube long-form advertising: gross-to-net worksheet, with missing terms preserved

**Verified:** 2026-10-25. Sources: YouTube's [partner earnings overview](https://support.google.com/youtube/answer/72902?hl=en), the official [Analytics API metric dictionary](https://developers.google.com/youtube/analytics/metrics) and [reports.query currency parameter](https://developers.google.com/youtube/analytics/reference/reports/query), the [mid-roll placement rules](https://support.google.com/youtube/answer/6175006?hl=en), and [payment timing rules](https://support.google.com/youtube/answer/7164703?hl=en). This is a public rules and **symbolic accounting** study. It is not a channel-owner Analytics export or observed creator income.

## Contractual watch-page share

With accepted Watch Page Monetization Module and applicable eligible content, YouTube states the contractual share is **55% of eligible net watch-page advertising revenue**. Define `E` = that *eligible net* base, `C = 0.55 × E`. The published advertiser metric `grossRevenue` is **not** `E`: it has a different gross accounting definition, sale coverage and potential rights adjustments. Without `E`, both the bridge `grossRevenue → E` and the resulting `C` must remain **unknown**. Applying 0.55 to gross-revenue reports is therefore invalid.

## Official reporting metrics and denominators

| Official metric | Unit and coverage | May it alone estimate actual creator pay? |
|---|---|---|
| `grossRevenue` | Gross advertising revenue (USD by default, or API-requested currency); Subject to month-end adjustments and excludes partner-served ads; not the contractual eligible-net share base. | No |
| `estimatedAdRevenue` | estimated creator net google sold ads; Reported creator net after applicable ownership/revenue-share adjustments, Google-sold only, not gross ads or actual bank funds. | No |
| `estimatedRevenue` | estimated creator total net platform revenue; Includes non-ad revenue, may contain estimatedAdRevenue and Premium components; do not add those again. | No |
| `estimatedRedPartnerRevenue` | estimated creator premium revenue; Estimated Premium allocation, not gross subscription receipts; may be included within estimatedRevenue. | No |
| `adImpressions` | verified ad impressions; A single monetized video playback can have multiple ad impressions. | No |
| `monetizedPlaybacks` | playbacks with at least one ad; Can include a viewer who saw a preroll ad but exited before the actual video began; API reports expected +/-2% error. | No |
| `cpm` | Gross per 1,000 ad impressions (USD default, or API-requested currency); Advertiser gross, not creator RPM or watch-page eligible net. | No |
| `playbackBasedCpm` | Gross per 1,000 monetized playbacks (USD default, or API-requested currency); Monetized-playback denominator differs from ad impression denominator and raw public views. | No |

`estimatedAdRevenue` is already an *estimated creator net advertising* metric, not the input to another 55% reduction. `estimatedRevenue` aggregates Google-sold ads **and non-ad creator products**, so adding `estimatedAdRevenue` or Premium's `estimatedRedPartnerRevenue` to it would count part of the same money twice. Ads sold/served outside those metrics require their own records. Currency, account authorization, report time window, rights and scope must match before any comparison.

A `cpm` value is **gross currency per 1,000 verified ad impressions**; `playbackBasedCpm` is gross currency per 1,000 monetized playbacks. The reporting API defaults monetary outputs to USD but supports an explicit `currency` parameter for both of these, `grossRevenue`, `estimatedRevenue`, `estimatedAdRevenue`, and `estimatedRedPartnerRevenue`. Converted figures use exchange rates that can change daily. Record the actual query currency; do not assume its value is the creator's payment-account currency or an observed conversion fee. A single monetized playback can serve multiple ad impressions, while a playback with an ad can be counted even if the video itself never begins. Neither denominator equals a raw public video view or unique viewer.

## Ad-slot and settlement limits

YouTube allows mid-roll opportunities on an **eligible monetized video at least 8 minutes long**, with manual, automatic or combined slots. A slot does **not** guarantee any actual ad; YouTube determines serving. Subsequent finalized AdSense for YouTube balances, holds, taxes, payment issuance and bank arrival are **distinct** from the hypothetical revenue share and from estimated Analytics earnings. Follow the [existing monthly cash-flow protocol](monthly-creator-cash-flow-protocol.md) instead of inventing deposits.

## Accepted hypothetical worksheet

The [pure rule evaluator](../../site/watch-page-ad-accounting.mjs) accepts an **explicitly identified hypothetical eligible net revenue base** with matching currency, date window and eligibility conditions, returning `0.55 × eligible net` with **actual payout and profit null**. It rejects an advertiser gross-revenue input masquerading as eligible net, or a rights-ineligible video, and never fills unknown values with zero. The [regression tests](../../tests/watch-page-ad-accounting.test.mjs) cover these distinctions. No numerical example is presented as empirical creator earnings.

[Machine metric and policy record](watch-page-ad-accounting.json). Remaining gaps: observed eligible net base by video/channel, gross-to-eligible-net reconciliation, creator costs, signed rights splits, finalized and cleared payments.
