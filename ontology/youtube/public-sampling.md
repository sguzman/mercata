# Studying YouTube communities with public data

**Methodology version:** 2026-10-23. This is a research procedure, not a completed community census.

## The question comes before the query

For each community define a public topic label, inclusion and exclusion rules, geographic scope, languages, period, video formats, and target measurement. A category can include several interests and a video may have more than one category. Record the choice before collecting a sample.

Never assume that a keyword search enumerates all videos about an interest. Search varies by relevance, language, date and available results. Reproducible samples should archive the query conditions, collection timestamp, access mode, result cap, missingness and category classification criteria.

## Data sources and permissible scope

- [YouTube Data API search.list](https://developers.google.com/youtube/v3/docs/search/list): returns discoverable content matching query filters. Its total is approximate; it is not a count of users, viewers or community members. The published quota model may change; check current project quotas.
- [YouTube Data API videos.list](https://developers.google.com/youtube/v3/docs/videos/list): can return video metadata, statistics, format-relevant properties and channel IDs for permitted public results. Respect API limits, returned fields, rights and policies.
- [YouTube Analytics API dimensions](https://developers.google.com/youtube/analytics/dimensions): gives reporting dimensions including age group, gender and country to appropriately authorized channel or content-owner reports. It is not an unrestricted census.
- Published population surveys, panels and original research may provide representative estimates of broader audiences. Record study population, sample construction, dates, non-response and geography.

An [October 2026 source-backed quota and sampling budget](public-api-sampling-budget.md) gives the current separate search-list call bucket, 50-result page ceiling, 1,000,000 cap on approximate totalResults, page-token rules and metadata lookup budget. It is a planning artifact only, with no actual creator/channel population estimated.

According to Google's [quota calculator](https://developers.google.com/youtube/data/determine_quota_cost), current documentation describes a separate default quota for search.list calls and a shared quota for many other methods. Do not hard-code a universal daily quota; record the quota reported by the credential actually in use and respect Terms and audit requirements. Do not create credentials or spend money without authorization.

## Critical break in public view counts

The [YouTube video resource documentation](https://developers.google.com/youtube/data/reference/rest/v3/videos) describes an **August 24, 2026** change: viewCount for long-form, Live and Shorts counts playback starts, including autoplay and hover-to-play. For historical trends, record whether observations were taken before or after the definition change. A difference between two counts across the break can be due to the metric definition instead of genuine growth in attention.

A raw view or autoplay start is not the same as engaged viewing, watching a video through to completion, or a unique viewer. Do not use it as a proxy for attention minutes or audience identity without additional support.

## Sampling design

1. Establish category definitions from the [topic taxonomy](taxonomy.json), with an independent sample for each format and language stratum.
2. Keep discovery methods separate: keyword search, official category lists, public creators, and independently sampled survey subjects. Record each method's selection bias.
3. Select predeclared time windows. Keep the search query, regionCode, relevanceLanguage, ordering, page limits and filters.
4. Deduplicate returned video and channel IDs; also count the resulting sample size and overlaps across categories.
5. Distinguish observable public view counts, creator counts, upload counts and engagement proxies. None alone measures unique people.
6. When a denominator is missing, publish a lower bound, an explicitly modeled range, or **unknown**, according to what the evidence actually warrants.
7. For historical series, record API definitions and platform revisions, especially the 2026 view-count change.
8. Compare demand against creator supply only for comparable samples, time windows and format definitions. Never infer a typical creator income from channel popularity alone.
9. Store public query metadata and derived aggregate values rather than full copyrighted content or private user-level data. Respect retention and permitted-use rules.

## Privacy and limitations

Do not collect private watch histories or infer an individual's sex, race, ethnicity or political preference from names, appearance or viewing behavior. Children must not be profiled. Aggregate surveys can answer some demographic questions only for their defined sampled population; small cells and suppressed results remain unknown.

## Acceptance standard

A community-size estimate requires a declared estimand (e.g. U.S. adults who watch a particular category at least once monthly), sampling frame, sample size, weighting or coverage method, observed period, uncertainty or explicit limitations, and primary citation. Without this, publish counts of **observed sampled videos/channels**, not imaginary people.
