# Steam Major Update announcement months versus actual update-visibility rounds

**Reviewed October 29, 2026.** [Source observations](steam-major-update-review-months-vs-visibility-rounds-2026.json) · [safe aggregate audit](../../site/steam-major-update-observability-audit.mjs) · [tests](../../tests/steam-major-update-observability-audit.test.mjs). The two Strike Two articles reuse a **single** selected 1,312-game sample, not independent cohorts.

## A selected first-year-successful surviving set

The [September 18 review of update visibility announcements](https://striketwo.games/blog/steam-update-visibility-rounds) and [September 16 long-tail study](https://striketwo.games/blog/indie-game-sales-after-launch) track a common set of **1,312 currently priced Indie-tagged games launched during 2020–2022 with at least 100 reviews during year one** and limited pre-release reviews. Free and delisted titles and most weaker launches are outside the frame. That preselection prevents inference about the typical original Steam launch or its income.

The provider divides games by months carrying a Major Update announcement: **665 never**, **281 one**, **132 two**, **131 three or four**, and **103 five or more**. These five bins sum to 1,312; the first two sum to 946 games with at most one such month. But an announcement is **not a Steamworks Update Visibility Round activation**. [Valve's official guide](https://partner.steamgames.com/doc/marketing/visibility/update_rounds?l=english) grants five initial rounds, shared across Early Access and full launch; partner-private activation cannot be read from public event posts. The apparent nonuse of a Major Update event is not proof that rounds remain available.

## An observational review-month association

In months after game year one that follow three sufficiently active months without Regular or Major Update posts, the later article reports **520 Major Update months** with median review activity **1.38 times** the previous three-month monthly baseline, compared with **42,503 no-post months** at **0.86 times**. This is a within-game historical comparison, not randomized event exposure. Major updates may accompany discounts, new content, press or other changes; historical review counts are not actual purchases, retained users or revenue. The earlier report separately says the median selected game received **47% of its cumulative reviews after year one** through August 2026; that is a median of per-game review shares, not the share of platform sales.

**Unresolved denominator:** The September 18 page describes the **520** qualifying update months as coming from **375 games**, while the September 16 page says **311 games**. A plausible difference is *all later posters* versus the subset with qualifying quiet baseline months. However, the public wording does not independently establish that crosswalk, so both figures and the discrepancy are recorded rather than reconciled by assumption.

These reports come from the same commercial developer-operated source and reuse the same underlying cohort. They must not be counted as two independent datasets. The related synthetic audit tests event-month count partitions and source-status boundaries while keeping **round usage, incremental paid sales, game-player retention, representative income and after-cost profit null**.
