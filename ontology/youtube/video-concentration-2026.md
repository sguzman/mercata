# Concentration of video attention: what can be measured

**Reviewed October 25, 2026.** [Source-bound study](video-concentration-2026.json) · [pure sample estimator](../../site/video-concentration.mjs) · [regression tests](../../tests/video-concentration.test.mjs).

[Omdia's January 28, 2026 research statement](https://omdia.tech.informa.com/pr/2026/jan/youtube-reaches-29-billion-videos-as-music-and-shorts-dominate-viewing) reports that the **top 1% of videos accounted for 91% of viewing time**, while the remaining **99% accounted for 9%** within its late-2025 platform-wide analyst research. This is a share of *viewing time associated with video objects*, **not** a share of channel income, creator profits, distinct people, or an estimate of competition in any named niche.

The public press statement does not release enough sample metadata or source microdata to reproduce its ranking, denominator or classification. The percentages are rounded and should not be given artificial statistical uncertainty or applied directly to all creators.

## A testable within-niche method

For a legitimate selected video set, choose and freeze a topic inclusion definition, calendar window, format/surface, accessible video universe, and **one consistent metric**: public view events or owner-authorized engaged-view events or watched minutes. The pure estimator requires a unique ID for every video, nonnegative finite observed values, and a nonempty positive denominator. It then computes the chosen top fraction's **share within that sample**, an HHI of video counts, and a within-sample Gini coefficient.

The unit is a video, not an account or person. Searching only popular videos overestimates concentration and does not reveal videos that the search engine did not return. An owner sample is limited to the selected owners. Thus a calculation may be correct *within the sample* while being invalid as an estimate of the whole community.

## Unmeasured comparisons

The existing [topic-culture evidence](video-attention-culture-2026.json) contains a separate U.S. survey of self-described niche watching and multiple Omdia video supply metrics, but these are not a matched video-level census of beauty, gaming, news or music. Consequently **no genre-specific top-1% share, per-topic HHI, channel revenue concentration, or new-creator chance of discovery** is reported.

**All current observed niche samples remain empty.** Sample arithmetic is exercised only on explicitly synthetic fixtures; it cannot by itself satisfy an empirical niche concentration estimate.
