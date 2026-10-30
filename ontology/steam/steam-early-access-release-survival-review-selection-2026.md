# Steam Early Access graduation: 2013–2023 cohorts, review selection and removal bounds

**Independent primary research:** [Gamer of Passion, *Steam flags nearly 7,000 Early Access games as not updated in a year*](https://gamerofpassion.com/steam-early-access-study/), published October 9, 2026. Public Steam store snapshot: **September 26, 2026**; corroborating Steam post/archival collection finished in early October. The researcher identifies games through Steam's public store, reviews, news/events, and archived app lists, **not authenticated publisher sales or financial records**.

[Machine-readable source-specific counts](steam-early-access-release-survival-review-selection-2026.json) · [reconciliation model](../../site/steam-earlyaccess-cohort-coverage.mjs) · [regression tests](../../tests/steam-earlyaccess-cohort-coverage.test.mjs).

## Do not mix the three nested frames

| Frame | Denominator | Meaning |
| --- | ---: | --- |
| Recovered game universe across entry years | **23,247** | Games the author's multi-route method can establish as having entered Steam Early Access |
| Recovered 2013–2023 entrants, every review count | **14,597** | Historical entry-year frame including 4,456 games with fewer than 10 reviews |
| 2013–2023 entrants with at least 10 reviews | **10,141** | Comparably discoverable older-graduate frame used for the main outcome distribution |

For the last group, the statuses are **disjoint**, as of the September 26 snapshot:

| Status within the 10,141 | Games |
| --- | ---: |
| Reached full release (including some subsequently removed) | 6,144 |
| Removed from sale while still in Early Access | 702 |
| Still in Early Access and carrying Steam's no-update notice | 2,672 |
| Still in Early Access, without that no-update notice | 623 |
| **Total** | **10,141** |

The **404 games that reached 1.0 and were later delisted** are *already inside* the 6,144 graduates; adding them as a fifth disjoint category would double-count the same titles. The 702 removals-before-1.0 and other reported removal categories are **minimums**, because archived app lists miss short-lived removals and old review metadata is incomplete.

## Why 61% is not a typical game's guaranteed graduation rate

In the 10+ review historical cohort, **6,144/10,141 = 60.6%** had reached 1.0. In all 14,597 games recovered from the same entry years, the article reports approximately **51%**. Its under-10-review group has **4,456** games with a reported **30.8%** full-release share, while the 1,000+-review group has **1,624** games with **78.8%**.

The differences are conditional associations, not causal estimates. Reviews are measured retrospectively and **can increase after a successful 1.0 launch**, so selecting games with many current reviews conditions on an outcome-related variable. Low-review and delisted early games also have lower source discoverability. The main cohort has at least two years and eight months of possible follow-up, but earlier and later entry years still have different elapsed time. These ratios cannot establish eventual full release, a trend, paid copies, a zero-sale fraction or legal-publisher income.

The author estimates that the review-based discovery misses some older graduates. For example, **286 of 300** known historical graduates were found, and Early Access review flags do not reach certain pre-May-2014 games. These are limitations, not missing observations that Mercata fills with hypothetical counts.

## Live storefront “no update” note is not verified abandonment

Among **12,320** games still in Early Access in the September 26 snapshot, **6,989** displayed Steam's no-update-over-a-year notice (about **56.7%**). Among **9,063** games that had been in Early Access for at least a year, **6,977** carried the notice (about **77%**). These different age denominators must be retained. The note counts Steam's main-branch build and specified update posts; it may miss beta-only work and off-Steam activity, while a token update can suppress the note. It neither proves that an individual game was abandoned nor quantifies lost purchases or failures of contractual support.

## Conditional development time and post-release support

For a **selected 3,547 graduates** from the 2013–2020 entry groups who reached 1.0 within five years, the study finds **315 days** median Early Access time. This is a *graduation-conditioned duration*, not the median wait of all games including never-completing ones. Among **4,399** games with 10+ reviews leaving EA from August 2019 through July 2025, **51%** had no recorded Steam update post 3–15 months after release. The author explicitly notes unposted patches; missing posts cannot establish zero development or an absence of customer support.

## Evidence and replication boundary

This study is unusually transparent about data collection and publishes a row-level CSV, but Mercata uses only source-attributed aggregate numbers. No user identities, accounts, merchant transactions, site screenshots, or third-party dataset replication were imported. The tested helper enforces published cohort arithmetic and preserves missing sales/rights/profit as **unknown**. A proper commercial study would need an originally paid release frame, verified legal payees, authenticated ledgers, transfer and package attribution, and comparable follow-up horizons.
