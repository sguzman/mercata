# Immunica: unequal festival exposure and first-game reporting windows

**Reviewed October 29, 2026.** [Machine dossier](immunica-firstgame-niche-event-wishlist-and-sales-windows-2026.json) · [synthetic window guard](../../site/steam-event-wishlist-window-guard.mjs) · [regression tests](../../tests/steam-immunica-event-window-audit.test.mjs).

## First paid release and three cumulative checkpoints

The [Steam storefront](https://store.steampowered.com/app/4315220/Immunica/) identifies *Immunica*, AppID 4315220, as first released **March 29, 2026**, with eranboi publicly labeled developer and publisher. In an [October 15, 2026 first-person report](https://www.reddit.com/r/IndieDev/comments/1x707dr/numbers_from_my_first_3month_steam_game_700/), the author says the game took approximately **three months of solo development**, not that the October financial snapshot covered only three months. A reply places the first Steam page on **January 16**.

The reported sales totals are **147 in the first three days**, **234 through the first week**, and **895 cumulatively** by the later retrospective. These are **nested observation windows**: simply summing them would count earlier units repeatedly. Subtracting gives a descriptive **87 additional** copies between the first-three-day and first-week totals, and **661 additional** copies from first week to the late checkpoint, provided all author counts refer to the same Steam purchase metric. Neither increment supplies transaction-level verification, exact refunds or a fixed-population release-month median.

The post gives **$2,123 gross** and approximately **$1,100 net** after described platform, tax and return adjustments. The author-defined net cannot be assumed to equal a bank transfer, personal income or after-cost profit. [Valve's partner finance FAQ](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq) documents additional reporting and payment stages; no authenticated partner statements were supplied.

## Niche festival wishlist count versus Next Fest

The author reports roughly **82 wishlists a month before Next Fest**, **474 added in two weeks at the Tiny Roguelikes event**, **160 added around Steam Next Fest**, **700 at launch**, and **1,081 outstanding later**. The arithmetic ratio of **474/160 = 2.9625** describes *two author-attributed counts*. It is **not a causal 2.96-fold effectiveness estimate**: the events have different exposures, calendar conditions, underlying audiences and potentially other simultaneous marketing. Without holdout groups and comparable unique-person event denominators, the event's incremental effect on wishlists or completed purchases is unidentified.

The reported **201 units in Poland** and a pricing change also cannot establish profit by geography or the causal effect of changing PLN prices. The public store's current price and language support do not reveal the historical transaction mix.

## Interpretation

This is one voluntarily disclosed, positive-sales first commercial game, several months old at the retrospective. It does **not** fill in any missing zero-sale AppIDs, generalize sales potential to all new publishers, or establish a wishlist conversion coefficient. The [synthetic guard](../../site/steam-event-wishlist-window-guard.mjs) preserves increasing cumulative units, permits descriptive event ratios, and leaves net bank cash, first-game income distributions and experiment-adjusted festival performance unknown. No private merchant data or user profiles were used.
