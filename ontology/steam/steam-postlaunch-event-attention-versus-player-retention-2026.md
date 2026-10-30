# Steam post-launch event attention is not player retention or paid sales

**Reviewed October 29, 2026.** [Structured evidence](steam-postlaunch-event-attention-versus-player-retention-2026.json) · [aggregate-only boundary guard](../../site/steam-postlaunch-event-signal-guards.mjs) · [regression tests](../../tests/steam-postlaunch-event-signal-guards.test.mjs).

## Three distinct measurement populations

1. **Store visitors.** [Valve's Google Analytics documentation](https://partner.steamgames.com/doc/marketing/google_analytics?l=english) says Steam no longer supports Google Analytics, and describes the July 1, 2023 Universal Analytics-to-GA4 change as context. That date is not documented as Valve's exact cessation date. Its new/returning breakdown is about traffic to a store page; a returning visitor is not proven to have installed, launched, purchased, or replayed a game. The guide describes a three-day UTM attribution window; this is not a causal purchase-lift experiment.
2. **Event audience.** [Valve's event reporting documentation](https://partner.steamgames.com/doc/marketing/event_tools/stats?l=english) counts unique logged-in users, attributed to their first impression or click location. Anonymous browsing is excluded, and event results refresh hourly. An outside direct link can create a read without a corresponding Steam event impression, so reads can exceed impressions. Dividing reads by impressions does not produce a coherent purchase or player-retention probability.
3. **Owners and game players.** [Valve's event visibility rules](https://partner.steamgames.com/doc/marketing/event_tools/visibility) describe Library announcements intended to re-engage existing players. Discount announcements are instead presented to prospective buyers and do not appear to existing owners in their Library. Cross-promotion events are excluded from Library and store placements. An eligible announcement, impression or event read is not proof of a returning gameplay session.

## What a longitudinal retention study would actually require

Fix a cohort of legitimately instrumented players (for example, distinct consenting users with a first paid game launch during a declared UTC launch week), track the same players' subsequent qualified game sessions over a predeclared 7-day and 30-day horizon, then report the eligible cohort and censoring. Ownership, Family Sharing, free weekends, gifts, key activations and playtesting must not be silently reclassified as direct Steam purchases. Separately reconcile licensed payer transactions, refunds, regional prices, payment processing, publisher splits and bank proceeds if the outcome is revenue, not engagement.

Steam's publicly documented event and UTM aggregate reports supply none of these authenticated longitudinal joins by themselves. The [synthetic guard](../../site/steam-postlaunch-event-signal-guards.mjs) allows offsite reads to exceed on-site impressions and deliberately returns null for revenue, retention and conversion fields. This is a classification test, not an estimate about a real publisher.

**Unobserved:** actual re-engaged players, retained buyers, repeat game purchase incidence, post-promotion incremental sales, net payouts and profit. No private Steamworks account, user telemetry, orders or bank records were accessed.
