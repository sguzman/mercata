# January 2026 model-zero estimates: missingness bounds

**Reviewed October 28, 2026.** [Structured sensitivity record](january-2026-modeled-zero-missingness-2026.json). This is a transparent arithmetic check on a public **modeled** sample, not a claim about zero completed Steam purchases.

The [October Egmatic analysis](https://egmatic.com/blog/how-many-copies-does-the-median-indie-game-sell) of [GameDiscoverCo's January 2026 release-month model](https://newsletter.gamediscover.co/p/is-the-game-biz-sustainable-for-the) describes **1,230** paid-game release entries. Copy estimates were available for **1,211**, of which **412** carried a zero-copy model result. That leaves **19 missing estimates** under this particular tabulation.

| Denominator and missing-data treatment | Modeled-zero entries | Percentage |
| --- | ---: | ---: |
| Among **available estimates only** | 412 / 1,211 | **34.02%** |
| Among **all listed games**, assuming no missing entries are modeled zero | 412 / 1,230 | **33.50%** |
| Among **all listed games**, assuming every missing entry is modeled zero | 431 / 1,230 | **35.04%** |

So the all-listed-game modeled-zero share is bounded between **33.50% and 35.04%**, **conditional on the existing sample and estimator**, and only if the missing cases can be assigned a zero/nonzero modeled output. A [synthetic calculation guard](../../site/steam-modeled-zero-bounds.mjs) checks the arithmetic and missing-data handling.

**This is not an interval for the real zero-sales rate.** A modeled count rounded to zero can still conceal a real purchase; the source cohort may omit some delisted or otherwise invisible historical paid games; and game releases are not legally deduplicated publisher enterprises. None of these errors is accounted for by allocating just 19 missing estimates.

**Results:** reproduced a bounded sensitivity calculation over reported aggregates without retrieving any raw rows. Real paid orders, real zero-sale AppIDs, publishers with no revenue, and developer after-cost profits remain unknown. The study [complements the previous full-month distribution report](january-2026-modeled-paid-release-distribution.md).
