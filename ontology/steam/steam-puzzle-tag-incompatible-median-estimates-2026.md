# Why two public Puzzle-game gross medians differ by more than sixtyfold

**Reviewed October 29, 2026.** [Structured comparison](steam-puzzle-tag-incompatible-median-estimates-2026.json) · [aggregate-only reconciliation guard](../../site/steam-incompatible-genre-medians.mjs) · [tests](../../tests/steam-incompatible-genre-medians.test.mjs). The two sources observe **different selected title populations with different estimator recipes**, not competing measurements of a single known Steam-wide Puzzle game median.

## Source A: a production database, not the historical full marketplace

The [October 14 IndiePilot report](https://indiepilot.dev/reports/steam-indie-revenue-analysis/) applies **reviews × 30 × current listed price** to **58,650** paid game rows in its own database with valid prices and review data. It reports a **$5,997 selected-sample lifetime gross median**, with P10 $280, P25 $1,076, P75 $46,926 and P90 $278,682. These are modeled snapshots accumulated by differently aged games, not permanent future lifetime results or verified publisher financial records. A current sample does not establish that half of *all future lifetime* paid Steam results fall below $6,000.

Its *Puzzle* user-tag group contains **1,473** titles with a reported **$151,347 modeled gross median**. The source does not publish a directly matchable AppID-level cohort demonstrating that its tag subset and inclusion rules equal another provider's.

## Source B: a substantially different Puzzle tag population and rank-sample method

The earlier [Immutable subgenre study](https://www.immutable.com/insights/steam-genre-revenue-benchmarks) cites **26,452 Puzzle-tagged titles** and **$2,390 estimated paid-only median gross**. It says medians are approximated from roughly **20 records around a tag's middle rank** in a licensed third-party model, with snapshot data collected September 10, 2026. Revenue medians exclude free titles although overall tag counts may include them. In contrast, IndiePilot's figures derive from its own filtered production database, a fixed 30-reviews multiplier and October 14 current prices.

The headline ratio **$151,347 / $2,390 ≈ 63.3** is arithmetic, not a measured sales difference for identical games, not an estimate of the effect of releasing a puzzle game, and not an indication that either provider can determine the other provider's actual sample selection bias. Game counts, paid status, review coverage, original release dates, game ages and definition of the *Puzzle* tag are not matched. Treating the two medians as interchangeable would conceal the largest uncertainty: **which population is the statistic actually about?**

## Economic boundaries

A paid first-game genre comparison requires a complete first-offer AppID frame, the same report horizon, stable genre classification, a comparable paid-only price treatment, authenticated checkout and refunds, and a legal-publisher and labor-cost denominator. A tag may belong to several communities; selected popular games may have a disproportionate share of tagged records.

The [synthetic arithmetic audit](../../site/steam-incompatible-genre-medians.mjs) accepts aggregate count and median fixtures, rejects real-looking account or AppID fields and returns null for any matched-population publisher median, causal genre effect, zero-order share or after-cost profit.

**Still unknown:** the true median received cash or profit for first-time Puzzle publishers, the exact zero-sale fraction, whether source cohorts overlap, and a representative paid 2D game median. No third-party raw dataset or private records were accessed.
