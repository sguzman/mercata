# Bounded income percentiles from a voluntary web-game survey

**Reviewed October 27, 2026.** [Structured respondent histogram](gamedevjs-2025-income-respondent-percentile-bounds.json). The [Gamedev.js 2025 report](https://gamedevjs.com/survey/2025/) and [report PDF](https://gamedevjs.com/dl/gamedevjs-survey-2025-report.pdf) give **435 answers** to Question 33 out of **445 total survey submissions**. The question measures self-estimated **annual income from game development**, from all game-development sources. It does **not** ask for seller receipts from itch.io.

| Income band | Percent of Q33 respondents | Cumulative rounded percent |
|---|---:|---:|
| No income from game development | 63.0% | 63.0% |
| Positive income below USD 1000 | 15.4% | 78.4% |
| USD 1k–5k | 5.3% | 83.7% |
| USD 6k–10k | 2.3% | 86.0% |
| USD 11k–20k | 2.3% | 88.3% |
| USD 21k–50k | 4.1% | 92.4% |
| USD 51k–100k | 5.3% | 97.7% |
| USD 100k+ | 2.3% | 100.0% |

Within the **respondent sample only**, the reported 63% at zero means p10, p25 and the median lie at **$0**. The 75th percentile is in the **positive but below $1,000** band. The 90th falls into the **$21k–$50k** bracket and the 95th into the **$51k–$100k** bracket based on the rounded histogram. These are bounded category results, not exact individual incomes. The report shows 2.3% of respondents in the $100k+ band.

## Strict population separation

The survey was self-selected, predominantly hobbyists, and asked about **all kinds of game-development income**. The report's different publishing-platform question had 439 answers, with 67.4% choosing *itch.io or similar* and 10.5% reporting no published projects. There is no individual-level link between those answers and the 435 income responses.

Therefore **63% is not an estimate of the fraction of itch.io games that make zero sales**, and the respondent median is not the median of paid itch.io seller profit. No compatible 2026 platform-wide merchant transaction frame, zero-sale eligible publisher census, paid sales denominators, game-specific labor costs, or probability inclusion weights are supplied.

The survey website describes publication in **December 2025** whereas the downloadable PDF says **January 2026**; Mercata records that discrepancy rather than asserting an invented unified date. What is supported is the December 2025 survey cohort and the self-reported income histogram.

This closes the limited **respondent zero-income and percentile evidence** tasks. Mean/median itch.io publisher earnings, its top-earner concentration, and paid-game buyer demand remain unknown.
