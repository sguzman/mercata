# Linked-edition zero-sales attribution is not a zero-selling paid game

**Reviewed October 31, 2026.** [Bundled ownership announcement, July 2021](https://steamcommunity.com/games/1489630/announcements/detail/4182139342044187406) · [Developer's May 2022 release note](https://steamdb.info/patchnotes/8690851/) · [current retired VR-app status](https://steamdb.info/app/1657900/) · [structured study](steam-carrier-command-vr-linked-attribution-2026.json) · [synthetic check](../../site/steam-linked-entitlement-zero-attribution-audit.mjs) · [tests](../../tests/steam-linked-entitlement-zero-attribution-audit.test.mjs).

An unusually useful counterexample to careless Steam *exact-zero* classification is **Carrier Command 2 VR**. In **July 2021**, the developer publicly said the standard and VR versions were packaged for a **single purchase giving ownership of both**. The game launched in August 2021, with its VR edition presented as a separate Steam application.

In its **May 6, 2022** version 1.2.7 update, the developer explained that sales credit for the linked pair was being assigned to the *base game*. Consequently, Steam treated the separately listed VR app as having **zero credited copies**, which the developer associated with missing VR-category promotion. The developer announced a plan to offer VR as a launch option within the base game. The statement is a publicly attributable first-party description, **not** an independently authenticated partner financial export.

[SteamDB's current VR application record](https://steamdb.info/app/1657900/) also reports that the separate VR app was retired at the publisher's request. That current retirement state must **not** be interpreted as a zero-demand, zero-checkout or originally paid standalone first release. Nor do app reviews, owners or accessibility from a bundle prove standalone purchases.

## Implication for marketwide zero-sales denominators

Three distinct questions must remain separate:

1. Did this *AppID* receive sales credit in the platform's attribution system? According to the developer, the VR edition was treated as **zero**.
2. Did consumers buy the linked **commercial product**? The developer explicitly describes attributing the pair's sales to the base game, so a separate zero-credited AppID is **not** evidence the combined product had no buyers.
3. Was the VR AppID itself an **independently paid first-playable base-game release**? The public source does not supply an independently verified checkout/product-history frame to establish this. It should be **excluded or unresolved pending its paid-origin audit**, not silently counted as a failed paid title.

These answers do not identify exact publisher units, refunds, legal partner revenue, costs or after-labor profit. App-retirement, bundled access and selected developer statements cannot yield a population-level zero-sale proportion. Even a complete list of Steam game-type AppIDs could contain linked editions whose credit is assigned elsewhere. A careful census must join **base games, packages, entitlements, and attributed paid orders** before classifying genuine zero-sale outcomes.

The accompanying synthetic audit uses only fictitious IDs to assert the identity boundary; no real accounts, purchaser records, Steam partner reports, or scraped app histories are processed.
