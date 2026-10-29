# Steam financial reporting: why changed dates must replace prior results

**Reviewed October 29, 2026.** [Machine-readable synthetic case](steam-financial-changed-date-requery-2026.json) · [deterministic guard](../../site/steam-financial-requery-guards.mjs) · [tests](../../tests/steam-financial-requery-guards.test.mjs). No financial key, partner account or real sale was accessed.

## Two independent highwatermarks

The same official interface provides **an outer changed-date polling watermark** from `GetChangedDatesForPartner` and an **inner per-date page cursor** for `GetDetailedSales`. They are not interchangeable. Each returned changed date triggers a new detailed query beginning at a per-date cursor of zero even if that date appeared in an earlier poll. A returned unchanged outer marker with no changed dates is a valid no-update result; repeated dates in later polls signify a required full refresh rather than duplicate new sale events.

The additional [synthetic polling audit](../../site/steam-financial-requery-guards.mjs) uses three invented polls and two changed days, with May 1 repeated in successive polls. It checks monotonic outer cursor chaining, no duplicate dates within a single poll, and the separate date-level refresh requirement. No financial credentials, event timing or sales distributions were observed.


## Poll-to-refresh checkpoint barrier

The synthetic [refresh event log](steam-financial-changed-date-requery-2026.json) now joins changed-date notifications to complete daily batches. Each poll must process **each notified PT date exactly once**, including dates repeated in later polls, before its outer watermark can be committed. A duplicate batch, unannounced date, missing refresh, unlinked batch, out-of-order poll or prematurely saved watermark fails validation. A poll with no changed dates may commit without manufacturing zero-sale records. The reconciliation uses the **declared event sequence**, not the storage order of the underlying fixture array, when replacing corrected days.

Valve's [published integration sequence](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) stores the returned changed-date watermark only after the detailed daily fetches are complete. The guard models that prerequisite, but an invented log cannot prove a real application's transactional durability, event timing, historical partner visibility or all-AppID population coverage. These fixture dates use ISO `YYYY-MM-DD`; Valve also accepts slash-separated dates and instructs clients to preserve the PT date without timezone conversion. No real financial records, API keys or new estimates enter this test.

## Date corrections are not new sales to append

[Valve's IPartnerFinancialsService documentation](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) defines `GetChangedDatesForPartner`, which reports a date again when its calculated sales data changes. Valve specifically instructs partners to **re-fetch the entire day and replace the prior stored results**. Later refunds, settlement changes and corrections may revise totals or remove previously returned rows. Appending the refreshed date instead would double-count old rows, overstate gross volume and misclassify real zero/nonzero results.

Each changed Pacific Time date must restart `GetDetailedSales` with `highwatermark_id=0`. Subsequent pages continue using the previous page's `max_id`; when `max_id` equals the input cursor, the day is exhausted. A partial last page or a skipped cursor is **not a complete sales day**. Since `max_id` denotes the highest returned record identifier, the synthetic validator also rejects any empty page that advances the cursor; otherwise a fabricated response could conceal missing rows and falsely appear to have zero sales. An empty terminal page with an unchanged cursor remains valid. Dates returned by the API are defined in Pacific Time and must not be silently regrouped as UTC or a publisher's local civil day.

## Deliberately invented correction fixture

Valve's published `GetDetailedSales` example expresses `gross_units_returned` as a **negative signed quantity** (for example `-2` for two returns), whereas `gross_units_sold` and `gross_units_activated` are nonnegative. Accordingly, the synthetic fixture stores returns as negative row values. The audit converts those signed values to **positive return magnitudes only in its summary fields** (`*_period_returns`) and calculates net units by subtracting the positive magnitude from gross sales. Positive or fractional return values fail closed rather than silently double-negating refunds.

The [synthetic controller](../../site/steam-financial-requery-guards.mjs) takes two fabricated May 2026 financial dates. First it processes 10 paid Steam package units, one return and seven third-party retail-key activations on May 1. On May 2 it sees two sold Steam package units with four returned units and five microtransaction units. Then a changed-date notification causes the **entire May 1 snapshot to be replaced** with eight sold Steam package units, three returns and no key-activation row.

The final illustrative **Steam package units** are 10 sold and seven returned over both days, yielding three net period units. The corrected earlier date also removes the previously reported seven retail activations; retaining them would be an invented duplicate/reconciled-line error. Microtransactions are separate. A day's four returns against two new purchases is permissible because refund and purchase dates need not coincide; these are not purchaser-cohort probabilities.

The test fixture is not a real Steam game, real publisher, real historical transaction or a claim of Steam-wide refund behavior.

## Important additional coverage gates

- `Package` + `Steam`, `Package` + `Retail`, and `MicroTxn` have different economic meaning; [Valve's API](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english) describes separate units sold, returned and activated, package/app identities and primary-AppID accounting fields.
- A correctly completed day for one Steamworks **financial partner group** does not establish all previous payment partners' rights. During an [AppID transfer](https://partner.steamgames.com/doc/gettingstarted/managing_apps/transfer?l=english), earlier-period financial visibility is separated by partner payment rights unless granted separately.
- A full refresh of changed dates does not prove no unseen eligible AppIDs, unmodified but uncaptured older reporting days, untracked bundles or games that have never sold. One must independently establish the eligible historical frame and account rights.
- The official partner-wide financial API key is exceptionally sensitive and must never be stored in public research, tests, fixtures or version history.

The executable model refuses malformed, duplicated, sensitive-looking or incomplete synthetic batches, rejects mixing granted and own-account reporting scopes, and reports **null** for actual AppID sales, real zero-sales shares, and publisher profit. It is an evidence-integrity protocol rather than an income estimate.
