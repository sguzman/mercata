# Public Steam review milestones: measured, missing and incomparable

**Reviewed October 28, 2026.** [Structured snapshots](steam-public-review-milestone-coverage-bounds-2026.json) · [finite-population coverage guard](../../site/steam-review-coverage-bounds.mjs) · [tests](../../tests/steam-review-coverage-bounds.test.mjs). None of these counts is an authenticated paid order or a same-age first-release review cohort.

## A large missing-data problem

[GaugeDB's October 25, 2026 published snapshot](https://gaugedb.com/insights/steam-review-milestones) reports **155,467 games**, of which only **58,033** have a checked review count and **97,434** are unchecked. Its five disjoint checked categories are **1,677 with zero reviews**, **10,974 with 1–9**, **22,673 with 10–99**, **14,735 with 100–999** and **7,974 with at least 1,000 reviews**. These sum to the checked count.

The 12,651 checked games with fewer than ten reviews are **21.8% of checked games**, not a representative fraction of all games. If every unchecked game actually had ten or more reviews, the full-catalog fraction under ten would be only **12,651/155,467 = 8.1%**. If all unchecked games had fewer than ten, it would be **110,085/155,467 = 70.8%**. These are worst-case *logical bounds*, not a statistical interval. The executable helper verifies both denominators without silently treating missing as zero. Only **2,533 of 24,614** records associated with 2025 releases had checked reviews in this provider's snapshot.

## Different public rosters imply different 2025 fractions

[VideoGamesCritic's October 25, 2026 census](https://videogamescritic.com/findings/how-many-games-release-on-steam-each-year) lists **20,591 currently visible 2025 game releases**, with **10,374 at ten or more reviews**. That is **10,217 (49.6%)** below ten. It includes free-to-play, excludes removed games and uses public displayed release dates, which may describe exit from Early Access rather than first paid availability.

[steamlense's market release tracker](https://steamlense.com/stats/market) instead counts **17,651 paid-labelled plus 2,985 free-labelled 2025 releases**, or **20,636 total**, and reports **61.0%** below ten reviews. This differs by approximately **11.4 percentage points** from VideoGamesCritic. GaugeDB's 2025 catalog total is **24,614**, also different. The providers have not supplied an independently matched original-paid AppID roster with aligned release dates, review observations and delisting treatment. Their reported percentages cannot be averaged or called an economic time trend.

## What this research establishes

Current review totals are right-skewed and capture at least some titles with very little public attention. They do **not** identify 30-day review distributions for a fixed first-paid-release cohort, and they cannot demonstrate how many games sold zero copies. Distinct game AppIDs cannot substitute for distinct legal publishers, and review milestones cannot be converted directly into gross sales, net bank payouts or after-cost developer profit. The most important missing evidence is a verified historical paid-release denominator with comparable age and genuine transaction data. The result is an **observability audit** rather than an income estimate.

## A public game with an unaudited positive-sales report and no review summary — October 30, 2026

The [Crane Game Master case](steam-crane-game-master-five-reported-copies-reviewless-2026.md) records a first-person claim of **about five sales** on July 9 alongside a later official Steam listing displaying **“No user reviews”** on October 30. This is not a matched same-day measurement, nor is the label an audited exact review count. It reinforces the review-coverage denominator problem: missing public-review signals cannot be safely recoded as zero paid checkouts. The case contributes no representative income observation or zero-sales prevalence estimate.
