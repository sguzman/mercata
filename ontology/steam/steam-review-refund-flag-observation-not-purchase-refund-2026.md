# Steam review-author refund flags versus actual purchase refunds

**Reviewed October 30, 2026.** [Structured study](steam-review-refund-flag-observation-not-purchase-refund-2026.json) · [synthetic aggregate audit](../../site/steam-review-refund-flag-audit.mjs) · [regression tests](../../tests/steam-review-refund-flag-audit.test.mjs).

## Official field meaning

Valve's [IUserReviewsService/GetAppReviews documentation](https://partner.steamgames.com/doc/webapi/IUserReviewsService) defines a per-review `refunded` boolean identifying whether the review author was refunded for the app. The same public review entry may contain `steam_purchase` and `received_for_free` attributes describing that author's purchase origin and free-receipt declaration. These are review-author observations, **not** a list of paid orders, payment amounts, refund transactions, or publisher remittances. Non-reviewing buyers do not appear in review results. No causal or matched purchase-cohort refund rate can be established from this field.

The current API's filters cover language, Steam versus other acquisition, positive/negative review type, off-topic periods and optional date/playtime/hardware scope. Anonymous responses may be cached for up to ten minutes. Thus an observed flagged-review fraction depends on the requested and accessible review selection, not necessarily a frozen historical population. Even a zero observed flag count would not prove zero actual refunds.

## Purely invented aggregate example

The [review-flag checker](../../site/steam-review-refund-flag-audit.mjs) reuses the existing strict [synthetic review pagination and query audit](steam-review-api-query-scope-migration-2026.md). It accepts only three nonnegative integer totals per fictional page: `refunded_true`, `refunded_false`, and `refunded_unobserved`. They must sum to that page's declared review count; unknowns are never silently interpreted as false. Every page is tied to the same fictional query and cursor sequence. Raw reviews, player identifiers, AppIDs, keys and payment records are not accepted.

For three invented reviews with one true, one false and one unknown flag, the **synthetic review-row flag share** lies between 1/3 and 2/3. Neither bound says anything about the fraction of paid orders that were refunded. For zero returned reviews the flag share is undefined, not zero. Even a fully observed fictional query produces only a fictional *review* fraction.

## Financial distinction and remaining evidence gaps

Steam publisher refund exposure requires authorized financial transaction reporting with gross units, returned units, cohort timing, accounting stages and payee attribution. Review-level `refunded` metadata cannot substitute for those records, validate author-reported financial outcomes, establish representative first-game refunds or estimate developer profit.

**Still unknown:** actual review-author refunded fraction, nonreviewing purchasers, paid-order refund rate, matched purchase cohorts, real publisher refunds, publisher cash, developer profit and marketwide zero paid-sales prevalence. No real review content, people, accounts or financial records were accessed. This revisits an already registered official Valve source and does not create another independent source or sample.
