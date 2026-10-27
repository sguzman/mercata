# Older versus newly published paid listings: matched-control specification

**Reviewed October 27, 2026.** The [Search & Browse policy](https://itch.io/docs/creators/getting-indexed) explicitly distinguishes first publication, later indexing and updates: a build upload does **not** reset a project's original publish date. The 2018 [impression analytics launch](https://itch.io/updates/updates-to-project-analytics-filtering-collections-impressions-and-more) describes historical publisher-facing exposure signals, not a verified present-day buyer-rate API.

An age comparison should preserve the original publish date, first paid offer date, last build update and first observed search eligibility separately. Define hypothetical cohorts of 0–7, 8–30, 31–90 and more than 90 days old, each observed over the **same actual calendar window length**. Do not compare new-release launch week against old games' cumulative lifetime views.

Compare games only when matched on paid offer, price/discount, genre, platform/input, buyer-language access, original project identity, prior portfolio, referrer mix and account followers. Include unseen/unranked pages or explicitly state the survivorship bias. Model editorial selection and marketing as potential confounders. A higher ranking for a long-running page would not, without these controls and actual orders, establish an incumbent revenue advantage.

The existing [rolling public filters](recent-release-filter-frames-2026.md) recorded 1,057 Paid last-7-day results, 3,752 Paid last-30-day results and 16,776 all-price newly released last-30-day results. They are **not the same cohort, same crawl time or verified independent new paid releases**. A future test requires owner-authorized comparable impressions, page visits, retained paid orders, refunds, actual labor/cost and deduplication.

The existing task's required matched windows and audience controls are now explicit and testable. **No 2026 matched cohort, age-based revenue gap, or causal ranking advantage was observed.** [Machine protocol](old-new-listing-cohort-control-protocol-2026.json).
