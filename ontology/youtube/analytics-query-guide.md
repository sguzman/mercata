# YouTube Analytics metrics: what the numbers mean

YouTube distinguishes advertiser spend, net creator payments, viewing events, watch time and viewer demographics. This [machine-readable field guide](analytics-query-guide.json) contains 19 distinct documented fields, 6 grouping dimensions and authorized sample-query designs.

This is an **access and measurement guide**, not a data extraction script. Detailed YouTube Analytics data belongs to authorized channel or content owners. It is not available for arbitrary other channels through unauthenticated public API access.

## Revenue and advertising denominators

| Metric | What it measures | Do not confuse it with |
|---|---|---|
| `estimatedRevenue` | creator estimated net revenue from Google-sold advertising and non-ad monetization sources in accessible reports | not an ad-only variable; subscriptions and fan payments may overlap other financial inputs |
| `estimatedAdRevenue` | estimated creator-side advertising proceeds from Google-sold advertising | not grossRevenue; does not cover partner-sold ads |
| `estimatedRedPartnerRevenue` | estimated creator-side YouTube Premium allocation | can contribute to estimatedRevenue |
| `grossRevenue` | gross proceeds before owner share and revenue-sharing agreements | not a creator payout or profit |
| `adImpressions` | number of verified ad impressions | can exceed monetized playbacks due to multiple ads |
| `monetizedPlaybacks` | monetized playback count; may count even if viewer leaves the preroll before video starts | not total eligible views and not unique people |
| `cpm` | gross advertising revenue per thousand ad impressions | not creator RPM; not equivalent to playbackBasedCpm |
| `playbackBasedCpm` | gross advertising revenue per thousand monetized playbacks | uses playbacks, not ad impressions |
| `views` | platform-defined views in a requested date range and video scope | platform definition changes; not unique people; long/Shorts definitions can differ |
| `engagedViews` | viewing that meets YouTube's current engaged-view criteria | not interchangeable with public viewCount or unique viewers |
| `estimatedMinutesWatched` | total estimated minutes watched | not people or advertiser-paid events |

A monetized playback may include multiple ad impressions. A preroll ad can qualify a playback as monetized even if the viewer leaves before the main video begins. Gross revenue does not equal net revenue after the creator's contractual share. CPM uses thousands of ad impressions; playback-based CPM uses thousands of monetized playbacks. Neither is the full after-share creator RPM. <https://developers.google.com/youtube/analytics/metrics>

The official API separates `estimatedRevenue`, `estimatedAdRevenue` and `estimatedRedPartnerRevenue`. The first can include multiple native revenue streams; the second is advertising-only; the third is Premium. Adding membership receipts to a general combined RPM calculation could double-count revenue, so the Mercata [scenario calculator](scenario-method.md) instead requests an explicitly **ad-only** after-share yield.

## Authorized research queries

**daily creator earnings.** Track actual channel earning across days; separate gross from net and non-ad streams. Required grouping: day; metrics: views, estimatedRevenue, estimatedAdRevenue, estimatedRedPartnerRevenue, grossRevenue, adImpressions, cpm, playbackBasedCpm, monetizedPlaybacks.

**country creator earnings.** Compare reporting rows by viewer country, not country of creator residence. Required grouping: country; metrics: views, estimatedRevenue, estimatedAdRevenue, estimatedRedPartnerRevenue, grossRevenue, adImpressions, cpm, playbackBasedCpm, monetizedPlaybacks.

**single video ad and income.** Examine top video revenue observations in a single channel or content owner rights scope. Required grouping: video; metrics: views, estimatedRevenue, estimatedAdRevenue, estimatedRedPartnerRevenue, grossRevenue, adImpressions, cpm, playbackBasedCpm, monetizedPlaybacks.

**audience logged in age gender.** Inspect permitted aggregate demographic groups, accepting suppression and limits; not public-platform composition. Required grouping: ageGroup, gender; metrics: viewerPercentage.

The [sample requests](https://developers.google.com/youtube/analytics/sample-requests) provide official query examples. The [reports.query reference](https://developers.google.com/youtube/analytics/reference/reports/query) documents the `currency` parameter; it defaults to USD for relevant metrics and is converted with exchange rates that can vary daily. Changing the requested report currency is not the same as changing the actual AdSense payment account or withdrawal threshold.

## Demographic reports

The [dimension definitions](https://developers.google.com/youtube/analytics/dimensions) include logged-in viewer age brackets (13–17, 18–24, 25–34, 35–44, 45–54, 55–64 and 65+) and gender categories (female, male, user-specified). Data for a channel may be suppressed for privacy and quality; these are authorized channel aggregations, not a census of every YouTube user. Ethnicity, biological sex, religion and political affiliation should not be inferred from someone’s account or content history.

## Research standards

Whenever an estimate appears in the gallery, store its denominator, geographic population, time window, observation-vs-scenario status, unit, source URL, method, authorization rights and known suppression. Unavailable or private figures remain unknown. No user account data or secret credentials belong in the public repository.
