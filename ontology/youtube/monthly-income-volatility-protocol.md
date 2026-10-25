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

## Reproducibility and boundaries

Start with three or more consecutive months from a **single verified reporting-currency payment account**. Pass only the output of [the existing reconciler](../../site/monthly-creator-cash-flow.mjs) into [the volatility audit](../../site/monthly-income-volatility.mjs). The audit separately checks continuity, currency, two-decimal balances, and cash-flow identities. It compares nonnegative cash inflows with **signed** net cash movement, and distinguishes months with positive finalized credit but no cleared platform receipt. Results require explicitly entered account events; unknowns are never silently treated as zero.

A descriptive coefficient of variation is the population standard deviation of observed monthly *cleared inflows* divided by their strictly positive mean. It is not a risk forecast, a market distribution, a causal policy effect or an expected wage. Report missing eligible, held or pending payments separately if a complete operator record is available.

No creator payment account, real transaction, profit-and-loss statement or tax record has been accessed for Mercata. Synthetic fixtures in [tests](../../tests/monthly-income-volatility.test.mjs) validate arithmetic but are not observations. The [machine protocol](monthly-income-volatility-protocol.json) deliberately leaves median industry earnings, zero-earner fractions, creator profit and representative volatility **unknown**.
