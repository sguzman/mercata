# Steam Update Visibility Rounds: scarce opportunities and seasonal blackout calendars

**Reviewed October 29, 2026.** [Machine-readable policy audit](steam-update-visibility-round-cap-and-seasonal-blackouts-2026.json) · [synthetic date ceiling helper](../../site/steam-update-visibility-round-guards.mjs) · [validation tests](../../tests/steam-update-visibility-round-guards.test.mjs). This study uses [Valve's public Update Visibility Rounds documentation](https://partner.steamgames.com/doc/marketing/visibility/update_rounds?l=english), [Valve's announced sale calendar](https://partner.steamgames.com/doc/marketing/upcoming_events), and its [traffic reporting definitions](https://partner.steamgames.com/doc/marketing/traffic_reporting?language=english). No Steamworks account, marketing campaign, purchase record or private report was used.

## A limited resource shared across Early Access and full release

Valve provides **five initial Update Visibility Rounds per eligible base product**. They are **shared** between Early Access and full release rather than renewed automatically on reaching 1.0. Additional rounds **may** be provided to well-selling products, but are not guaranteed. An update round requires a recent community announcement from the preceding **30 days**, and initial launch visibility must conclude first. For an Early Access title, Valve's visibility guidance also specifies **two weeks after Early Access launch** before the first update round.

The promotion is not a reserved exclusive homepage slot. Valve places opted-in games in a pool and says that homepage selections are randomized at each eligible view. The pool's selection mechanism does **not** amount to randomized assignment of otherwise comparable publishers, nor does it establish the causal sales effect of participating.

## A 30-day maximum is not 30 days of usable promotion

A round ends at **30 calendar days or one million homepage impressions**, whichever occurs first. Major seasonal sales commonly suppress the normal Update Round section, **but sale days still consume the 30-day calendar clock**. Starting a round immediately before a long sale can sacrifice much of its available placement window. It may also finish early if the impression cap is reached.

The published [2026 Winter Sale dates](https://partner.steamgames.com/doc/marketing/upcoming_events) are **December 17, 2026 through January 4, 2027**. A deliberately hypothetical date-resolution round beginning December 10, 2026 has the following **maximum** calendar accounting:

| Hypothetical quantity | Calendar value |
| --- | --- |
| Round start | Dec 10, 2026 |
| Nominal end, exclusive | Jan 9, 2027 |
| Nominal round duration | 30 days |
| Announced sale dates inside round, treated as blackout | 19 days |
| **Maximum days outside the assumed blackout** | **11 days** |
| Actual homepage impressions, clicks, paid orders, profit | **Unknown** |

This is *calendar arithmetic under an assumed full-period sale blackout*, **not a prediction** of 11 days of actual impressions. Even on non-sale days, the opted-in pool and personalized storefront may produce no placements for a particular product. The impression cap can end the round earlier. Actual local-hour timing is not modeled.

The [testable scheduling helper](../../site/steam-update-visibility-round-guards.mjs) strictly validates date-only synthetic inputs, initial rounds remaining, launch/Early Access gates and overlapping blackout intervals. It returns **null** for actual exposure, orders and revenue rather than turning hypothetical remaining calendar days into financial outcomes.

## An experiment would require different evidence

The [partner traffic report](https://partner.steamgames.com/doc/marketing/traffic_reporting?language=english) distinguishes an **impression** (a game brand shown onscreen), a **store-page visit** (a page load), and actual **paid orders** requiring separate authorized financial reporting. Impressions are not unique buyers or even verified attention. Library owners, wishlisters and new paying customers have different and overlapping denominators.

An attributable economic study should preregister actual rollout date, community announcement, app and region eligibility, all major sale conflicts, update quality, concurrent discounts, actual reported homepage impressions, visits and authenticated new sales; it needs a valid comparable control and costs to discuss incrementality or profit. It must not treat the algorithm's randomized *placement of opted-in games* as random treatment assignment or assume higher sale rates from merely consuming a round.

**Research finding:** the official inventory/cap/blackout policy is now documented and a usable planning guard exists. Actual publisher selection probability, incremental sales, extra round entitlement, player reach, first-game revenue and profit remain **unknown**.
