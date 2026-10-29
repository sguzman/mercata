# Steam's announced seasonal sales: timing and the 30-day discount gates

**Reviewed October 28, 2026.** [Machine study](steam-sale-calendar-release-cooldown-eligibility-2026.json) · [synthetic date guard](../../site/steam-sale-date-eligibility.mjs) · [tests](../../tests/steam-sale-date-eligibility.test.mjs).

[Valve's upcoming events calendar](https://partner.steamgames.com/doc/marketing/upcoming_events) currently lists **Winter Sale December 17, 2026–January 4, 2027**, **Spring Sale March 18–25, 2027**, and **Summer Sale June 24–July 8, 2027**. It also lists the **Steam Scream V** October 26–November 2, 2026 themed event and **Next Fest** for February 22–March 1 and June 14–21, 2027. These are *announced* dates from a changing source, not observations of buying or competition.

## Eligibility is more specific than calendar overlap

Valve's [seasonal sale guidance](https://partner.steamgames.com/doc/marketing/discounts/seasonalsales?l=english) and [discount rules](https://partner.steamgames.com/doc/marketing/discounts?l=english) generally bar an ordinary discount until **30 days following release or a base price increase**. Steam-wide seasonal sales are an exception to ordinary *discount-to-discount* cooldowns, but **not** to release or price-increase cooldowns. A title whose wait ends during a sale may potentially join late. An optional launch discount is different, under its own advance-configuration rules.

Example, for the Winter Sale:
- Released December 1: date-level first possible ordinary seasonal discount **December 31**.
- Released November 1: date-level eligible from **December 17**.
- Released December 20: **not eligible before the event ends** through ordinary post-launch discounting.
- Released earlier but increased its base price December 1: date-level first potential discount **December 31**, subject to other account constraints.

The [tested helper](../../site/steam-sale-date-eligibility.mjs) evaluates only release date, last price-increase date and announced sale period; it cannot know individual partner permissions, participating packages, actual published price history, or specific Pacific-time cutoffs.

## Calendar is not causal market evidence

Next Fest is intended for eligible **unreleased games with demos** and cannot be treated as a discounted regular postlaunch purchase event. Themed events have additional category eligibility. No evidence here supports a 'best' release month, consumer demand estimate, revenue cannibalization, discount lift or guaranteed featured placement. Those require verified comparable paid-release cohorts, genre-specific events and purchase data. **All such economic outcomes remain unknown.**
