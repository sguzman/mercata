# YouTube political/news content: descriptive surveys and event-study boundaries

**Research checked:** 2026-10-25. Existing registered primary sources: [Pew's 2026 social media news fact sheet](https://www.pewresearch.org/journalism/fact-sheet/social-media-and-news-fact-sheet/), [YouTube Data API search.list](https://developers.google.com/youtube/v3/docs/search/list), and [Google Trends' sampling/normalization FAQ](https://support.google.com/trends/answer/4365533?hl=en). This document adds no account profiling or scraped personal records.

## A measured news population, not a political creator census

Pew surveyed **5,166 U.S. adults** on **August 24–30, 2026**. **34% of all U.S. adults** said they regularly get news on YouTube. Pew's published corresponding point estimates are **32% (2024)** and **35% (2025)**; differences between these years cannot be called statistically significant without compatible sampling-error analysis. The fieldwork is an *adult U.S. survey*, not an observed YouTube viewer-log cohort, a global reach estimate or an exact active-news channel count.

In 2026, Pew reports regular YouTube news use by **35% of U.S. adults identifying as Republican/leaning Republican**, versus **36% identifying as Democratic/leaning Democratic**. These are **within-party prevalence rates** among adults, **not** the percentage of YouTube news viewers belonging to either party, and they cannot establish the political views of any creator's subscribers. Do not divide or subtract independent survey strata to manufacture a viewer-to-partisan conversion rate.

## Content taxonomy is not audience ideology

For descriptive public-video research classify the **published material**, with source links and uncertainty, into reported news, institutional/election-procedure explanation, public-policy analysis, explicit editorial opinion, satire/commentary or mixed/unknown. A video can reference several topics. A publisher's expressed editorial perspective, even if explicit, does **not** classify the viewers, commenters or subscribers. No viewer names, user IDs, chat histories or political inference records should be retained.

To compare event-linked volume, preregister the event date and geography, source queries, language preference, **14 full days before and 14 full days after**, and treat event day separately. Record retrieval timestamps, duplicates, changing view-counter ages and discovery/ranking limitations. YouTube `search.list` supports `publishedAfter`, `publishedBefore`, `regionCode`, `relevanceLanguage`, and `pageToken`. Yet search ranking and `pageInfo.totalResults` are not a complete census. `regionCode` does not measure viewer domicile; a relevance-language preference is not guaranteed video language.

## Google Trends is a separate measurement system

Google Trends indexes a sample of **Google searches**, normalized to **0–100 within the selected request geography and time window**; it is *not* YouTube Search, a count of viewers, raw search volume or political vote share. A value of zero may indicate insufficient data; independently normalized downloads should not be joined as a single absolute series. It can serve as a *bounded descriptive external context*, not a validated causal driver of YouTube traffic.

## Unresolved empirical gap

No real event-window video panel has been collected or inspected. No matched within-channel reach, unique audience, political persuasion effect, monetization, or statistical confidence interval is available. The [machine frame](neutral-news-attention-protocol-2026.json), [measurement validator](../../site/neutral-news-attention-audit.mjs) and [regression tests](../../tests/neutral-news-attention-audit.test.mjs) explicitly preserve this unknown state.

