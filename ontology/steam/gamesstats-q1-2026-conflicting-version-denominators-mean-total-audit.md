# Games-Stats Q1 2026: incompatible vendor report versions and revenue arithmetic

**Reviewed October 29, 2026.** [Machine record](gamesstats-q1-2026-conflicting-version-denominators-mean-total-audit.json) · [arithmetic guard](../../site/steam-vendor-mean-total-consistency-guard.mjs) · [regression tests](../../tests/steam-gamesstats-version-reconciliation.test.mjs).

## Two public versions of the same vendor report

The [Games-Stats Patreon release, April 22](https://www.patreon.com/gamesstats/posts/indie-pocalypse-156244811) calls its report **Q1 2026** but includes releases **January 1–April 16**, listing **7,478 games**, approximately **$110,000 mean revenue**, **$250 median revenue**, and about **$650 million total revenue**.

The [operator's similarly titled website page](https://games-stats.com/blog/Steam_in_Q12026/) instead reports **6,169 games** over **January 1–April 22**—a *later* cutoff with *fewer* listed games—plus approximately **$120,000 mean**, **$290 overall median**, **$350 paid-only median**, and approximately **$733 million total**. It reports **1,048 F2P and 5,121 paid titles**, summing to 6,169. The website text was available in a search-index retrieval, but direct fetching the page returned HTTP 403; it has no dependable publication date or independently preserved version history.

**These are two documents from one operator**, not independent published samples. The larger first version may have different filters, snapshots or model inputs, but the vendor does not supply a defensible crosswalk to establish comparability. The title **Q1** is not a strict calendar quarter for either cohort, because both extend into April.

## Mean times count must approximately agree with aggregate total

For the Patreon figures, **7,478 × $110,000 = $822.58 million**, versus the printed **$650 million**. The latter would imply a mean of **about $86,922**, not about $110,000. This $172.58 million difference is far beyond the scale explained by rounding a mean to the nearest $10,000, if the same game set and revenue base is intended. It is **not possible to identify which printed figure is incorrect**.

For the website version, **6,169 × $120,000 = $740.28 million** versus about **$733 million** printed, implying a mean around **$118,820**. That gap is roughly 1% and could be ordinary approximate rounding. Agreement in arithmetic does not authenticate the original sales model or prove actual receipts.

The Patreon report describes a top-three total in *net* dollars while discussing a total-revenue estimate whose financial stage is not clearly aligned. The website also mixes a top-three net label into total-revenue commentary. Do not calculate an exact gross concentration ratio without reconciling the same observation period and deduction basis.

## Boundaries for income and zero-sales research

Both report versions rely on vendor modeling; neither publishes raw first-paid-release financial statements, a signed complete AppID census, a zero-orders merchant ledger, nor a revision history sufficient to explain the two incompatible populations. The paid-only reported median is **model-based game revenue**, not legal-partner payouts or after-cost personal income.

The [synthetic arithmetic guard](../../site/steam-vendor-mean-total-consistency-guard.mjs) checks each set of reported n/mean/total for consistency, and returns no authenticated market median, financial receipts or zero-sale rate. This audit documents discrepancies; it does not select one version as correct or infer that the actual market has a particular median.

**Outstanding:** original model cohort exports, eligibility changes, exact retrieval snapshots, an audited gross-vs-net definition, merchant paid orders and publisher receipts.
