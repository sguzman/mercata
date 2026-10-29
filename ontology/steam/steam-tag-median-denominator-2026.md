# Steam tag-income medians: two different denominators and a modeled price proxy

**Reviewed October 29, 2026.** [Structured source summary](steam-tag-median-denominator-2026.json) · [model and denominator guard](../../site/steam-tag-median-denominator-guards.mjs) · [tests](../../tests/steam-tag-median-denominator-guards.test.mjs). This study reproduces **five brief published tag summaries**, not the third-party underlying catalog, transaction data or charts.

## A September 2026 modeled genre sample

[Immutable's September 23, 2026 benchmark](https://www.immutable.com/insights/steam-genre-revenue-benchmarks) describes a third-party estimate dataset pulled **September 10**, with reported median-revenue summaries for **107 of 108 tags** attempted. Its article displays 20 tags. The provider says its tag medians are read from roughly **20 games chosen near the ranked midpoint per tag**, rather than independent review of every game in the tag or licensed merchant receipts.

| Steam tag | Titles with tag in provider catalog | Reported modeled median copies (all titles) | Reported modeled paid-only median gross proxy |
| --- | ---: | ---: | ---: |
| 2D Platformer | 11,366 | 209 | $1,040 |
| Visual Novel | 12,646 | 1,140 | $10,300 |
| Dating Sim | 5,541 | 1,780 | $14,400 |
| Puzzle | 26,452 | 477 | $2,390 |
| Open World Survival Craft | 684 | 7,290 | $102,000 |

These are **provider model outputs for overlapping current-tag lists**, not observed paid-order medians, actual net game revenues, fixed-age launch cohorts or recommendations to build any one genre. Tags overlap; the same game can appear in Visual Novel, Adventure, Dating Sim and other categories. Prices, store ages, marketing costs and production labor are not comparable across these tags.

## The hidden numerator/denominator problem

The source's **median modeled copies** includes **free and paid** titles; its **median gross-revenue proxy** instead includes only **paid titles**. Furthermore the gross proxy is estimated copy volume multiplied by the *current* list price, not verified historical checkout totals. Dividing a reported revenue median by a reported copies median gives neither a realized sale price nor an unbiased median paid price. Even with identical records, **ratio of two medians ≠ median of per-game ratios**.

The source reports **56 of 107 tag medians below $5,000** and **81 of 107 below $10,000**; its $4,837 summary is the median **across tag medians**. That is not the median revenue of all paid Steam titles, because tag populations differ in size and overlap and the published middle-rank samples have different eligibility. A business decision cannot treat the $4,837 as a representative game-level gross distribution.

## Worked interpretation boundary

A reader may observe that the provider's Visual Novel tag reports **$10,300 modeled paid-only median gross** and its 2D Platformer tag **$1,040**. The roughly tenfold *difference between those published medians* does not imply that converting a platformer into a visual novel multiplies revenue by ten, that 2D games cannot earn anything, or that any one title would earn those amounts. Genre selection is confounded by scope, budget, publisher experience, price and overlapping tags.

The [deterministic QA helper](../../site/steam-tag-median-denominator-guards.mjs) validates the publicly quoted aggregates, preserves the **all-license copies vs paid-only revenue** distinction, and deliberately returns `null` for per-copy price, authentic merchant gross, publisher profit, and causal best-genre. The tests use only independent short numerical summaries; no source-level proprietary dataset or private Steamworks transaction has been rehosted.

**Remaining evidence gap:** a complete fixed historical originally-paid release AppID frame by tag and launch date (including removed and obscure titles), accurate paid transactions across checkout price/discount/region, publisher identities, costs and consistent observation horizons. Until that exists, genre-specific **net proceeds, after-cost developer profit, the paid release median and zero-order fraction remain unknown**.
