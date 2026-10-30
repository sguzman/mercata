# Calendar-eligible but unavailable game discount: public Summer Sale bundle fallback

**Reviewed October 30, 2026.** [Structured audit](steam-lostinart-bundle-fallback-vs-game-discount-2026.json) · [test](../../tests/steam-bundle-fallback-vs-game-discount.test.mjs).

## Published incident and timing

*Lost in Art: a Miniature Realm* (Steam AppID 2900050) has an [official June 1, 2026 paid release](https://store.steampowered.com/app/2900050/). In a [June 25 publisher news post](https://steamcommunity.com/app/2900050/allnews/), Archaic Game Studio said the game would participate in Steam's Summer Sale starting **July 1**. A later **July 2 publisher announcement**, visible in that same rolling Steam community news index, said a technical issue had prevented putting the **base game itself** on sale, with Steam Support involved; it announced an increased **50% bundle discount** as an alternative.

These are **publisher-authored statements**, not inspected private Steamworks support records. The specific cause and any eventual fix are unknown. The rolling news list is public but is not an immutable dated article link.

## What the calendar can and cannot prove

July 1 is **30 calendar days after June 1**, and July 2 is 31 days after. Valve's [first-party discount rules](https://partner.steamgames.com/doc/marketing/discounts?language=english) identify a post-release 30-day delay but other constraints and the actual partner configuration also matter. The [synthetic release-date checker](../../site/steam-sale-date-eligibility.mjs) therefore permits July 1 from *the release-date gate alone*, while explicitly returning `actual_partner_discount_permission_verified: false`. The [new discount-history checker](../../site/steam-discount-sequence-cooldown.mjs) additionally treats unverified past promotions as unresolved. Neither checker can explain the reported technical issue or infer that Valve refused a legally valid promotion.

## Why a bundle fallback is a different intervention

Valve's [official bundle documentation](https://partner.steamgames.com/doc/store/application/bundles?language=english) distinguishes discounting a configured *bundle* from setting an eligible *individual package's* sale price. A bundle can apply a percentage reduction to the products in that basket, and its purchase may allocate a sale unit to included game packages; it is still **not the same price event as a standalone base-game discount**. Critically, changing a bundle's discount **does not send the normal Steam discount notification to customers who wishlisted the game**. The public case therefore cannot demonstrate either a notified-wishlist purchase funnel or incremental game sales from the 50% bundle promotion. A reported 50% bundle rate is **not** proof that the individual base-game package sold at a 50% reduction.

A future audit needs **package-level promotion history**, verified public prices by region and date, official publisher statements or permissioned records to establish an actual discount transaction. This public case has none of those ledgers, so the number of purchases, gross, payout and profit all remain unknown.

No user purchase identities, account data, Steamworks permissions or private finance records were accessed.
