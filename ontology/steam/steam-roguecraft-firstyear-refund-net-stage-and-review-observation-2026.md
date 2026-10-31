# RogueCraft: one-year author report, refund arithmetic and ambiguous net-revenue stage

**Reviewed October 30, 2026.** [Machine record](steam-roguecraft-firstyear-refund-net-stage-and-review-observation-2026.json) · [synthetic arithmetic guard](../../site/steam-firstyear-selfreport-stage-guard.mjs) · [regression tests](../../tests/steam-firstyear-roguecraft-cash-stage.test.mjs). This is a *refinement* of Mercata's already registered [RogueCraft author source](https://www.reddit.com/r/IndieDev/comments/1v9cnyx/one_year_after_releasing_our_first_steam_game/), **not** another independent sample.

## Official release identity versus voluntary financial disclosure

The [Steam listing](https://store.steampowered.com/app/3470340/RogueCraft/) identifies *RogueCraft* (AppID 3470340), developer/publisher display **CraftCoreGames**, and a **July 22, 2025** release. These public fields do not authenticate historic purchaser records, actual original paid release hour or the legal payment recipient.

The developer's **July 28, 2026** first-game post reports **1,674 copies**, **220 refunds**, **$14,992 gross** and **$11,888 described as net after refunds, chargebacks, taxes and VAT** during about the first year. The dates are **371 calendar days** apart, rather than a verified exact 365-day fixed paid-release cohort. No authenticated Steam financial report or matched transaction dates were supplied.

The simple quotient `220 / 1,674 ≈ 13.14%` agrees with the author's rounded **13.1% refund rate**. Yet the numerator is a reported refund count, not verified refunds from the identical sold-copy purchase cohort: period refunds can refer to earlier purchases. Similarly, `1,674 − 220 = 1,454` is a **conditional arithmetic remainder**, not a validated net paid-unit number.

The difference between author-gross and author-net revenue is **$3,104**. It cannot be allocated among refunds, chargebacks, VAT, other taxes or Steam's share without a reconciled report. The author **does not expressly establish the Valve share was deducted** from the $11,888 figure. That label therefore cannot be interpreted as deposited publisher income, contractor income or after-labor profit.

## Players, demo users and wishlists are different denominators

The author reports **1,578 lifetime players**, **6h15m average** playtime and **2h27m median** playtime. The difference between mean and median describes an uneven playtime distribution in the reported group; neither figure establishes purchaser retention for an authenticated distinct buyer cohort.

The same post cites approximately **1,166 prelaunch wishlists**, **4,105 later outstanding wishlists** and **900 Next Fest demo players**. These stocks and events cannot be divided into gross sold copies to manufacture a matched wishlist or demo conversion rate. Demo participation, wishlist additions, game licenses and unique paying customers are different units with unknown overlaps.

A selected voluntary first-game report does not provide the income outcomes of comparable non-reporting games, zero sellers or unreleased projects. Its figures cannot estimate a 2025 marketwide median, precise paid-order zero share or expected net return to a new developer.

The [synthetic validator](../../site/steam-firstyear-selfreport-stage-guard.mjs) preserves the calendar gap and distinct units but returns `null` for unaudited legal payee cash, matched purchase/refund rate, complete cost profit and broader population outcomes. It never accepts real AppIDs, personal data or payment records.

**Provenance:** one already-cited developer-authored post plus independent public Steam product metadata. No protected financial exports, forum author identity information, private contracts, review text or customer records imported.
