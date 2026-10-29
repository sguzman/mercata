# Steam first-game incumbency and repeat-studio survivor selection

**Reviewed October 29, 2026.** [Machine-readable study](steam-studio-survivorship-selection-2026.json) · [synthetic selection guard](../../site/steam-studio-survivorship-selection.mjs) · [automated tests](../../tests/steam-studio-survivorship-selection.test.mjs). This analysis distinguishes repeat-publisher **selection** from any causal experience benefit; it is not a Steam income census.

## Public studio-name comparisons are not a longitudinal experiment

[PlayRecon's October 29 release-trends page](https://app.playrecon.com/trends) reports 92,297 *storefront studio-name groups* with at least one dated game. About **77%** had only one observed game, the median interval *among repeaters* was **203 days**, and about **65%** of its 2026 releases were first-observed by a studio name. These groups are not verified unique legal enterprises, and young entrants have less follow-up time than older studios. **No observed second title** cannot be classified as business failure, still less as zero first-game sales.

The same [public tracker](https://app.playrecon.com/trends) shows median reviews by release ordinal: **13 for game 1**, **22 for game 2**, **35 for game 5** in its current view. Its reported externally published titles have median **25 reviews**, versus **6 for self-published** titles among a recent three-year window. Those are *review counts* in changing store-name populations, not matched same-age paid-order or earnings cohorts. Studios reaching game 5 have already selected themselves into a small, long-lived group; outside publishers select which games to back. Neither conditional comparison proves that experience or publisher intervention caused more purchases.

The [PlayRecon metrics definitions](https://app.playrecon.com/help/metrics) disclose a public-store/review-based frame. These aggregates have no independent developer-bank validation. Likewise Valve's [Profile Features FAQ](https://partner.steamgames.com/doc/marketing/profile) says the Community-profile trading-card/badge eligibility uses sales and engagement, but that **profile-feature restrictions do not affect Steam's store algorithmic visibility**. A missing profile-badge privilege should not be used as a supposed ranking penalty against small first games.

## A Simpson-like synthetic survivor-selection counterexample

Four **invented** studio fixtures have first-game review counts **0, 1, 10 and 20**. Only the latter two have second releases in this fixture, with second-game counts **8 and 15**. A naive comparison puts the median first game among *all four* at **5.5 reviews**, while the median second game among *the two repeaters* is **11.5**. This looks like a **+6-review experience premium**. But among the *same two repeaters*, median first-game reviews were **15**, and second-game reviews **11.5**: a **−3.5** difference. Both repeaters declined in the invented example, while the unmatched group comparison increased.

The [pure selection audit](../../site/steam-studio-survivorship-selection.mjs) checks matched and unmatched denominators, explicitly counts studios with inadequate second-launch follow-up as right-censored, and rejects non-fixture identifiers or private/extra fields. It keeps unknown paid orders, publisher profit and causal effects as `null`. This is a numerical illustration of **possible selection reversal**, not an estimate of how often such reversals happen in Steam.

## What a meaningful incumbent-effect test would need

Identify legal studio/payee groups and historical original-paid game launches; fix review observation age, game genre, initial price, staffing, publisher contract, prior follower base, marketing spend and country; follow unreleased second games with a clear right-censoring protocol; and use actual paid orders for earnings questions. Even within-studio matched differences can be confounded by additional financing, player tastes, changes in staff and market timing.

**No claim is made that repeat releases or an external publisher improve or decrease earnings.** Existing public correlations can guide hypotheses, not underwrite a first-time solo-developer income forecast.
