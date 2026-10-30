# September 2026 Steam modeled platform revenue: top-500 concentration is not newcomer income

**Reviewed October 29, 2026.** [Structured study](alinea-september-2026-platform-gross-top500-vs-newcomer-income.json) · [synthetic scope audit](../../site/steam-month-revenue-top500-scope-guard.mjs) · [regression tests](../../tests/steam-month-revenue-top500-scope-guard.test.mjs). All financial figures below are **estimates made by a single commercial analyst**, not Valve financial disclosures, independent order records or settled developer payments.

## Month, quarter, year-to-date and forecast are four different measures

In an [October 1, 2026 report](https://alineaanalytics.substack.com/p/steams-top-september-2026-games), Alinea Analytics estimates Steam revenue of **$1.7B in September 2026** and **$5.5B during Q3 2026**, described as increases of **13%** and **12%** respectively over corresponding 2025 periods. It reports **$16.5B January–September 2026** against **$14.5B January–September 2025**. These are rounded vendor-model figures, not Steamworks publisher statements or an official year-end market tally. The author's expectation of **more than $20B for calendar 2026** is a *forward-looking projection*, not a completed-year observation.

The source estimates that its **500 highest-grossing titles** account for approximately **75%** of September's modeled Steam revenue. Even if the approximation were accurate, that says the *ranked upper 500* account for a concentrated revenue share, not that 75% of **new** games earn income or that a title's first-month proceeds can be inferred from the global total.

## A revenue-weighted top-500 cohort mixes business models and catalogue ages

Within the selected 500 titles, the vendor attributes **20.5%** of modeled revenue to *new 2026 intellectual property* and **79.5%** to *established IP*, with the cited **3.8% remake/remaster** value a nested classification rather than a third independent category. A distinct release-year split assigns **33.6%** to releases from 2026, **8.7%** to 2025 releases, and **9.3%** to 2024 releases; that revenue should not be added to the IP shares because the axes overlap.

The report also states that **free-to-play titles represent 16% of these top-500 games but 25.6% of their revenue**, and describes nearly **$168M** of modeled revenue from four high-profile F2P titles in September. This directly illustrates why *free game price* is not the same thing as *zero monetization*. It does not reveal how many individual customers made a purchase or how much a typical free game earns. The report is produced by an analytics vendor that offers commercial access to its models; a syndicated recap is not independent validation.

## The missing denominators

The monthly total includes **back-catalogue products, earlier paid releases, free-to-play spending, expansions and mixed franchise histories** as defined by the model. A study of new small-game income requires a complete set of *first-time paid releases* with consistent first 30/90/365-day windows and income by actual legal payee. The top-500 ranking omits the long bottom tail and offers no count of zero-paid-order releases. No such release frame, realized publisher remittance distribution or after-cost creator profit was provided.

The accompanying [synthetic guard](../../site/steam-month-revenue-top500-scope-guard.mjs) tests count/percentage partitions, acknowledges rounding, and always leaves those population-level income outcomes unknown.

**Current evidence result:** one more bounded model observation about platform-scale gross concentration, *not* a new empirical median for an independent developer.
