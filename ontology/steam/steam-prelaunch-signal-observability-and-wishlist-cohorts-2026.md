# Steam wishlist cohorts, demos and Playtest: what can be measured

**Reviewed October 28, 2026.** [Structured study](steam-prelaunch-signal-observability-and-wishlist-cohorts-2026.json) · [synthetic cohort guard](../../site/steam-wishlist-cohort-guards.mjs) · [tests](../../tests/steam-wishlist-cohort-guards.test.mjs).

## Three separate application and event populations

Steam's official [demos guide](https://partner.steamgames.com/doc/store/application/demos?l=english) and [Steam Playtest guide](https://partner.steamgames.com/doc/features/playtest?l=english) specify separate, associated, free AppIDs. A download, signup and access grant do **not** constitute a sale of the paid base game.

The [Steam UTM reporting guide](https://partner.steamgames.com/doc/marketing/utm_analytics) excludes demo-only downloads and Playtest app conversions from base-game UTM conversion totals. It separates purchases from retail-key activations and free license acquisitions; post-attribution refunds may not be subtracted. Unobserved Playtest conversions in that report **do not imply zero paid sales** later.

## A new identifiable timeline, but not a buyer probability

[Valve's wishlist reporting documentation](https://partner.steamgames.com/doc/marketing/wishlist/reporting?l=english) defines CSV `DateLocal` as the wishlist-linked purchase date in **Pacific time** and `MonthCohort` as the month when a customer first added the game. It updates daily through the prior date. The platform-preference breakout also includes only users who have explicitly made those selections.

A report may therefore group **wishlist purchase events by initial wishlist month and elapsed calendar months**. Our [synthetic helper](../../site/steam-wishlist-cohort-guards.mjs) validates month starts, date order, positive integer event counts and reporting lag, then groups by month cohort. Tests reject personal identifier fields. However, **the two date columns cannot establish the number of all eligible original wishlisters, identify unique later paid customers, reconcile refunds, or measure a causal treatment effect**. Dividing reported purchases by current wishlist stock would mix different populations.

To estimate genuine demo-to-purchase or Playtest-to-purchase outcomes, a publisher would need lawfully authorized matched cohort data, paid base-game transaction reconciliation, censoring controls, plus a credible comparison group for causal effects. Public game store pages, wishlist stocks and reports lacking identity joins cannot deliver that outcome.

**Unobserved:** representative demo-to-paid conversion, playtest-to-paid conversion, verified net paid checkouts, and causal incremental sales from a festival or demo. No account access, merchant records or experiments were used.
