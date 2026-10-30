# Valve current Store API: pagination integrity does not prove historical paid-launch completeness

**Reviewed October 29, 2026.** [Machine record](official-paginated-current-game-catalog-is-not-historical-census-2026.json) · [synthetic cursor auditor](../../site/steam-store-api-pagination-synthetic-guard.mjs) · [tests](../../tests/steam-store-api-pagination-synthetic-guard.test.mjs).

## Official endpoint and scope

The [Steamworks IStoreService documentation](https://partner.steamgames.com/doc/webapi/IStoreService?l=english) describes `IStoreService/GetAppList/v1`, which requires a **Steam Web API key** and returns **currently available Steam Store applications**, ordered by AppID. The API defaults to **games only**, with optional content-type flags for DLC, software, videos and hardware. Valve documents `max_results` default **10,000**, maximum **50,000**, and instructs pagination using the **last AppID of the previous page** as the next call's `last_appid` cursor. One page is not the full catalog.

`if_modified_since` requests only items changed or added since a timestamp. It is an incremental metadata feed, not a replacement for a complete baseline. An item's `last_modified` may describe a change to price or game information, **not** first public paid availability. A changed `price_change_number` can indicate a discount or price adjustment; it is not a record of sold units or a realized transaction price.

The [legacy ISteamApps GetAppList](https://partner.steamgames.com/doc/webapi/ISteamApps) is explicitly deprecated due to catalog scale. The new API still does not enumerate delisted historical games, first-paid Early Access dates, originally free transitions, merchant paid-order histories or legal bank payees.

## A chain check before a current-store snapshot can be trusted

The [pure synthetic cursor guard](../../site/steam-store-api-pagination-synthetic-guard.mjs) accepts **fake six-digit AppID tokens only** and verifies sorted unique items, exact continuation cursors, page-size bounds, consistent filters and an explicitly declared terminal page. A truncated or broken page chain remains incomplete or throws, preventing false inventory coverage in downstream synthetic experiments.

Its declared complete response is **only a check that the supplied page chain is internally coherent**. It is not an authenticated API execution, server-side completeness guarantee, or historical census. A `modified_since` chain is a **delta**, even when its own pages are internally complete. The prior [historical snapshot study](steam-historical-snapshot-survivorship-2026.md) further shows that disappearance from a later list does not automatically prove retirement.

The project did not call a credentialed API, retrieve real AppIDs, import user account data or infer sales from prices. Reconstructing a full first-paid-release population still requires date-qualified historic eligibility evidence and merchant-authenticated purchases including zeros.

**Remaining unknowns:** actual 2025/2026 complete initial-paid-release frame, omitted or delisted releases, real paid order counts, and publisher revenue or profit.
