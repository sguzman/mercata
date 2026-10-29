# Steam gifts: paid checkout, recipient acceptance, redemption and refunds

**Reviewed October 29, 2026.** [Structured definitions](steam-gift-checkout-redemption-refund-and-license-units-2026.json), [synthetic-only event classifier](../../site/steam-gift-reconciliation-guards.mjs) and [verification tests](../../tests/steam-gift-reconciliation-guards.test.mjs). This is a review of official public Steam policies, not private merchant sales, customer activity or a measured conversion rate.

## A gift changes license ownership without creating a second checkout

Steam's [official gifting FAQ](https://help.steampowered.com/en/faqs/view/2C02-3563-B72F-F117) distinguishes **new paid gift purchases** by one account from **redemption into another account's library**. A purchaser cannot simply transfer their already owned license. After redemption the recipient holds the library entitlement, but redeeming it is **not a second retail purchase**. Neither the buyer nor the recipient must be assumed to represent one unique customer across a cohort of multiple gift purchases.

| Officially documented event | Paid game checkout? | Library entitlement? | What subsequent state matters |
| --- | --- | --- | --- |
| New direct game purchase | Yes | Buyer's account | Can still be refunded |
| New game purchased as a gift | Yes, by gift payer | Not necessarily yet | Delivery, acceptance, decline or refund |
| Scheduled gift delivery | Purchase already happened | Recipient not necessarily activated | May schedule up to **12 months** ahead |
| Delivered gift accepted | No *new* checkout | Recipient gains entitlement | Recipient consent relevant if refund requested later |
| Delivered gift declined or ignored for 30 days | Original checkout occurred | No retained gift entitlement | Refund or automatic cancellation |
| Previously accepted gift refunded | No new checkout | Entitlement removed on refund | Original buyer and recipient actions differ |
| Retail key activation | No Steam Store checkout implied | May add license | Third-party commercial terms and provenance |
| Steam wallet gift card | Not a game-specific checkout | Funds only | Future spending may buy a game or something else |

Steam gives delivered gifts a **30-day acceptance period**; declining a gift or allowing it to lapse results in refund to the purchaser. A redeemed gift normally requires the recipient to authorize a refund request before the original purchaser can complete that refund process. Steam's usual refund guidance references **14 days** and **under two hours** played, but this is eligibility, not a measured refund rate.

## Package variants and the geography trap

The [Steam gifting support article](https://help.steampowered.com/en/faqs/view/2C02-3563-B72F-F117) explains that personalized **Complete Your Collection bundles** may not be gifted, while multipacks can create extra giftable copies under different rules. The [Steamworks Bundle documentation](https://partner.steamgames.com/doc/store/application/bundles?language=english) says a bundle purchase shows constituent package units for each game in partner reports; the package rows cannot simply be summed as distinct store baskets or unique buyers.

The [regional gift policy](https://help.steampowered.com/en/faqs/view/58D3-B80D-2943-3CC6) says the permitted redemption countries may be limited and appear during purchase. Regional gift restrictions and localized price differences block a naive inference that a Steam account in one region can buy gifts for any other region. No current or historic country-specific acceptance percentages were obtained.

## A deliberately synthetic state reconciliation

The [pure audit helper](../../site/steam-gift-reconciliation-guards.mjs) consumes **only** fixture-prefixed invented identifiers and one latest lifecycle state per distinct invented event. Ten illustrative records include seven original paid-game checkout events, four later refunded checkout events, one still-pending gift, one accepted non-refunded gift, and three separate non-checkout cases (a key activation, a free license and wallet funding). The provisional arithmetic is **7 historical paid checkouts / 4 reported refunded / 3 not yet refunded**, *not* a claim that Steam has three final net sales or a three-in-seven platform refund rate.

Even the pending gift could be cancelled later. One game sold in a bundle could contribute a product-level reporting row without implying an additional whole-platform basket. There are no real identifiers, actual AppIDs, partner API requests, merchant transactions, event timestamps or financial inputs.

## Research gap remaining

The proper buyer and seller denominators require separately authenticated **paying account**, **gift recipient**, **game AppID**, **package**, **original checkout**, **refund**, **license activation**, **retail key source** and **publisher payee** identifiers under legitimate consent. Refund-adjusted game proceeds additionally require tax, platform terms and partner remittance. A public license tally is not automatically the paid sales denominator; neither a gift recipient nor a gift card holder is necessarily the purchaser of that game.

**No representative gifting rate, gift conversion rate, zero-sale fraction, unique paying-customer count, developer net royalty or profit was measured.** This checkpoint improves transaction unit definitions and model integrity, not observed Steam earnings.
