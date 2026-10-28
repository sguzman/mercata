# DLC and soundtracks: product categories, paid orders and attachment

**Reviewed October 28, 2026.** [Structured findings](dlc-and-soundtrack-revenue-units-2026.json) and [synthetic-only unit ratio guard](../../site/steam-attach-metrics.mjs). No products or accounts were accessed.

Valve's [DLC guide](https://partner.steamgames.com/doc/store/application/dlc) describes distinct paid or free DLC AppIDs associated with a base game. Add-ons may be already installed and unlocked by entitlement, or delivered in dedicated depots. Valve supports in-game purchasing and cautions that selling DLC on launch day can lead players to feel base-game content was withheld. DLC licenses may also be activated with keys, which are not automatically Steam-store paid checkouts.

Valve's [modern soundtrack guide](https://partner.steamgames.com/doc/store/application/soundtrackapp) instead defines a separate **music AppID**. Customers can buy music without owning the game, and downloads do not require installing the parent game's content. Soundtrack products require MP3s and cover artwork/metadata; optional high-quality audio can have separate depots. A standalone soundtrack requires its own two-week Coming Soon visibility window, while a soundtrack tied to an already released game may publish after review.

**Important accounting rule:** Valve says associated soundtrack revenue **counts toward the parent game's total when calculating revenue share**. That does not mean a soundtrack transaction is another paid base-game purchase or establish what portion an individual developer retains.

## The attach-rate denominator problem

A genuine **DLC owner attach rate** needs unique eligible base-game owners and a deduplicated count of those same owners who actually obtained the add-on in the specified period. Dividing add-on sales events by base game checkout events is an **event ratio**, not a unique-owner probability. It may exceed 100% because players can acquire several different DLCs.

For soundtracks this is even more important: listeners can purchase an independent music AppID without owning the game. A bundle also may grant multiple entitlements in one checkout. Consequently, soundtrack units divided by game units is **not a customer attachment rate**.

The [synthetic test helper](../../site/steam-attach-metrics.mjs) preserves these distinctions. No real attach rates, soundtrack unit totals, signed royalty agreements, direct music costs or after-tax profits were measured.
