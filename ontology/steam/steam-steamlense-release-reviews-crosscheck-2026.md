# Steamlense 2024–2025 paid/free catalog cross-check (October 31, 2026)

[Source: Steamlense public statistics](https://steamlense.com/stats) · [Provider methodology](https://steamlense.com/methodology) · [Dated structured observation](steam-steamlense-release-reviews-crosscheck-2026.json) · [Audit](../../site/steam-steamlense-release-reviews-crosscheck.mjs) · [Tests](../../tests/steam-steamlense-release-reviews-crosscheck.test.mjs)

Steamlense independently publishes annual game releases separated into *paid* and *free-to-play* categories, along with review-count bands. At the dated snapshot, its **current catalog** reported:

| Release year | Currently classified paid | Currently classified free to play | Total in provider catalog |
| --- | ---: | ---: | ---: |
| 2024 | 14,574 | 3,230 | 17,804 |
| 2025 | 17,644 | 2,988 | 20,632 |

Within this provider's catalog, the reported total increased by **2,828** between release years, while the paid-category count increased by **3,070**. Those are descriptive differences between dated-release cohorts in a *mutable current catalog*, not proof that those additional entries first launched as paid games. They do not count purchases or measure profitability. SteamDB, GameCharts and Steamlense use different inventories and capture definitions; unmatched provider totals are **not** statistical confidence bounds on a hidden true census.

The [same source](https://steamlense.com/stats) reports **61.0% of its 2025-released games had fewer than ten public reviews** at observation. The population includes paid **and** free-to-play games, and release dates span an entire year, so their ages at capture vary. This is not a fixed first-month review rate, a share of paid publishers, an exact-zero-order rate, or evidence that those games never had buyers. The phrasing on a live overview cannot establish whether the threshold was ever crossed at a different time.

## Scope and identifiability

The [provider's published method](https://steamlense.com/methodology) describes Steam application/store/review inputs, SteamSpy and price histories; review-based sales and revenue values are explicitly modeled, not Valve partner financial reports. Its refresh cadence varies by game. The public aggregate does **not** supply a validated AppID-matched record of the *first playable release at a positive price*. Games once paid and later free, changes to dates or catalog labels, and historical delistings can alter today's category split. Missing historical titles are not recovered merely because a page has a yearly total.

This is useful corroboration of release *supply* and broad review sparsity. It does not solve the remaining originally-paid population, authorized transaction ledger, genuine zero-order fraction or net publisher-income gaps. Zero reviews may coexist with sales; apparently paid current listings may not have been originally paid.

The accompanying arithmetic audit accepts only a bounded aggregate fixture, requires year and paid/free sums to reconcile, and explicitly leaves paid-unit and financial outputs unknown. No app IDs, buyer profiles, reviews or private finance records are imported.
