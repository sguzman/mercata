# October 2026 Steam wishlist-to-sales survey: aggregate units versus matched conversion

**Primary:** Chris Zukowski, [“Wishlist inflation is real, but you still need them”](https://howtomarketagame.com/2026/10/13/wishlist-inflation-is-real-but-they-are-still-important/), October 13, 2026. **Numeric chart recap:** GameDev Reports, [“Steam Wishlists Now Convert to Sales Half as Well”](https://gamedevreports.substack.com/p/how-to-market-a-game-steam-wishlists), October 20, 2026. The primary article states the sampling frame and fit statistics in text; the units-per-wishlist values below are reported by the secondary recap of its charts and are not independently reconstructed from underlying transactions.

[Machine record](steam-voluntary-wishlist-ratio-2026-era-comparison.json) · [Consistency tests](../../tests/steam-volunteer-wishlist-ratio.test.mjs)

## Who submitted the data?

The primary study draws on **160 reader-submitted game reports**: **34** releases from 2020–2022 and **126** releases from 2023–2025. It excludes 2026 releases. Participants chose to respond; the study does not supply a complete Steam release frame, nonresponse weights, or an independent random assignment of games to the two eras. It therefore offers a conditional developer-volunteer observation rather than the contemporary Steam-wide median.

## The variable is a ratio, not a wishlister's purchase probability

The reported figure divides **total units sold across the observation period** by **the number of outstanding wishlists at launch**. Sales can come from customers who never wishlisted the game. It is not a count of unique wishlisters purchasing, and does not deduplicate owners, identify Steam accounts, or measure publisher cash.

| Cumulative total units per launch wishlist (reported) | 2020–2022 | 2023–2025 |
| --- | ---: | ---: |
| First month | 0.45 | 0.22 |
| First six months | 0.82 | 0.43 |
| First twelve months | 0.99 | 0.70 |

These are summary cohort statistics and cannot be applied as deterministic unit forecasts to a particular game. The reported month-one ratio is roughly 51% lower for the later voluntary sample, but differences in the sample's genre, budget, price, marketing exposure and release-age follow-up are not controlled causal effects. The original source's twelve-month completeness at the individual-game level was not independently verified.

## Forecast association does not disappear

The primary study also publishes these **in-sample** measures relating wishlist balance and **first-month unit counts**:

| Association | 2020–2022 | 2023–2025 |
| --- | ---: | ---: |
| R², log-log fit for total launch wishlists | 0.77 | 0.72 |
| Spearman rank correlation, total launch wishlists | 0.89 | 0.87 |
| R², log-log fit for last-30-day wishlist adds | 0.77 | 0.70 |

The author's pooled sample reports R² **0.73** for total wishlists alone, **0.72** for 30-day additions, **0.68** for seven-day additions, and **0.75** for total plus 30-day additions. That 0.02 within-sample gain is **not** an external test of forecast reliability. Neither a correlation nor an R² value provides a calibrated prediction range, causal attribution, or the probability that a specific wishlist owner buys.

The author's explanations for lower per-wishlist total sales, including easier wishlisting and more festival traffic, remain **hypotheses**, not identified causal mechanisms. This audit does not infer real 2026 per-game sales, true market conversion, median publisher receipts or profitability. It is separate from Steamworks' own matched wishlist cohort and purchase reporting.
