# Historical Steam catalogue counts versus filtered owner-price proxies

**Reviewed October 29, 2026.** [Machine-readable audit](steam-aiepa-2024-2025-raw-vs-filtered-catalog-proxy-audit-2026.json) · [arithmetic scope guard](../../site/steam-aiepa-catalog-scope-audit.mjs) · [tests](../../tests/steam-aiepa-catalog-scope-audit.test.mjs). This is an audit of published **third-party working-paper statistics**, not an independent replay of the underlying Kaggle catalog or a financial census.

## Raw snapshots and analyzed subsets are different populations

The [May 2026 AIEPA Lab working paper](https://aiepa.ai/publications/working-paper-01-steam-2026-05) reports May 2024 and March 2025 raw snapshots of **87,806** and **94,948** catalogue entries. Its strict filter removes, among other things, demos and placeholder entries with estimated zero owners *and* zero reviews, retaining **77,184** and **81,251** rows. Thus **10,622** and **13,697** raw rows respectively are outside the analytical sample. The March 2025 source separately reports **13,656** rows meeting the zero-owner/zero-review exclusion condition; exclusion conditions overlap, so these may not be added.

The same paper reports **78,264** titles present in both snapshots, **16,684** only in March 2025 and **9,542** only in May 2024. These three values exactly reconstruct both **raw** totals: 78,264 + 16,684 = 94,948, and 78,264 + 9,542 = 87,806. The shared count **exceeds the smaller 77,184 filtered May 2024 sample**. It cannot be interpreted as an intersection of two strict-filtered samples; scope must be carried whenever a survival percentage is inferred. The paper suggests missing rows may be delistings, but absence from a third-party capture alone does not independently prove delisting. Neither snapshot independently reconstructs a first-paid-live-title cohort.

## Price and owner midpoints are not real transaction receipts

The strict March 2025 sample's price-tier counts (**6,921 F2P, 57,443 budget, 15,237 mid, 1,650 AAA**) sum to 81,251. The paper converts estimated binned ownership to geometric midpoints and multiplies by current retail price, reporting proxy median revenues of **$0, $49,900, $199,900 and $1,540,361** by tier. Its broad near-zero-median prose should not override these printed non-F2P table values. Because the paper's tier metric is an owner-price proxy, even the nonzero figures are **not authenticated historical checkout gross, cash deposits or labor-adjusted profit**. The proxy's free-to-play zero is unavoidable when price equals zero, even if the game sells optional items.

[Steam Spy's primary methodological description](https://steamspy.com/about) explicitly distinguishes modeled ownership from a purchased copy: gifts, external keys, bundles and free promotions may add licenses. That further limits the interpretation of owner bins. The paper's statement that these ranges come from Valve-published public title data is **not independently substantiated** for the original imported Kaggle records. The origin of the bins must be verified before calling this Valve-reported ownership.

## What this adds to the research protocol

The [deterministic synthetic count guard](../../site/steam-aiepa-catalog-scope-audit.mjs) checks the raw/filtered partitions, cross-snapshot reconciliation and tier-count arithmetic, and refuses to generate a sale, revenue or zero-earner percentage. This is a **source-audit**, not reproduction of the original dataset or its profitability claims. A verified first-paid AppID cohort, historically complete retired titles, legal-publisher mapping, transaction evidence and consistent 30/365-day windows remain unavailable.

**Unknown:** exact zero-sale share, historical paid launch denominator, true delisting count, actual legal-publisher net income and typical developer profit. No partner account, private purchase history, credentials or raw Kaggle rows were used.
