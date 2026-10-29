# A cross-market demo story: itch.io browser play events versus paid Steam orders

**Reviewed October 29, 2026.** [Structured public example](steam-itch-browser-demo-versus-paid-launch-identification-2026.json) · [synthetic cross-site denominator guard](../../site/steam-external-demo-conversion-guards.mjs) · [tests](../../tests/steam-external-demo-conversion-guards.test.mjs).

## One creator, three incompatible aggregates

A creator [posted a retrospective about *I.T. Never Ends*](https://www.reddit.com/r/IndieDev/comments/1xcrt0m/two_months_after_launching_my_first_steam_game/) on October 22, 2026, describing roughly two months since Steam launch. The post reports **3,042 Steam copies sold**, **USD 37,917 Steam gross**, and approximately **1,000 copies on day one**. These are self-reported game sales, not independent merchant ledgers or actual transferred publisher proceeds.

The same creator reports that a **free browser-playable demo on itch.io accumulated more than 20,000 plays**. Those are browser play events, not authenticated distinct customers, Steam product activations or a cohort of people proven to have purchased. The author perceives little direct migration from itch demo interest into Steam paid sales, but no joined cross-store user records or randomized demo experiment are provided.

The creator also reports approximately **27,000 Steam launch wishlists**, **31,000 outstanding wishlists later**, and a Steam wishlist conversion figure of about **6%**. Wishlist snapshots and total copies cannot be divided to independently reconstruct the Steam dashboard conversion numerator. Total copies include purchases by non-wishlisters and potentially different observation periods. A rising wishlist stock can coexist with purchases, removals and fresh additions.

## Source eligibility and financial distinctions

The post describes a first Steam game, while an author comment mentions a prior game. This is not proof of a first game ever developed, a unique studio, or a new legal publishing entity. The first-day unit count, overall gross and subsequent daily sales are not complete developer earnings: the post does not publish the Steam platform cut, tax settlements, bank receipts or full development/support labor costs.

The [tested guard](../../site/steam-external-demo-conversion-guards.mjs) keeps the more-than-20,000 browser-play threshold separate from Steam orders and prevents assigning a verified demo-to-paid conversion rate, causally incremental orders, net cash or profit. This one voluntary example does not establish the population-level usefulness of browser demos or typical outcomes for cross-market creators.
