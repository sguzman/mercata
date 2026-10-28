# Steam genres and the modeled median trap: 2D Platformer versus Puzzle

**Reviewed October 28, 2026.** [Structured comparisons](paid-genre-supply-and-model-comparability-2026.json) and [synthetic cohort compatibility helper](../../site/steam-genre-compatibility.mjs). This report compares two public *model-owner methodologies* rather than claiming access to real Steam order histories.

## Two credible-looking but incompatible Puzzle medians

[Immutable's September 23 model](https://www.immutable.com/insights/steam-genre-revenue-benchmarks) reads a median using roughly **20 titles around the middle of each tag's ranking**, across 107 tags. It uses public review-based copies and **today's** regular list price for approximate gross, without historic sales timing/discount or regional purchase mix.

| Immutable Steam tag | Tagged games in model | Modeled median copies | Modeled median gross |
| --- | ---: | ---: | ---: |
| 2D Platformer | 11,366 | 209 | **$1,040** |
| Puzzle | 26,452 | 477 | **$2,390** |

[Game Market Data's October 5 Puzzle analysis](https://gamemarketdata.com/genre/puzzle) instead selects **5,256** indie paid Puzzle releases **12–36 months old**, then models **first-year** gross using review-derived signals. Its modeled Puzzle median is only **$421**, versus **$552** across its broader **26,291-launch** paid indie sample. It models 185 Puzzle releases above $100,000 first-year gross, but those are **not authenticated payouts**.

These figures differ because one is a cross-age **tagged stock** with median-of-middle-ranks and current list price, while the other is a narrower **paid release flow** at fixed age and first-year horizon. The two “Puzzle medians” should **not** be plotted as a time trend, used as independent validation, or averaged.

## More sources do not automatically mean more truth

The [GMD method disclosure](https://gamemarketdata.com/method) identifies model version 0.9, roughly 26,291 indie paid launch records and review-derived estimates. Immutable says 81 of its 107 *tag* median estimates fall below $10,000 gross; that is not a count of 81 games or 81 publishers. Steam tags also overlap: a game might be Puzzle, 2D, Indie, Casual and Platformer at once, so adding all tagged game counts double-counts the same AppIDs.

Neither source independently certifies a complete historical initially-paid AppID frame, title-specific publisher royalties, consistent refunds/taxes/discounts, zero paid-order counts, or development labor. A tag with higher modeled gross may demand a much larger production budget and marketing commitment.

## A constrained comparison protocol

Before suggesting a profitable niche to a solo or small-team developer, match:

1. **Population:** originally paid base games, paid Early Access counted at first paid release, retired and zero-review titles included, F2P excluded or separate.
2. **Horizon and currency:** first 30/90/365 days matched from original commercial launch, regional/discount and tax treatment consistent.
3. **Tags and game identities:** mutually understandable taxonomy, multi-tag overlap quantified by AppID instead of summing tag populations.
4. **Costs:** team hours, art/sound, localization, QA, support and marketing by format/scope.
5. **Outcomes:** audited Steam gross units, refund-adjusted proceeds, net payment recipients and publisher splits where legally authorized.
6. **Selection:** games with no revenue model estimate remain in frame, not silently excluded.

The [compatibility checker](../../site/steam-genre-compatibility.mjs) refuses to combine incompatible genre medians and does not substitute model estimates for actual earnings.

**Economic conclusion:** two reported tag medians are descriptive third-party statistics for different populations. Neither supports a verified claim about the median net earnings or optimal genre for a new small studio.
