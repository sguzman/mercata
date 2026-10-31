# Selected Steam launch days: modeled near-zero outcomes are not zero paid orders

**Reviewed October 31, 2026.** [Structured aggregate record](steam-selected-launch-day-low-signal-panel-audit-2026.json) · [read-only aggregate arithmetic audit](../../site/steam-selected-launch-day-low-signal-audit.mjs) · [regression tests](../../tests/steam-selected-launch-day-low-signal-audit.test.mjs).

## Three public, explicitly selected release-day observations

Two retrospective analyses by one author use [Gamalytic's published estimator methodology](https://gamalytic.com/blog/how-to-accurately-estimate-steam-sales), not developer-verified Steam partner sales, and independently selected launch dates. A third author groups currently visible reviews, which is a **different measurement**.

| Public account | Selected release days | Approximate outcome age | Reported game entries | Low-signal bin | Within-sample share |
| --- | --- | --- | ---: | ---: | ---: |
| [June 2025 analysis](https://www.reddit.com/r/gamedev/comments/1lfd9z6/i_analyzed_every_steam_game_released_in_a_day/) | June 2, 2025 | 16 days | 53 | 13 “zero or almost zero” **estimated copies** | **24.5%** |
| [June 2026 analysis](https://www.reddit.com/r/gamedev/comments/1vyumii/i_analyzed_every_steam_game_released_in_a_day_and/) | June 3–4, 2026 | About 30 days | 67 | 35 “zero or almost zero” **estimated copies** | **52.2%** |
| [July 2026 review snapshot](https://www.reddit.com/r/gamedev/comments/1vyuxgl/i_analyzed_every_steam_game_released_on_july_21/) | July 21, 2026 | About 30 days | 69 author-identified paid titles | 24 titles with **fewer than 10 public reviews** | **34.8%** |

The first author reports five coarse category counts that add to 53 in 2025 (13, 18, 10, 10, 2) and 67 in 2026 (35, 6, 13, 7, 6). The second author reports four review bands adding to 69 (24, 26, 11, 8). The original author called 35 out of 67 **53%**, but the independently recomputed result is **52.24%**, conventionally **52%** to the nearest integer. Mercata preserves the original 35/67 counts and flags the rounding discrepancy rather than silently endorsing a number.

## Why these percentages are not a Steam zero-sale rate

**The 2025 and 2026 modeled groups are not an observed sales ledger.** Their first bin covers “zero **or almost zero**” copies. It cannot distinguish zero from one or more sales, a failed revenue estimator, regional keys, free grants, unreported purchases, or zero developer receipts. Gamalytic's public [method discussion](https://gamalytic.com/blog/how-to-accurately-estimate-steam-sales) states its chosen disclosed-sales validation excludes titles under 1,000 copies; that makes model performance in the weakest-release tail particularly uncertain. The author-selected days were chosen for perceived indie launch density, not randomly sampled across every Steam release date.

**The 69-game July panel is a review metric, not the same near-zero sales estimator.** Fewer than ten reviews can accompany many paid orders; zero reviews is not verified zero sales. The author says the releases were paid, but this source does not authenticate the complete original paid-launch AppID frame, withdrawn titles or transaction records.

**Cross-year arithmetic is not a trend.** Comparing 24.5% (June 2025) and 52.2% (June 2026) as though they measured the same game population is invalid: one day versus two, 16-day versus about 30-day follow-up, subjective date choice and opaque third-party estimates. The July panel observes public reviews, so its 34.8% cannot validate or contradict either near-zero-sales percentage.

The June articles' income-oriented bucket labels should not be mistaken for Steam Direct fee recoup or a developer wage. [Valve's Steam Direct fee documentation](https://partner.steamgames.com/doc/gettingstarted/appfee?language=english) ties the separate $100 fee recoupment to **$1,000 adjusted gross revenue**, not to a third-party modeled gross revenue interval, and partner take-home income requires taxes, returns, share, royalties and costs.

## Research implications

The [validator](../../site/steam-selected-launch-day-low-signal-audit.mjs) checks exactly the published integer bucket totals, distinctive release dates, metric type and arithmetic discrepancy. It refuses raw AppIDs, reviewer identifiers and invented purchaser records, and always returns `null` for an actual marketwide zero-sale fraction, pooled rate, year-over-year change, originally paid release census and publisher profit.

**Status:** three linked public research posts, two using one underlying estimate vendor but different selected games. No actual paid-order rows, developer financial exports, authentic launch-time paid status, game-level reviewer records or complete releases census collected. The categories document low-signal *selected samples*, not an exact-zero publisher or AppID distribution.
