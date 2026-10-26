# Unique viewers versus channel accounts, views and subscribers

**Study date: October 23, 2026.** [Machine measurement register](viewer-person-metrics.json). This is a classification of measurable quantities, **not a public census of YouTube's users or creators**.

## The public channel API does not count people

The official [YouTube Data API channel resource](https://developers.google.com/youtube/v3/docs/channels) publishes channel-specific views, rounded subscriber counts and public video counts. YouTube's August 24, 2026 update changed channel view counts to include initial playback starts across formats. An event, a subscription and an uploaded video are **not distinct individuals**. Subscribers are rounded down to three significant digits, can be inactive and can subscribe to multiple channels. A crawl of channels would not prove how many unique humans operate them.

## Owner-facing estimates use different populations and windows

The [YouTube Studio audience guide](https://support.google.com/youtube/answer/9314416?hl=en) defines *monthly audience* as a rolling **28-day** estimate of channel viewers, recalculated each day. It is not necessarily a calendar-month count. The [unique-viewer guide](https://support.google.com/youtube/answer/7577916?hl=en) states that per-video and per-channel estimates consider repeated watching across devices, including both **signed-in and signed-out viewing**, and permit reporting periods up to **90 days**. Shorts estimation uses engaged views.

**Unique reach** may estimate people seeing content with shared TV-screen viewing, while **Views (Co-viewed)** refers to adjusted view events. Neither is the same metric as unique viewers who watched. A reported *new viewer* can include someone using private browsing, deleting history or returning after more than a year; it is not proof of a person new to YouTube itself.

| Metric | Public channel API | Owner Studio / Analytics | Population measured |
| --- | --- | --- | --- |
| Channel public views | Available | Available | Playback-start events, not people |
| Channel subscribers | Available, rounded | Available | Channel subscriptions, not viewers |
| Public upload count | Available | Available | Public video objects |
| Estimated unique viewers | Not publicly available through channel resource | Owner estimate, windows up to 90 days | Channel/video viewers, not global users |
| Monthly audience | Not in public channel resource | Owner estimate, rolling 28 days | Channel audience, not calendar-month global people |
| Unique reach and co-viewed views | Not in public channel resource | Owner estimates | Shared-screen exposure and view events |
| Platform-wide global distinct monthly people | **Unknown** | Not a channel metric | Requires independent global population evidence |

The [YouTube Analytics API](https://developers.google.com/youtube/analytics/reference/reports/query) requires authorization for channel or content-owner analytics. It cannot be used to obtain private competitor metrics without permission, and Mercata does not collect credentials or account-level identities.

## Signed-out people and unsupported extrapolations

YouTube can include signed-out viewing in its **owner-facing modeled unique viewers**, but public Data API counts do not reveal how many people watched signed out. A representative respondent survey might partly observe logged-out use under its own age and geographic definitions; this is a separate survey population. Likewise, [DataReportal's Mexico advertising reach](https://datareportal.com/reports/digital-2026-mexico) is not a monthly census of all Mexican people watching YouTube.

Neither the total number of channels, the independent channel owners, full-platform unique viewers, registered-user population, signed-out viewer share, nor cross-channel unique-person overlap is measured here. Every one of those fields is `null` in the machine record.

See [audience-overlap study](audience-overlap.md) for the separate problem of double counting people across niches and [metric history](view-definition-break.md) for YouTube's 2026 view-count revision.

## Logged-in viewing is not a count of signed-out people (October 25, 2026)

YouTube's [Analytics metric specification](https://developers.google.com/youtube/analytics/metrics) defines `viewerPercentage` as the **percentage of viewers logged in when watching the video or playlist**. This is a scope-specific, authorized report variable. It is **not** a public channel attribute, universal percentage of people registered with Google, or a deduplicated global login-state sample. The API definition alone does not provide an exact count of unique people watching signed out.

The [Studio unique-viewer guidance](https://support.google.com/youtube/answer/7577916?hl=en) separately describes an owner-only modeled estimate of distinct viewers that can account for signed-in and signed-out activity. A video has playback starts and may have several people co-watching, while a **monthly audience** is a rolling 28-day channel estimate. None of those is interchangeable with API `viewerPercentage`, public subscriptions or [direct/unknown traffic](https://support.google.com/youtube/answer/9314355?hl=en).

A hypothetical report of 80% logged-in viewing **does not** establish that 20% of unique global YouTube viewers are unregistered, that 20% of one channel's fans are unsubscribed, or that 20% of the audience comprises new people. That inference would require a specifically authorized, properly defined deduplicated and representative population frame, not the reported metric.

The updated [machine observability contract](viewer-person-metrics.json) and [regression validator](../../site/viewer-login-audit.mjs) record these non-equivalences. **No actual owner API row, unregistered viewer count, platform registration population or conversion outcome was observed.**


## Owner demographics and hidden reporting rows (reviewed October 25, 2026)

YouTube's official [limited Analytics data guide](https://support.google.com/youtube/answer/9101241?hl=en) explains that creator reports can **omit small age, gender, geography, search-term and external-URL cells**, and that a report's displayed category rows may **not sum to its overall total**. The precise threshold is deliberately unpublished and can change; it is not acceptable to insert a guessed minimum sample size or count missing rows as zero actual people.

For **private or unlisted videos**, age and gender breakdowns are unavailable regardless of traffic. Other audience metrics may be limited when an audience watches Made for Kids material or when there is insufficient relevant data. The help guide distinguishes geography revenue measures (which do not use the same geography reporting threshold) from geography viewer rows; an accessible payout does not reveal the identity of the viewers or an unrestricted age distribution.

Google's [YouTube Analytics API dimensions reference](https://developers.google.com/youtube/analytics/dimensions) defines ageGroup buckets (from 13–17 through 65+) and gender categories (female, male, user-specified) for **logged-in users associated with an owner-authorized report**. These values are **report dimensions**, not a population-level sex/gender census, age identification of individual viewers, or a confirmed exclusion of younger people from all YouTube viewing. The public channel API does not expose each creator's audience breakdown as a complete public record.

An **omitted report cell**, a **survey respondent's nonresponse**, a **logged-out viewer** and a **non-viewing person** are four distinct missingness categories. No actual creator account was accessed and neither a platform-wide suppression rate nor a survey response adjustment was observed; these remain explicitly unknown. This section documents the data gate, not a technique to bypass suppression or profile minors.
