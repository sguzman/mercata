# YouTube advertising revenue: Alphabet SEC annual and interim disclosures

**Evidence checked:** 2026-10-24. Sources: Alphabet [2025 annual Form 10-K](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000018/goog-20251231.htm), filed February 5, 2026, and [2026 second-quarter Form 10-Q](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000071/goog-20260630.htm), filed July 23, 2026. These are Alphabet corporate reporting documents, not sampled YouTube channel analytics.

The reported **YouTube ads** line is in millions of U.S. dollars. It measures Alphabet's recognized advertising revenue, *not* money paid to YouTube creators. The quarterly 10-Q figures are **unaudited**. The 2025 10-K presents its 2023–2025 comparison in an annual financial statement.

| Reporting period | 2023 | 2024 | 2025 | 2026 |
|---|---:|---:|---:|---:|
| Full calendar year, USD millions | 31,510 | 36,147 | 40,367 | Unknown |
| Second quarter (Apr–Jun), USD millions | Not recorded here | Not recorded here | 9,796 | 11,055 |
| First half (Jan–Jun), USD millions | Not recorded here | Not recorded here | 18,723 | 20,938 |

## Same-window comparisons

- Full-year advertising revenue rose **14.72%** from 2023 to 2024 and **11.67%** from 2024 to 2025.
- Second-quarter revenue grew **12.85%** year on year (Q2 2025 to Q2 2026).
- First-half revenue grew **11.83%** year on year (January–June 2025 to January–June 2026).

These are simple derived comparisons of like periods. First-half revenue includes second quarter, so the first-half and Q2 figures **must not be added**. Neither a six-month period nor one quarter establishes annual 2026 revenue or future market growth.

## Broader YouTube advertising-plus-subscription revenue (strict bound)

In its [February 4, 2026 SEC-furnished Q4 and FY2025 earnings release](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000012/googexhibit991q42025.htm), Alphabet separately disclosed that **YouTube's total 2025 corporate revenue across ads and subscriptions exceeded USD 60 billion**. This is a strict lower bound, not a reported exact total. Its independently disclosed ad component was USD 40.367 billion for that same calendar year. Therefore, if the broad total comprises those advertising and subscription components, the implied **2025 subscription component exceeds USD 19.633 billion** (60 − 40.367). This is a mathematical *lower bound*, not a reported exact subscription figure.

The bound includes YouTube subscriptions of multiple types, potentially including YouTube Music/Premium and television subscriptions; it cannot be represented as channel memberships, Premium-only sales, creator payouts, or individual customers. Alphabet also separately discussed **over 325 million paid consumer subscriptions across multiple Google services**, including Google One. That multi-product consumer subscription number is not YouTube's subscriber count.

**Do not confuse two different >USD 60 billion statements:** the figure in the Alphabet release refers to *worldwide annual YouTube corporate ad-plus-subscription revenues*. The [Oxford impact study](oxford-creator-impact-2026.md) reported *estimated U.S. GDP value added by a broader YouTube-related economic ecosystem*. Gross revenue and modeled economic value added are different measures, denominators and geographic scopes; they are not additive or interchangeable with creator earnings.

## Critical economic boundaries

Alphabet does not report YouTube subscriptions separately in this table. The category "Google subscriptions, platforms, and devices" combines multiple businesses and cannot be attributed wholesale to YouTube or added to the ads line as a verified total of YouTube revenue. These corporate figures are neither gross advertiser expenditure nor a count of customers.

Individual channels may earn only eligible shares of eligible net advertising receipts; Shorts have a different allocation system, and creator earnings also depend on monetization eligibility, rights, region, actual ad serving and more. **None of these filings reveals the distribution of creator payouts, zero earners, labor hours, or profit.** Dividing Alphabet ad revenue by an indexed channel sample, an estimated viewer population or recorded view events would create an unsupported payout or RPM estimate.

The [machine record](alphabet-youtube-ads-sec-2026.json) preserves the year, measurement unit and overlapping time windows. The [comparison validator](../../site/alphabet-ad-revenue-audit.mjs) and [regression tests](../../tests/alphabet-ad-revenue-audit.test.mjs) enforce these boundaries.
