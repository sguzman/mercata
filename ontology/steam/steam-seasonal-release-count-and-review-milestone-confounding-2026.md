# Steam release-month seasonality: volume and review milestones without causal claims

**Reviewed October 29, 2026.** [Source-linked structured snapshot](steam-seasonal-release-count-and-review-milestone-confounding-2026.json) · [pure measurement guard](../../site/steam-seasonal-observation-guards.mjs) · [tests](../../tests/steam-seasonal-observation.test.mjs).

The public [steamlense market chart](https://steamlense.com/stats/market) provides **108,969** tracked releases aggregated by calendar month **across years since 2015**, alongside the proportion eventually reaching **50+ reviews** as of the current snapshot. This is real descriptive *catalog and review* evidence, but **not** a first-week or first-month paid sales cohort.

## The quietest month is not the same as the best launch opportunity

| Release month | Catalog releases across years | Games reaching 50+ reviews, % |
| --- | ---: | ---: |
| Jan | 7,318 | 24.4% |
| Feb | 7,972 | 24.4% |
| Mar | 8,882 | 24.4% |
| Apr | 8,593 | 26.0% |
| May | 9,087 | 24.8% |
| Jun | 8,321 | 23.3% |
| Jul | 9,264 | 22.6% |
| Aug | 9,646 | 24.1% |
| Sep | 9,323 | 25.9% |
| Oct | 10,685 | 24.1% |
| Nov | 10,255 | 23.5% |
| Dec | 9,623 | 21.5% |

The busiest month in this provider frame is **October (10,685)** and the quietest is **January (7,318)**: October has roughly **46.0% more listed releases**. Yet their reported reach of **50 reviews** is very similar (**24.1% October; 24.4% January**). April (26.0%) versus December (21.5%) produces the widest displayed month-to-month difference of **4.5 percentage points**.

These are not adjusted treatment effects. The annual age mix, paid versus free status, genre, changes to the platform, launch marketing budgets, review accumulation windows, partial 2026 coverage and missing historical retired games are not controlled. A review milestone accumulated *by today* is not a fixed 30-day outcome. Percentages are rounded to one decimal place; exact milestone event counts cannot be recovered by simple multiplication.

## No verified effect on paid buyers or creator income

The **source's month-of-year review reach** is a descriptive comparison across heterogeneous products. It does **not** establish that moving a specific game to January, April or October changes its chance of being purchased, earning royalties, gaining followers or becoming profitable. It would be particularly unsound to subtract these monthly review percentages and describe the result as a causal launch timing effect.

The [companion test helper](../../site/steam-seasonal-observation-guards.mjs) confirms that the twelve monthly counts sum to the reported frame and reproduces the release-count and review-rate range. Its revenue, early-review, exact review-count and causal outputs remain **null**.

A credible timing study would match eligible **originally-paid** AppIDs, release years, genres and actual available launch dates; account for promotions and major competitor launches; compare same-length review and paid-order windows; and use authorized orders/costs if reporting actual seller proceeds or ROI.

**Current result:** the cross-year monthly **catalog** and visible **review threshold** variation is now quantified. The market-wide first-game sales effect of launch month, representative Steam monthly publisher earnings and zero-sale fraction remain unknown.
