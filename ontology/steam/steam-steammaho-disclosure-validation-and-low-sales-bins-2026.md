# SteamMaho disclosure-based estimates: sales/review calibration and selection bias

**Public source:** [SteamMaho, Every forecast, graded](https://steammaho.com/reports/scorecard), accessed October 29, 2026. The operator maintains owner-count estimates, review multipliers, and a public list of games with disclosed sales. **This is the operator's own scorecard**, not an independent audit of its merchant records or a probability sample of all paid Steam releases.

[Structured snapshot](steam-steammaho-disclosure-validation-and-low-sales-bins-2026.json) · [cohort and interval guard](../../site/steam-model-disclosure-validation.mjs) · [synthetic checks](../../tests/steam-model-disclosure-validation.test.mjs).

## Three different samples are not one denominator

| Operator-reported analysis | Cases | Reported result |
| --- | ---: | --- |
| Recent disclosures within 120 days before September 2, 2026 | 32 | 17 estimates within ±50%; 11 within ±30% of disclosed units |
| Review counts matched to sales-disclosure date | 132 | 79 estimates within ±50% |
| Calibration of typical sales per contemporaneously observed review | 230 | Six sales-size bins; only 16 disclosures below 1,000 units |

The operator reports typical estimate/disclosure ratios of **0.95×** for the 32 recent observations and **0.91×** for the 132 date-matched cases. These figures use **disclosed game sales units**, not audited Steam settlements or publisher take-home pay. It does not establish how the three samples overlap, so adding the sample sizes or combining the accuracy percentages would be invalid.

## Low-selling disclosures are scarce

Of the 230 sales-size-binned disclosures, **16** fall below 1,000 reported sales. The source publishes typical sales per review by reported sales band:

| Reported sales band | Cases | Typical copies per review |
| --- | ---: | ---: |
| Under 1,000 | 16 | 9.9 |
| 1,000–9,999 | 52 | 31.8 |
| 10,000–49,999 | 34 | 56.8 |
| 50,000–99,999 | 25 | 63.2 |
| 100,000–999,999 | 60 | 51.7 |
| At least 1,000,000 | 43 | 41.1 |
| **Total** | **230** | Not a common global multiplier |

The measured differences show why a single reviews-to-sales multiplier is unstable, especially toward the low end. **However, selecting the multiplier using a game's true sales-size band is circular when true sales are precisely what an external estimator cannot observe.** A model would need a separately validated rule to assign a band from pre-existing, independent signals. The 16 low-sales disclosures cannot constrain a Steam-wide zero-paid-order proportion; the study does not enumerate a complete population with zero reviews or no sales.

## Conditional validation and distinct outcome types

A game owner/model operator chooses its evaluation sample; publicly disclosed outcomes and games with recorded reviews differ from games that launch and disappear without either. Even a correctly date-matched disclosure may be self-reported rather than an independently authenticated financial export. Neither the 17/32 nor 79/132 result is a marketwide accuracy guarantee or a calibrated cash-income interval.

The same page also maintains an **entirely different week-one peak concurrent-player prediction** scorecard. A forecast band that captures observed player peaks has not thereby predicted **paid units, revenue or publisher net receipts**. The helper rejects any input asserting these false equivalences and keeps actual zero-sale fraction and net publisher incomes explicitly unknown.

No customer records, private studio data or underlying model dataset were imported. The numerical assertions are short independent summaries of the public provider's self-described evaluation.
