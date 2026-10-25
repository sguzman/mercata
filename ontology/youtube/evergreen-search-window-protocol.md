# Evergreen video demand and repeat-search tutorial research

**Checked:** 2026-10-25. Official sources: [YouTube Reach reports](https://support.google.com/youtube/answer/9314355?hl=en), [Studio Trends](https://support.google.com/youtube/answer/11962757?hl=en), [owner-authorized traffic-source API reports](https://developers.google.com/youtube/analytics/channel_reports) and [limited analytics guidance](https://support.google.com/youtube/answer/9101241?hl=en).

This is a **reproducible longitudinal measurement design**, not proof that tutorials routinely earn passive revenue or rank well in search.

## What the three source systems measure

| Surface | Actual observed unit | What it cannot establish |
|---|---|---|
| Video Reach tab | Owner's channel video viewing attributed to **YouTube Search, Browse, Suggested, External, Shorts, notifications or playlists** | Public topic-wide search counts, individual buyers or creator profit |
| Studio Trends | A **recent 28-day** view of audience searches, saved-search relevance and ordinal topic interest; some interest signals use videos watched over 1,000 times per week | Absolute searches in a language/country, permanent evergreen interest or a forecast of creator earnings |
| Analytics API traffic source | Authorized channel video **view events and estimated minutes watched** by traffic source, possibly day | All other creators' traffic or individual searcher identities |

Availability varies by device, country, language and channel authorization. Low-volume keywords or URLs may be suppressed. Missing terms cannot be replaced by inferred zeros.

## Define disjoint age windows before comparing tutorials

A repeatable owner-authorized cohort should use **video age** from publication date, not the total calendar age of a channel:

| Video age | Study interval | Question |
|---|---|---|
| First month | Days 0–30 | Launch exposure via Browse, Suggested, Search and owned subscriptions |
| Middle period | Days 31–180 | Does task-driven search still deliver observable views? |
| Later period | Days 181–365 | Are views still being generated through Search, and is measured attention stable after comparable age normalization? |

Compare a scripted how-to tutorial, a concept explainer, a version-sensitive walkthrough and an event recap only after documenting each item's topic, language, viewer geography, format, release date, update policy and source window. **Do not** call a video evergreen just because its cumulative view total is high: an older upload had more elapsed days to accumulate events.

The official Analytics API's traffic-source query has a **50,000 queried-video × queried-day constraint** for relevant multi-video day reports. This affects safe request batching; it is not a platform-wide video count or an engagement threshold.

## Evaluation and stop conditions

The research should predeclare: eligible owner cohort, topic selection rules, disjoint source-labelled view metrics and measured watch minutes, tracking cutoff date, repeated-window comparison, short-age right-censoring, and an uncertainty statement for each missing cell. A single 28-day Trends ranking can inspire a hypothesis but cannot establish seasonal, country-wide or future purchasing behavior.

No owner channel reports, independent absolute keyword search volume, viewer conversions or verified creator profit were accessed. Test fixtures are designed only to validate window and API query compatibility.

[Measurement matrix](evergreen-search-window-protocol.json) · [Audit](../../site/evergreen-search-window-audit.mjs) · [Tests](../../tests/evergreen-search-window-audit.test.mjs).
