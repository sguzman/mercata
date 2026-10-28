# Steam finance data: protected truth, permitted validation and selection bias

**Reviewed October 28, 2026.** [Structured evidence](financial-validation-and-consent-2026.json). This is an official-interface review and a consent-respecting **proposed study**. No protected account, financial record, publisher data, API key or personal information was accessed.

## A valuable official measurement route

[Valve's IPartnerFinancialsService](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) documents aggregate detailed sales access through a dedicated **Financial API Group**. That key can expose **all apps on one partner account**, so it is a highly sensitive credential, not a general public research endpoint. Valve recommends securing it with an IP allowlist. The Mercata protocol explicitly forbids soliciting, storing or exposing this key.

The interface exposes **GetChangedDatesForPartner** and **GetDetailedSales**. Dates use Pacific Time. On a changed date, Valve instructs clients to re-fetch and **replace** saved values, not append corrections: returns and late transaction settlement can cause historical changes. The detailed API is paged by `highwatermark_id` per date; partial pages yield incomplete totals.

## These rows measure different economic events

| Official financial row | Meaning | Incorrect inference |
| --- | --- | --- |
| `Package` + `Steam` | Package sold through Steam checkout | One game sold per app in a multi-app package |
| `Package` + `Retail` | Retail key activated | Paid order made on the Steam store |
| `MicroTxn` | In-game item purchase event | New base-game buyer |
| `gross_units_returned` | Refunded/returned unit measure | A new positive sale |
| `net_sales_usd` | Sales minus returns and taxes, in USD | Developer profit or bank payout |

These categories and fields are stated in [Valve's API documentation](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english). Package rows include `packageid`, while microtransaction rows have an `appid`; `primary_appid` is specifically described as **additional revenue-share attribution**, not blanket proof that every package sale should be credited to one base game. The API separately shows **0/5%/10% additional share tiers**, not publisher-specific total royalty terms.

The same distinctions match Valve's [financial reporting guide](https://partner.steamgames.com/doc/finance/payments_salesreporting): near-real-time gross figures are different from monthly adjusted payouts. Keys, bundle allocations, taxes, Steam share, publisher splits and labor are further required before anyone can claim a developer's profit.

## A permissioned, privacy-safe validation protocol

A viable future verification program can ask publishers to **opt in to preparing their own narrow aggregate reports locally**, rather than give Mercata any account credential. The protocol requires:

- Establish the entire eligible-game frame *before* seeking volunteers; recruit low/zero-sale titles rather than only successful visible publishers.
- Define the permitted purpose, time window, aggregation bands, allowed publication and deletion/retention terms. Do not collect buyer identifiers, credentials or granular business-sensitive source records.
- Reconcile Pacific-time reporting windows, changed-date refreshes, returns, Steam package checkout, external retail keys and microtransactions. Do not use `primary_appid` as a blind revenue allocation.
- Track the consent rate, missing firms, unmatched games and selection biases. Publisher identities and co-publishing relationships need separate resolution.
- Suppress small groups and potentially identifying income observations. Publish methods, coverage and uncertainty even if estimates remain unreportable.

A consenting partner group could eventually compare its own actual units sold to publicly modeled review multipliers. That **does not automatically validate the model for publishers who did not consent**. GameDiscoverCo, Gamalytic and Steam Spy sample/estimator limitations documented in earlier Steam checkpoints remain unresolved for the long tail.

**Missing evidence:** actual paid-order counts, zero-sale AppIDs, total eligible publisher frame, representative median/mean payouts, contract-specific shares and developer profits. These values remain **unknown**, not zero. No work on an actual account or recruiting participants occurred.
