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
