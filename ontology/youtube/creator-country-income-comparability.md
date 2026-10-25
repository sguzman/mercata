# Comparing YouTube creator income across countries: what can actually be measured

**Reviewed:** 2026-10-25. This is a research/validation protocol, **not a dataset of real creator earnings by country**.

Primary documents: [YouTube Analytics API country dimension](https://developers.google.com/youtube/analytics/dimensions), [authorized channel reports](https://developers.google.com/youtube/analytics/channel_reports), [Analytics limitations](https://support.google.com/youtube/answer/9101241?hl=en), [AdSense payment thresholds](https://support.google.com/youtube/answer/14727140?hl=en), and [OECD purchasing power parities](https://www.oecd.org/en/data/datasets/purchasing-power-parities.html).

## Three geographical concepts that cannot be swapped

| Concept | Actual unit | Where established |
|---|---|---|
| **Viewer country** | Country associated with a channel's measured viewer activity and estimated revenue | Authorized Analytics report with `country` dimension or country filter; `ZZ` denotes unassigned location |
| **Creator residence** | Where the natural person or legal payee actually resides | Owner-supplied legal/account/creator panel evidence, never derived from viewer geography or channel language |
| **Payment account / tax geography** | Settlement currency, payment address, tax documentation and actual local expenses | Individual AdSense for YouTube account and jurisdictional requirements; not viewers' country |

The country API report supports estimated revenue and estimated ad revenue for a **monetized YPP channel** with monetary-read permission. Revenue is associated with viewer geography; it does **not** estimate the income of a randomly chosen creator residing there. Google states that revenue-by-geography data is not limited, but other geographic audience metrics may be limited or suppressed for privacy.

## Reproducible owner-authorized comparisons

For one approved channel, first define a single date window, report currency, geography and two or more viewer-country codes. An aggregate `dimensions=country` report can describe that one owner's relevant country-attributed activity. To examine calendar months for specified countries, use `dimensions=month` **with separate country filters** as the documented channel time-based report permits; do not assume an unsupported joint `country,month` matrix.

Always retain `estimatedRevenue`, `estimatedAdRevenue`, `views` and `monetizedPlaybacks` as **different measures**. Estimate, finalization, payout eligibility, transfer issuance and bank receipt are also distinct accounting stages. Country `ZZ` must remain unassigned rather than folded into Mexico, the United States or the United Kingdom.

No authorized Analytics query or account inspection has been performed here. There are no observed country-row values in the supplied evidence.

## Comparing actual creators living in different countries

A valid creator-residence study would require independently defined country cohorts with documented recruitment and inclusion probabilities; **all, inactive, monetized and nonmonetized creators** must be distinguished. A zero-income-inclusive distribution would need actual receipts, zero earners, currency, matched period, production/marketing/admin cash expenses and real labor hours. The selected [AIR monetized-channel cohort](air-studio-benchmarks-2026.json) cannot substitute for a random population of Mexico-, U.S.- or U.K.-resident creators.

Converting real receipts at a documented market FX rate gives a common *nominal money* unit, not equal local living standards. For spending power, distinguish **private-consumption PPP** (or actual-individual-consumption PPP) from **GDP PPP** and preserve the consumption basket, year and reporting currency. The [OECD reference](https://www.oecd.org/en/data/datasets/purchasing-power-parities.html) describes these conversion concepts but this work **does not insert any unsourced FX or PPP values**. Tax residence and withholding require owner-specific assessment and are not inferred.

No published, representative zero-inclusive creator income comparison among Mexico, the U.S. and the U.K. is established by these sources.

Machine contract: [creator-country-income-comparability.json](creator-country-income-comparability.json). Scope validator: [creator-country-income-audit.mjs](../../site/creator-country-income-audit.mjs). Tests: [creator-country-income-audit.test.mjs](../../tests/creator-country-income-audit.test.mjs).
