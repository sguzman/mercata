# Steam Wishlist Reporting: Pacific purchase day and month-cohort uncertainty

**Reviewed October 29, 2026.** [Machine-readable audit](steam-wishlist-month-cohort-pacific-reporting-lag-2026.json) · [pure cohort-date validator](../../site/steam-wishlist-month-cohort-guards.mjs) · [tests](../../tests/steam-wishlist-month-cohort-guards.test.mjs). Official [Steam Wishlist Reporting](https://partner.steamgames.com/doc/marketing/wishlist/reporting?l=english) and [Wishlist](https://partner.steamgames.com/doc/marketing/wishlist?l=english) descriptions are the only sources. No partner account, CSV, purchaser record, or release cohort was accessed.

## DateLocal and MonthCohort do not encode the same event

Valve defines **DateLocal** as the **Pacific-time purchase date** for a wishlist-originated purchase, and **MonthCohort** as the **month** in which the customer originally added the game to a wishlist. A MonthCohort value formatted like `2026-08-01` labels **August 2026**, not a verified August 1 wishlist event.

A game receiving wishlist-originated purchases on October 27 from an August MonthCohort has an **unknown original wishlist-add date between August 1 and August 31**. The possible *calendar-day* lag is **57–87 days**, not necessarily 87 days. Time of day and actual elapsed hours are likewise unobserved.

## Daily reporting is not real-time zero-sales evidence

Valve says the report is refreshed **daily through the previous Pacific-time day**, not the present one. If the report is examined on October 29, October 28 is the latest normally completed date. An empty October 29 cell is **not** evidence that a game had zero purchases that day.

The [synthetic validator](../../site/steam-wishlist-month-cohort-guards.mjs) rejects purchase dates at or after the reporting day, malformed MonthCohort day labels, dates before the add month, duplicate day-plus-cohort aggregates and noninteger counts. It groups invented event counts by original wishlist month, computes possible lag bounds, and leaves genuine Steam orders, refund-adjusted units, bank receipts and conversion rates **null**.

## Platform preference and conversion denominator traps

The platform-preference column is generally a **subset** of all wishlist users, because many customers do not explicitly set a device preference. It must not be used as the denominator for all-platform wishlist purchases. Likewise, an event count of purchases from wishlists does not reveal all game orders or an original complete list of eligible wishlisters.

A defensible conversion study would need app-consistent permissioned wishlist additions/removals and eligible cohort stocks, exactly aligned reporting periods, refund-adjusted merchant transactions, transparent treatment of ownership and repeat adds, and documented geographical and reporting coverage. No user-level records, true purchase conversion, or causal effect of wishlist notifications has been measured here.
