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



## Independent multi-market weekly video news use (Reuters Institute, June 2026)

The [Reuters Institute Digital News Report's video chapter](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/broadcast-streaming-platforms-changing-landscape-news-video), published **June 16, 2026**, analyzes surveyed **online news consumers and other respondents across 48 selected markets**. Its 2026 Digital News Report summary records **34% using YouTube for news in the previous week** among its multi-market respondent base. This is **not** the same population, question or frequency as Pew's separate 2026 **34% of U.S. adults regularly getting news on YouTube** above. The matching rounded figures are coincidental and must never be merged.

In the regional breakdown of *weekly YouTube news-video use*, Reuters reports **54%** of respondents in its sampled African markets, **47%** in its sampled Asian markets and **24%** in its sampled European markets. These results are region-conditioned online **survey prevalences**, not percentages of all residents of each continent, platform-deduplicated people or numbers of political channels. The public chapter does not supply item-specific regional effective N or global geographic coverage.

The authors also report that **55% of YouTube news consumers** say they mainly **intentionally seek news** on the platform, versus **40%** reporting mostly incidental exposure. This denominator is YouTube **news consumers** within the relevant Reuters survey, not all adults or creators. Its categories cannot be translated into how many users watch political commentary versus public-service reporting, or how many subscribe to particular ideological channels.

**Classification boundary:** Political reporting, procedure explainers, policy discussion, editorial opinion and satire are distinct *published content* types, not proxies for the private political beliefs of their viewers. The Reuters chapter expressly says available totals cannot disentangle traditional publisher traffic from other creator sources. No individual profiles, viewer party affiliation, persuasion effects, unique YouTube weekly news people or creator earnings were obtained. The [structured model](neutral-news-attention-protocol-2026.json) and audit record these unknowns.
