# Steam financial reporting: why changed dates must replace prior results

**Reviewed October 29, 2026.** [Machine-readable synthetic case](steam-financial-changed-date-requery-2026.json) · [deterministic guard](../../site/steam-financial-requery-guards.mjs) · [tests](../../tests/steam-financial-requery-guards.test.mjs). No financial key, partner account or real sale was accessed.

## Date corrections are not new sales to append

[Valve's IPartnerFinancialsService documentation](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) defines `GetChangedDatesForPartner`, which reports a date again when its calculated sales data changes. Valve specifically instructs partners to **re-fetch the entire day and replace the prior stored results**. Later refunds, settlement changes and corrections may revise totals or remove previously returned rows. Appending the refreshed date instead would double-count old rows, overstate gross volume and misclassify real zero/nonzero results.

Each changed Pacific Time date must restart `GetDetailedSales` with `highwatermark_id=0`. Subsequent pages continue using the previous page's `max_id`; when `max_id` equals the input cursor, the day is exhausted. A partial last page or a skipped cursor is **not a complete sales day**. Dates returned by the API are defined in Pacific Time and must not be silently regrouped as UTC or a publisher's local civil day.

## Deliberately invented correction fixture

The [synthetic controller](../../site/steam-financial-requery-guards.mjs) takes two fabricated May 2026 financial dates. First it processes 10 paid Steam package units, one return and seven third-party retail-key activations on May 1. On May 2 it sees two sold Steam package units with four returned units and five microtransaction units. Then a changed-date notification causes the **entire May 1 snapshot to be replaced** with eight sold Steam package units, three returns and no key-activation row.

The final illustrative **Steam package units** are 10 sold and seven returned over both days, yielding three net period units. The corrected earlier date also removes the previously reported seven retail activations; retaining them would be an invented duplicate/reconciled-line error. Microtransactions are separate. A day's four returns against two new purchases is permissible because refund and purchase dates need not coincide; these are not purchaser-cohort probabilities.

The test fixture is not a real Steam game, real publisher, real historical transaction or a claim of Steam-wide refund behavior.

## Important additional coverage gates

- `Package` + `Steam`, `Package` + `Retail`, and `MicroTxn` have different economic meaning; [Valve's API](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) describes separate units sold, returned and activated, package/app identities and primary-AppID accounting fields.
- A correctly completed day for one Steamworks **financial partner group** does not establish all previous payment partners' rights. During an [AppID transfer](https://partner.steamgames.com/doc/gettingstarted/managing_apps/transfer?l=english), earlier-period financial visibility is separated by partner payment rights unless granted separately.
- A full refresh of changed dates does not prove no unseen eligible AppIDs, unmodified but uncaptured older reporting days, untracked bundles or games that have never sold. One must independently establish the eligible historical frame and account rights.
- The official partner-wide financial API key is exceptionally sensitive and must never be stored in public research, tests, fixtures or version history.

The executable model refuses malformed, duplicated, sensitive-looking or incomplete synthetic batches, rejects mixing granted and own-account reporting scopes, and reports **null** for actual AppID sales, real zero-sales shares, and publisher profit. It is an evidence-integrity protocol rather than an income estimate.
