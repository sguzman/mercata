# Evergreen versus trend-led video earnings over 30, 90 and 365 days

**Study protocol, October 24, 2026.** [Machine specification](lifecycle-horizons.json) and [reusable, unit-tested accounting](../../site/lifecycle-horizons.mjs). No representative evergreen-vs-trend YouTube earnings advantage has been measured; **all population and profit findings remain unknown**.

## What can actually be compared?

YouTube's [official Analytics metrics](https://developers.google.com/youtube/analytics/metrics) document `views`, `engagedViews`, `estimatedRevenue`, `estimatedMinutesWatched` and other creator measures. The [query API](https://developers.google.com/youtube/analytics/reference/reports/query) requires owner authorization to retrieve earnings and channel-level analytics. [YouTube's Studio revenue help](https://support.google.com/youtube/answer/9314357?hl=en) distinguishes estimated creator revenue, ad-only revenue, RPM and advertiser-side CPM. Public video views do **not** reveal sponsorship payments, native creator payouts, costs or take-home income.

[YouTube Studio content performance](https://support.google.com/youtube/answer/12220281?hl=en) distinguishes traffic from Search, Browse, Suggested and external referrals. Search traffic may be relevant for evergreen discovery, but even sustained search traffic does not by itself prove long-term profit. The platform's August 24, 2026 video-view counting break must be documented rather than comparing pre/post raw view totals indiscriminately.

## Registered research units

- **Evergreen**: classified *before* seeing the performance curve as content designed to answer a recurring need.
- **Trend or event**: classified beforehand as tied to a dated launch, news event, platform trend, season or release.
- **Unit**: one consented and eligible video. Keep owner identity, channel maturity, content format, language, geography, monetization status and currency as separate strata.

The accounting windows are **publication-age cumulative** periods: days 0–29, 0–89 and 0–364. Optionally derive nonoverlapping slices of days 30–89 and 90–364 from **complete comparable observations**. These are not the same as earnings in three arbitrarily chosen calendar months.

## Missingness, selection and data permissions

A video observed for 55 days can have a measured 30-day total, but **no 90- or 365-day outcome**. Absent daily data are missing, not zero. A genuine, explicitly recorded zero is different from an unavailable revenue value. Do not project partial observation windows or drop low-performing and inactive videos silently from the enrollment denominator.

Estimated revenue is authorized **owner data**, unlike public views; it may undergo revisions and does not capture all sponsorship, external product sales, labor and tax. The [original public report on revenue](https://support.google.com/youtube/answer/9314357?hl=en) is a definition source, not a new-creator representative income study.

A valid matched comparison requires common geography, publication cohort, video format, topic definitions, revenue currency and relevant eligibility history. Classification must not derive from observed outcome, to avoid circular selection. The provided JavaScript module handles strict age-window completeness, mixed-view-definition checks and descriptive sample statistics but **does not authorize collection, validate population sampling or establish causality**.

## Results not yet supported

No sourced sample has supplied the required prospective video enrollment, daily owner-revenue observations, matched 365-day follow-up, production costs or creator work hours. Accordingly the study does **not** report that evergreen videos earn more (or less), and cannot estimate an evergreen creator's hourly profit, zero-earner share or effective horizon.

This protocol complements the [newcomer-income cohort requirements](newcomer-income-cohort.md) and the [source-backed analytics query guide](analytics-query-guide.md). Public aggregate-only publication remains mandatory.

## A measured educational-video longevity case: 51 French-language psychotherapy videos

A [peer-reviewed 2026 observational study](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1744748/full) tracked **51 videos** published **2018–2022** on the academic GREMO HUS YouTube channel, covering meditation, DBT skills and compassion-focused therapy. The authors report:

| Defined channel-level interval | Mean monthly views | Average viewer retention |
| --- | ---: | ---: |
| **2019–2020** | **365.3** | **24.7%** |
| **2021–2022** | **1,669.5** | **33.9%** |

The paper also describes growing monthly video views with both age since publication and calendar year. These are useful **observed longitudinal channel outcomes**, not a random sample of evergreen creator businesses. They concern a professional psychotherapy channel and may reflect clinician recommendation, changing publication and audience behavior, channel growth and platform changes. The study did **not** randomize referrals, choose a matched trend-video control, or report creator receipts, costs, net cash profit, demographic audience prevalence or revenue over the proposed 30/90/365-day payment windows.

**Conclusion bounded to the measured sample:** ongoing view activity can persist and grow in a selected educational channel. This does not prove that evergreen YouTube videos on average earn more than trend-led formats. Mercata's original [machine protocol](lifecycle-horizons.json) now records this empirical case separately from unexecuted matched earning cohorts; the [case audit](../../site/longitudinal-education-audit.mjs) prevents its reclassification as a general creator-income distribution.
