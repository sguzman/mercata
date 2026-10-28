# First games, external publishers and the winner-only cohort problem

**Reviewed October 28, 2026.** [Structured results](debut-studios-publisher-selection-and-breakouts-2026.json). Three public datasets illuminate different aspects of Steam publishing, but none measures the average new publisher's profit.

## First games are disproportionately common

[PlayRecon's Steam release trends](https://app.playrecon.com/trends) group studios by the **names shown on store pages**. In an October 2026 snapshot about **77% of observed studio-name groups have shipped only one dated game**; around **65% of the tracker’s 2026 releases belong to first-observed studios**. Among those that did release again, the reported median gap was **203 days**. These observations cannot establish that 77% of studios ultimately fail: younger studios have had less time to ship a second title, while store labels are not canonical contracting entities.

The tracker reports roughly **13 median reviews** for a studio's first observed game, **22** for its second, and **36** for its fifth. The apparent improvement is *not a causal experience premium*—studios making five releases are survivors in a different population from all first-release studios.

## A publisher relationship is not a randomized treatment

For releases in the preceding three years, PlayRecon displays roughly **25 median reviews** for externally publisher-backed titles versus **6–7** for self-published titles. A publisher may choose unusually promising projects, invest in marketing, or release into different genres. Consequently, the difference **cannot be translated into publisher-attributable paid sales, contract ROI or developer net income**.

PlayRecon's [metric definitions](https://app.playrecon.com/help/metrics) make clear that review counts and missing chart rankings are *not actual paid orders*. Its [dataset notes](https://app.playrecon.com/help) describe public store-page coverage, rather than a complete historical paid-releases ledger. Values are rounded because the tracker recalculates its store-name populations.

## The exceptional breakout tail is a different study

[Sensor Tower's October 2026 comparison](https://develop.sensortower.com/blog/indie-and-new-ip-break-out-without-denting-aaa) selects **games estimated to sell 500,000 or more paid units within 30 days**, across **Steam, PlayStation and Xbox**.

| Success-selected model population | Sep 2024–Aug 2025 | Sep 2025–Aug 2026 |
| --- | ---: | ---: |
| Breakout games | **55** | **76** |
| Indie-classified breakout games | **13** | **33** |

Sensor Tower also identified **40 new-series games** among the 76 later breakouts. New *series* is not the same as a studio's first game. The results demonstrate modeled growth in high-selling PC/console titles under this definition; without the full Steam-only paid-release denominator, they cannot quantify the probability that an ordinary new Steam game succeeds.

## Professional workers are not a publisher census

The [2026 GDC State of the Game Industry summary](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/) describes more than **2,300 respondents** spanning different professional jobs, including marketing and executives. It notes **28% of surveyed developers** were developing or optimizing for Steam Deck. These are descriptive industry-survey findings, not independent evidence of income for all game publishers.

## Research inference boundary

The [Jan 2026 1,230-game Steam-only modeled launch cohort](january-2026-modeled-paid-release-distribution.md) cannot be pooled with a cross-platform **500k+** survivor cohort or with survey participants. Their platform scope, release windows, unit (AppID/studio/person), modeled-versus-observed measurement, and missingness all differ. The [comparability helper](../../site/steam-cohort-comparability.mjs) checks whether proposed cohort definitions match and refuses a direct pooling operation if they do not. Synthetic tests protect this distinction; no data was downloaded from the linked trackers.

A representative income estimate still requires several complete paid Steam release months, historical delisting coverage, explicit publisher identity grouping, common observation horizons, consented merchant sales, publishing splits, and development labor. **First-game developer earnings, publisher causal effect, and true zero-sale shares remain unknown.**
