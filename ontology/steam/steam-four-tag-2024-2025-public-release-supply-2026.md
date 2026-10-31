# Four contemporary Steam tags: reported 2024–2025 release supply, not paid sales

**Observed October 30, 2026.** [Machine-readable dated data](steam-four-tag-2024-2025-public-release-supply-2026.json) · [aggregate arithmetic checker](../../site/steam-tag-release-year-supply-audit.mjs) · [tests](../../tests/steam-tag-release-year-supply-audit.test.mjs).

The independent public [GameCharts release-year catalogue](https://charts.game/charts/releases) reported **17,393** Store-classified game releases for **2024** and **20,561** for **2025** when checked. Its tag-specific pages display the following *currently tagged release-year totals* for the same two years:

| Steam user tag | Tagged 2024 releases | Tagged 2025 releases | Count change | 2024 share | 2025 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| [Action](https://charts.game/trends/action) | 6,896 | 7,730 | +834 | 39.6% | 37.6% |
| [Simulation](https://charts.game/trends/simulation) | 3,926 | 5,138 | +1,212 | 22.6% | 25.0% |
| [Strategy](https://charts.game/trends/strategy) | 3,598 | 4,389 | +791 | 20.7% | 21.3% |
| [Puzzle](https://charts.game/trends/puzzle) | 3,853 | 4,374 | +521 | 22.2% | 21.3% |

This is **real provider-reported public aggregate supply evidence**, not copied AppID rows or an invented worked example. It illustrates an important contrast: Action and Puzzle both have **more** tagged releases in 2025 than 2024, while each occupies a **smaller share** of the faster-growing annual catalogue. Simulation and Strategy gained share as well as raw count. These are descriptive release-year comparisons, *not* evidence of genre-specific demand, conversion, expected sales, developer profit or the relative success of a first game.

## Denominator and chronology controls

GameCharts' [methodology](https://charts.game/trends/action) says **presently assigned Steam user tags** are projected backward to previously released games. Tags are not exclusive; a puzzle strategy simulation can count in multiple rows. The four tag counts must **never be summed into unique games**, even though each tag has a valid all-game release-year percentage. The independent tag pages refresh at different times; exact simultaneous overlap and unique unions would require AppID-level intersection data that this study deliberately does not import.

The site's public [release-count method](https://charts.game/charts/releases) dates games by their currently reported Steam release dates, removes demos, DLC, soundtracks and Coming Soon apps, and explicitly says its catalogue began on **October 19, 2026**. Games removed before that date may be missing. Steam user tags, current release dates and accessible catalog coverage can all drift after a historical launch. Its displayed 2025 total is also a mutable current-catalog observation, not a frozen official Valve historical cohort.

The dataset does **not** classify whether each game launched with a positive price, initially entered paid Early Access, later turned free, or was removed. It cannot produce a complete *originally paid* 2025 release universe or a trustworthy denominator for exact-zero paid copies. It also cannot establish paid sales, net legal publisher receipts, creation costs or a profitable genre strategy.

## Verification

The [pure aggregate audit](../../site/steam-tag-release-year-supply-audit.mjs) checks row uniqueness, year denominators, reported shares and comparative arithmetic without collecting any game, reviewer or partner records. It exposes changes per tag while explicitly returning `null` for unique tagged-game union, exact tag intersections, originally paid release counts, genre buyer transactions, representative author income and exact-zero paid-sale fractions.

**Next evidence gate:** join a rights-cleared original paid-launch AppID frame to versioned release tags, then to appropriately consented same-cohort financial reports. More current tagged titles alone cannot identify the most profitable niche for a newcomer.
