# YouTube public sampling: search quotas, observed supply and bias

**Methods snapshot: October 23, 2026.** [Machine protocol](public-api-sampling-budget.json). This file documents a **possible** sampling procedure, not an executed crawl, API account or population census.

## The current API quota model matters

The [Google Data API quota calculator](https://developers.google.com/youtube/data/determine_quota_cost), updated **October 15, 2026**, lists distinct default daily buckets for projects that enable the API: **100 `search.list` calls**, **100 `videos.insert` calls** (not needed here), and **10,000 units shared by other methods**. A search call is reported as costing **one unit in its separate bucket**, not the older generic assumption of 100 quota units per search call. Daily quotas reset at midnight Pacific Time. Always verify the actual project's settings before using an API.

The [Search API reference](https://developers.google.com/youtube/data/reference/rest/v3/search/list) allows up to **50 results per call**, with five as the default. It may return fewer than requested, and the only valid way to continue paging is to use the returned `nextPageToken`. Every page requires another search call.

Its `pageInfo.totalResults` value is **approximate and capped at 1,000,000**. That does **not** mean a million discoverable videos can be retrieved, or that returned results represent a census of videos, creators or people.

The separately documented [videos.list](https://developers.google.com/youtube/data/reference/rest/v3/videos/list) and [channels.list](https://developers.google.com/youtube/data/reference/rest/v3/channels/list) each cost one unit per call in the other-method quota. A video lookup can bundle up to 50 IDs. These are only lookups for identified public resources, not an enumeration of the entire platform.

## Planning a public sample

Each research stratum must declare topic, query, region, language, format, publication window, search ordering and inclusion/exclusion criteria **before retrieval**. Preserve query metadata, date of retrieval, any API errors and incomplete pages; deduplicate IDs across repeated queries and overlapping topics.

To show the arithmetic without making any requests: **4 topics × 3 regions × 2 languages × 2 formats × 1 page** would consume **48 search calls** under the documented defaults. Even with 50 items per call, that would produce at most 2,400 *result slots*, not 2,400 different videos or persons. If those were all valid unique IDs, enrichment through `videos.list` would require 48 lookups. Actual returned results, duplicate rate, API quota configuration and sampling coverage are **unknown**.

This is an illustration, **not an instruction to run 48 API searches**. Using credentials or operating an API collection would require an authorized project, quota inspection, applicable terms review, defined research question and separately approved collection.

## Why the resulting counts cannot estimate community population

The search index is nonprobability-discovered and affected by ranking, language filters, removed videos, country access, publication date, privacy and unknown selection mechanisms. A creator may own multiple channels, and a channel may publish across many genres. Deduplication makes sample item counts meaningful; it cannot turn a convenience sample into a representative creator or viewer census.

For a valid unique-human audience estimate, separately specified survey coverage, consented analytics aggregates, deduplication and inference assumptions are necessary. Search results, subscriber totals, raw views, monetized playbacks and individual viewers are distinct units. The [August 2026 public-view break](view-definition-break.md) further limits longitudinal popularity comparisons.

## Reproducible evidence and privacy

A publishable sampled-channel atlas must record the exact search query/filters, calendar windows, chosen quota budget, returned page tokens/counts, time of collection, successful/failed follow-up lookups, duplicates, topic decisions, missingness and versioned metrics. Publication should focus on permitted public aggregates and methodology, not private watch histories, credentials, extracted full media or identifiable demographic labels.

**No data collection has been performed for this research artifact.** Topic-level active creator population, total uploads, worldwide unique viewers, typical earnings and true market concentration remain **unknown**, rather than being filled by approximate search totals.
