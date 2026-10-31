# Steam review API migration: review-query scope and pagination are not paid sales

**Reviewed October 30, 2026.** [Structured research record](steam-review-api-query-scope-migration-2026.json) · [pure synthetic query auditor](../../site/steam-review-api-query-scope-guard.mjs) · [regression tests](../../tests/steam-review-api-query-scope-guard.test.mjs). This extends the [review and estimation source audit](review-data-and-sales-estimation-2026.md). All query fixture identifiers and page counts are invented.

## Updated official endpoint and incompatible defaults

Valve's [GetAppReviews method](https://partner.steamgames.com/doc/webapi/IUserReviewsService) replaces the [deprecated Get List route](https://partner.steamgames.com/doc/store/getreviews?l=english). The new service uses `input_json` with **numeric** sort, purchase-origin and review-type enum values, and `languages` as a list instead of the legacy scalar `language`. Its default is **English** review language, **Steam-purchase-origin** reviews and **off-topic periods excluded**. Therefore a default page or summary is **not a count of all user reviews, all purchasers, all languages or every review period**.

The supported sort codes are Helpful 0, Recent 1, Updated 2 and Funny 3. Valve recommends **Recent or Updated** to exhaust paginated historical reviews; Helpful can expand its date search rather than serving a stable full-history traversal. Page size is at most 100. A query's `total_matching` is different from the number of reviews on each page. The `query_summary` score totals are first-page-only and require the all-review-type setting; they must not be summed as if each page repeats a new count.

## A synthetic migration and data-integrity gate

The [legacy-filter translator](../../site/steam-review-api-query-scope-guard.mjs) requires explicit filter, language, review type, purchase origin, page size and off-topic settings instead of silently adopting changed defaults. It maps old labels to the documented new enums but **does not call the old endpoint or issue network requests**.

The [page-count checker](../../site/steam-review-api-query-scope-guard.mjs) accepts only fictional fixture identifiers and summary counts, **never raw reviews or user identifiers**. It checks cursor order, unique fake continuation cursors, consistent total matching, bounded page sizes, score-summary placement, and whether an empty terminal page reconciles with accumulated counts. It identifies only an **internally consistent synthetic all-language/all-purchase query candidate** if all review types and off-topic periods are included and the sort is Recent or Updated. Even that state is **not proof** that a live review count is exhaustive; the underlying public API can change while paging, filters may be applied server-side, and reviewer IDs have not been independently deduplicated.

The [official user review policy](https://partner.steamgames.com/doc/store/reviews) distinguishes visible reviews from the score-eligible subset. Steam key recipients can write reviews, but those reviews generally do not contribute to the standard paid-game review score. Both review rows and score summaries are different from gross paid game checkouts, refund-adjusted units, developer/publisher remittance and personal profit.

## Research consequence

A vendor's `0 reviews`, a public storefront label, a default filtered GetAppReviews query and an all-language/all-purchase query are **not automatically interchangeable zeroes**. A missing, narrowed, incomplete or unverified query is missing evidence, not a proved zero paid sale. No live Steam review endpoint, real AppID list, individual review, partner financial service or player account was accessed for this audit.

**Still unknown:** complete historical original-paid-game frame including delistings, all actual review observations at matched release ages, verified zero paid orders, model calibration on reviewless titles, publisher cash and developer profit.
