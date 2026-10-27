# Owner purchase CSV exports: a feasible consented transaction-data path

**Reviewed October 27, 2026.** [Structured evidence](owner-purchase-export-measurement-route-2026.json) · [privacy-restricted aggregate audit](../../site/itch-consented-owner-purchase-windows.mjs). No owner account, payment, purchase CSV or buyer record was accessed.

The operator's [December 13, 2013 feature announcement](https://itch.io/updates/csv-export-for-purchases) documents **monthly purchase CSV exports** from game analytics. Its [February 1, 2015 seller update](https://itch.io/updates/new-aggregated-purchases-page-for-sellers) describes an **account-wide purchases view, daily graph and CSV export** for owned projects, sales and bundles. These are genuinely closer to measured paid orders than public catalog counts or page views. Their precise present-day export format is not established by the original posts.

In a [January 2020 support thread](https://itch.io/t/653777/number-of-downloads-in-a-time-range), an administrator mentioned accessing daily-owner graph JSON but clearly described that method as **undocumented and subject to change**. Mercata does not call or depend on it.

A [February 2026 GitHub issue](https://github.com/itchio/itch.io/issues/1868) reported a distinction between **owner CSV export** and a delegated administrator who could inspect purchases but could not export. The operator subsequently said this *should now be possible*, and the issue was **closed as completed on July 16, 2026**. The older bug report must not be misrepresented as an enduring role restriction; the exact current permission scope for any particular account is untested.

## Research-grade measurement contract

A willing seller would privately review and combine owner-controlled CSVs into strictly nonidentifying cumulative **7-, 30-, 90-, and 365-day** snapshots from the first confirmed positive-minimum paid game release date. Each window must cover actual mandatory-price game sales, without donation-only activity, keys, free claims, physical rewards or unrelated bundles. Reversed orders must be reconciled to the **original purchase cohort**, using the same refund-as-of observation date and one stated currency. The 7-day count is already inside the 30-day count, so the cumulative counts **must not be summed**.

The linked pure JavaScript audit processes **only seller-authorized, previously aggregated and privacy-reviewed counts**. It rejects buyer IDs, raw CSV columns, unreconciled refunds and still-immature windows. An absent window remains **null**, not zero. A complete, source-verified window with no sales may legitimately be zero. Its results exclude profit, deposited seller cash, distinct buyers, platform totals or any publisher mean and median.

Historical exporter support improves the *feasibility* of later real research, but even a perfect voluntary seller sample lacks a probability-based denominator including eligible zero-sale and delisted publishers. This round acquired **no real commercial records** and does not manufacture an earnings estimate. The [operator's payment guide](https://itch.io/docs/creators/payments) separately distinguishes gross charges, merchant fees and payout settlement.
