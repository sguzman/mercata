# Small-channel discoverability: subscriber milestones are not thumbnail impressions

**Reviewed:** 2026-10-25. Primary platform metric sources: [YouTube Studio impression definitions](https://support.google.com/youtube/answer/9314486?hl=en), [traffic source meanings](https://support.google.com/youtube/answer/9314355?hl=en), and [Analytics API metric definitions](https://developers.google.com/youtube/analytics/metrics). Public comparison inputs: vidIQ's separate [July 2026 indexed channel size report](https://vidiq.com/research/youtube-subscriber-benchmarks-2026/) and [360-day under-1,000-subscriber study](https://vidiq.com/research/youtube-uploads-1000-subscribers/).

## What exists, what does not

In the July 2026 report, vidIQ counted **61,186,246** indexed channels with at least one public subscriber. Its separate September 2026 **32,926,088-channel** selected 360-day sample began with channels under 1,000 subscribers and at least one public video. **500,409** in that cohort ended the period at or above 1,000 subscribers. The cohorts may overlap, and the September selection includes established channels that were not new creators. They record public subscriber counts and net public video-object differences, **not** YouTube Studio Reach impressions, click-through rate, direct viewers, income or monetization approval.

A high public view count on a channel is not evidence that its thumbnail had a particular number of eligible impressions. The [official impressions rules](https://support.google.com/youtube/answer/9314486?hl=en) only count specified eligible product surfaces. External links and other excluded placements may create views without qualifying as registered thumbnail impressions. YouTube's CTR therefore uses **registered thumbnail impressions** as a denominator, not all playback events.

## Proposed comparable cohort

For a properly authorized research sample, stratify **owner-confirmed new entrants** separately from small incumbent channels and larger incumbents. Record first publication date (not merely a subscriber count), initial subscribers, genre, language, original public video format and actual upload events. For every selected video, use **0–48 hours**, **days 3–7**, **days 8–30**, and **days 31–90** as prespecified, distinct observation windows. Include videos with **zero impressions and zero public views** to avoid selecting only successful reach.

Match owner-authorized counted impressions and CTR to video/surface/date, and separately report public view events, public subscribers, watch minutes, and paid conversions (which require additional consent and financial receipts). Avoid computing CTR, retention or creator profits from vendored public counts alone.

The method can be implemented in permitted owner Analytics work without claiming the current repository possesses those reports. At present **no owner-authorized impressions, purchaser data or newcomer profitability cohort** has been collected.

[Machine contract](small-channel-discoverability-protocol.json) · [Nonpooling validator](../../site/small-channel-discovery-audit.mjs) · [Regression tests](../../tests/small-channel-discovery-audit.test.mjs).


## Direct first-week video view distribution, not a small-channel population (September 2026)

[vidIQ's September 16, 2026 study](https://vidiq.com/research/youtube-first-week-views/) reports **38,229,639** indexed videos classified as long-form, published August 15–September 5, 2026, with available **seven-day** view data. It counts **261,962,388,719 first-week video view events**, not people or money. The source reports a **234-view median** at day seven; **37.7%** had fewer than 100 seven-day views, **70.1%** fewer than 1,000, and **8.5%** at least 10,000. Its approximate 90th, 99th and 99.9th-percentile thresholds are **8,154**, **109,778** and **663,099** views.

The top *approximately* 1% of indexed uploads by seven-day views received **54.1%** of this selected cohort's views, and the bottom approximate half received **0.5%**. The source groups using percentile thresholds **with ties**, so these are not exactly 1% or 50% of a known count of individual uploaded videos. The remaining two reported view shares are 34.6% and 10.8%. The sample requires indexed content with observed day-seven counts; it excludes Shorts by classification but **did not separately exclude livestreams**. It is not a random sample of all uploads, not controlled for category, channel size, country or language, and contains **no new-creator-only denominator**. The observed concentration cannot identify recommendations as a causal mechanism or compute thumbnail impressions.

The existing [September 2026 first-upload vlog preprint](first-upload-vlog-study-2026.md) separately describes **107 keyword-selected vlog channels**, of which **51.4% had fewer than 1,000 lifetime channel views** after variable follow-up periods. These are **channels** and **lifetime cumulative views**, not vidIQ's **video objects** and **seven-day views**. The two percentages both reflect constrained samples; no subtraction, ratio, pooled median or general creator-success probability is justified. The preprint has not undergone peer review, and its assumed payout model does not measure paid creator earnings.

[YouTube's current impression definitions](https://support.google.com/youtube/answer/9314486?hl=en) count eligible thumbnail displays where **at least 50% is on screen for more than one second**, on specified platform surfaces. External sites and embeds, the YouTube Kids app, YouTube Music and several other placements do not count as eligible thumbnail impressions. Accordingly **public seven-day views cannot recover owner-only impression counts or CTR**. The newcomer-first-week view distribution, small-creator impression rate, unique people and profit remain `null`.



## New-channel first-ten attempts: selected upload-survivors (July 2026)

[vidIQ's July 28, 2026 first-ten video study](https://vidiq.com/research/youtube-first-10-videos-study/), updated July 30, selects public channels **created January–June 2025** that posted **at least ten observed videos of the same format in their first 90 days**. It reports **367,243 Shorts-qualified channels**, **137,355 long-form-qualified channels**, and **56,185 channels appearing in both cohorts**. The actual union is **448,413 distinct qualifying channels**, not 504,598. The long-form group excludes livestreams.

Within these selected upload-persistent groups, the approximate *median 30-day views per video* at first/fifth/tenth same-format upload were **1,362 / 1,275 / 1,344 for Shorts** and **180 / 211 / 272 for long-form**. The *median of each channel's best among the first ten* was **8,832 Shorts views** or **1,948 long-form views**, a different statistic that deliberately selects the biggest result from each channel.

For each channel's **best of ten**, **86.5%** of eligible Shorts cohorts and **57.8%** of long-form cohorts reached **at least 1,000 views** on one video within 30 days; at **10,000**, the respective fractions were **48.0%** and **30.8%**. In contrast, across individual eligible videos, **56.6%** of Shorts and **30.2%** of long-form videos crossed 1,000, and **20.9%** versus **10.0%** crossed 10,000. The two denominators are not interchangeable.

The cohort explicitly **excludes creators who stopped before publishing ten same-format public videos** within their first 90 days, and unindexed, deleted and private uploads are absent. So even these creation-date-stratified results are not the chance of a brand-new channel succeeding. The source does not randomize format or upload schedule. Comparing a first upload to the tenth does **not** prove additional uploads caused growth; channels, subject selection and accumulated experience all vary.

This selected **30-day video-level/channel-best** study is independent *in methodology* from the previously cited **seven-day, all-size, 38.2m-video** indexed distribution and the keyword-selected 107-channel preprint, but their account/sample **overlap is unknown**. None supplies legitimate owner Reach thumbnail-impression or CTR values, unique-person audience counts, monetization approval, labor hours or net profit.

