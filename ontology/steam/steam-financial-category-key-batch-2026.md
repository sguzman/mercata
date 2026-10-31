# Steam financial categories and key-request batches: which zero is measured?

**Reviewed October 31, 2026.** [Valve's financial API specification](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) · [Valve's Steam Year In Review 2025](https://steamcommunity.com/groups/steamworks/announcements/detail/528746884222682053) · [structured audit](steam-financial-category-key-batch-2026.json) · [synthetic category checker](../../site/steam-financial-key-batch-boundaries.mjs) · [regression tests](../../tests/steam-financial-key-batch-boundaries.test.mjs).

## What the first-party schema distinguishes

Valve's documented partner-only `IPartnerFinancialsService.GetDetailedSales` report distinguishes three relevant line-item categories. The API requires a **Financial API Group key**, and the key is scoped to financial data across **all apps of that partner**, rather than a public app-specific sales query. This study accesses neither that API nor any private report.

| Financial report class | Relevant fields | What it establishes in a properly authorized, complete record |
| --- | --- | --- |
| `Package` + `Steam` | `gross_units_sold`, `gross_units_returned`, price, package and bundle references | Direct Steam-store package sales and returns, **before** proving which initially paid base game received the purchased entitlement |
| `Package` + `Retail` | `gross_units_activated`, `key_request_id` | Steam key activations grouped by the partner's **key-request batch**; not a count of checkouts on Steam |
| `MicroTxn` | `gross_units_sold`, `appid`, game-item identifier | In-game item transactions, **not** an originally paid game launch order |

Valve's March 2026 review of the 2025 platform improvements explicitly identifies per-request activation reporting as a new Sales Data API feature. Request-tag summaries already existed; `key_request_id` adds batch-level specificity. Keys may be used for press, QA or off-platform retail sales, so **seven activations neither prove seven Steam sales nor seven externally paid buyers**. A free activation, a legitimately purchased external key, and a Steam-store package purchase require separate classifications.

The detailed schema reports **gross units sold and gross units returned** separately. A fictional example with two paid Steam package units and two returns has **zero net retained units**, but had **two gross historical paid units**. A second fictional example with a complete paid-store reporting period showing zero paid packages but seven retail key activations has **zero attributed Steam-store paid orders**, while the number of external buyers remains **unknown**. These numbers are invented for the model and **are not Steam-wide statistics**.

## Conditions before making a real zero-sale claim

A usable observation requires: an externally verified first-paid base-game eligibility and initial playable date; a complete app/product frame including removed games; period-aligned partner financial access; all Pacific Time daily pages; completed late-settlement/requery reconciliation; relevant historical view grants after app transfers; price-positive package-to-game entitlement attribution; and explicit boundaries for refunds, retail keys and microtransactions.

The [synthetic model](../../site/steam-financial-key-batch-boundaries.mjs) accepts only fabricated IDs and explicit coverage flags, then keeps store gross paid units, returns, key activations by batch and in-game transactions separate. Under a hypothetical complete window, **zero** can be identified for that fictional game's Steam-store paid orders. Under an incomplete window, a recorded positive rules out zero for that fixture, but the absence of observed paid orders remains **unknown**. Neither state estimates a real marketwide zero-sales percentage or legal publisher profit. This is a *measurement validity check*, not a collected buyer, transaction or financial dataset.
