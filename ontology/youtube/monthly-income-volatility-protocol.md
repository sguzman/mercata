# Monthly creator cash-flow instability: observation protocol

**Reviewed:** 2026-10-25. Official source records already in Mercata: [YouTube's payment process](https://support.google.com/youtube/answer/14728151?hl=en), [AdSense payment timelines](https://support.google.com/adsense/answer/7164703?hl=en) and [account currency thresholds](https://support.google.com/youtube/answer/14727140?hl=en).

This work continues the [verified monthly creator cash-flow ledger](monthly-creator-cash-flow-protocol.md), not a new creator earnings survey. The ledger distinguishes finalized account credits, issued payments not yet received, cleared bank deposits, external receipts, paid expenses and hours worked.

## Why an apparent monthly 'income spike' may only be a payment delay

YouTube's ordinary payment process finalizes the previous month's earnings in the following month, generally on days 7–12, applies account threshold/hold tests by the 20th, and issues eligible payments around days 21–26. **Payment issuance is not bank clearance.** Smaller balances may roll into a later cycle. Therefore no cleared bank deposit in a particular month is not evidence of zero creator earnings, and a large deposit is not proof that the creator earned that amount from videos published that month.

The model distinguishes these monthly series:

| Quantity | Unit | Valid interpretation |
|---|---|---|
| Finalized net posted credit | Currency / calendar month | Account credit added after finalization, not contemporaneous content earnings |
| Cleared cash inflow | Currency / calendar month | Actual platform bank receipt + disjoint external receipts |
| Net monthly cash movement | Currency / calendar month | Cleared inflow less explicitly recorded paid refunds and cash expenses |
| Zero YouTube bank-receipt month | Count of months | No cleared deposit, which may coexist with positive credit |
| Longest no-payment streak | Consecutive months | Descriptive payment gaps, not a zero-income spell |
| Negative cash movement | Count of months | Spending exceeded cleared inflow, not necessarily accounting net loss |
| Inflow mean, median, population standard deviation and CV | Currency / month and ratio | Descriptive cash variability; CV is undefined if the mean inflow is zero |

## Cross-sectional dispersion is not a creator's own month-to-month volatility

A separate [2026 peer-reviewed Patreon dataset analysis](https://doi.org/10.1093/icc/dtag044), already registered in [Mercata's Patreon comparison](patreon-earnings-timeframe-2026.md), pools **23,435 observations of YouTube-affiliated Patreon creators** drawn from March 2018, March 2021 and March 2024. That selected frame reports **USD 250 mean**, **USD 47 median** and **USD 1,490 standard deviation** of **monthly Patreon revenue across those observations**. Creators without eligible Patreon earnings, certain multiple-affiliation creators and other missing populations are excluded.

The USD 1,490 standard deviation is **between observed creators and snapshots**, not a time-series standard deviation of one creator's monthly income. Three March snapshots spaced years apart do not provide the consecutive month-by-month earnings of identified individuals. Even the observed Patreon amounts are neither native YouTube payouts nor verified after-expense income. Dividing the pooled SD by the mean produces a valid statistic for *this pooled selected cross-sectional distribution*, but **not** a creator's individual temporal volatility or representative YouTube income risk.

The [cross-sectional guard](../../site/monthly-income-volatility.mjs) and regression tests distinguish these quantities. No observed owner-matched monthly income series exists here.

## Reproducibility and boundaries

Start with three or more consecutive months from a **single verified reporting-currency payment account**. Pass only the output of [the existing reconciler](../../site/monthly-creator-cash-flow.mjs) into [the volatility audit](../../site/monthly-income-volatility.mjs). The audit separately checks continuity, currency, two-decimal balances, and cash-flow identities. It compares nonnegative cash inflows with **signed** net cash movement, and distinguishes months with positive finalized credit but no cleared platform receipt. Results require explicitly entered account events; unknowns are never silently treated as zero.

A descriptive coefficient of variation is the population standard deviation of observed monthly *cleared inflows* divided by their strictly positive mean. It is not a risk forecast, a market distribution, a causal policy effect or an expected wage. Report missing eligible, held or pending payments separately if a complete operator record is available.

No creator payment account, real transaction, profit-and-loss statement or tax record has been accessed for Mercata. Synthetic fixtures in [tests](../../tests/monthly-income-volatility.test.mjs) validate arithmetic but are not observations. The [machine protocol](monthly-income-volatility-protocol.json) deliberately leaves median industry earnings, zero-earner fractions, creator profit and representative volatility **unknown**.
