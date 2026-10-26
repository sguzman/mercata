# New and established channels: relative video breakouts in a selected October 2026 vendor index

**As of October 25, 2026.** [TubeMind's October 23 original vendor report](https://tubemind.io/report) examines a snapshot of **558,739 indexed YouTube videos** from **6,663 channels**, across 26 languages and 86 countries, as of October 22. The channel population is selected by the commercial service, not a known probability sample of global publishers; the full video index and channel inclusion rules are not public.

## Breakout definition, valid denominator, and format comparison

The vendor calls a video a **5× breakout** if its views are at least five times the median views of its *own channel's recent same-format uploads*. This is a **within-channel relative view ratio**, not a large absolute view count, a subscriber acquisition event, an engaged-view rate or any creator payment.

| Reported cohort | Videos with comparison metric | Share at 5×+ own same-format median | Sample median public views per video |
| --- | ---: | ---: | ---: |
| Long-form | 282,345 | 9.7% | 12,266 |
| Shorts | 272,813 | 10.6% | 8,460 |
| **Both scored formats** | **555,158** | **10.1% overall, as reported** | Not one global comparable median |

These format counts reconcile exactly to 555,158, while the headline index contains 558,739 videos: **3,581 objects lack a published comparable multiplier**. Do not classify the missing objects as unsuccessful or quietly insert them into the denominator. Shorts and long-form have different viewing definitions across publication eras; even this internal vendor 0.9-percentage-point comparison is **descriptive, not causal** or proof one format produces more paying audience.

## Six vendor-reported duration bins: association, not optimal duration

The same [October 23 TubeMind report](https://tubemind.io/report) provides a **5× own-channel-same-format median breakout rate by video duration**:

| Publisher's duration bracket | Selected-index 5×+ rate |
| --- | ---: |
| Under 1 minute | 10.5% |
| 1–4 minutes | 8.7% |
| 4–10 minutes | 9.3% |
| 10–20 minutes | 8.8% |
| 20–40 minutes | 9.3% |
| 40 minutes and longer | 11.4% |

The **40-minute-plus group is highest in this selected study**, but the article does **not** disclose the count of videos in each bracket, publication-age matching, confidence intervals, format membership of the *under-one-minute* category, monetization, or time and cash costs. Its discussion calls these 'long-form' duration bins while presenting a group shorter than a minute; this ambiguity remains unresolved.

These percentages do **not** establish that uploading longer videos *causes* breakout or net-income growth. Long documentaries, music, instructional projects and passive/background formats may have different audience age, production spending, genre and channel characteristics. No observed labor hours, equipment cost or representative creator net earnings by bin are available.

**Keep the eight-minute mid-roll boundary separate.** YouTube's [official ad guidance](https://support.google.com/youtube/answer/6175006?hl=en) permits *eligible* videos of at least eight minutes to offer optional mid-roll slots. That threshold lies **inside TubeMind's 4–10-minute bin** (9.3%), which cannot separate 479-second from 480-second outcomes or verify a single served ad. It is improper to use an outlier views percentage to predict mid-roll delivery, ad revenue, production efficiency or creator wages.

## Genre and small-channel evidence, without invented probabilities

The provider's **selected category breakout rates** (within its own indexed videos) include Film & Animation 14.6%, Music 13.9%, Howto & Style 10.6%, Education 9.2%, and Gaming 6.0%. Category-specific video sample sizes and selection weights are not published in the summary. The rates do not represent new-creator success, production-adjusted returns or the whole YouTube category.

The report also lists **channels below 10,000 subscribers** with at least one internally defined 5× video: 115 in Luxury & Billionaire Lifestyle, 99 in Health & Wellness, 98 in Space & Science, and 32 in Geography & Maps. These are **numerators in selected commercial niches**. No full denominator for all indexed under-10K channels in each niche is supplied; no percentage likelihood of getting a breakout by niche can be calculated. **Below 10K subscribers is not equivalent to newly founded**. A separately reported set of 520 purportedly faceless channels younger than one year with a 5× video likewise has no denominator of all under-one-year faceless entrants, and the provider's faceless category is inferred, not officially verified.

## Why this does not choose a winning niche or reveal creator income

The website's proprietary "Enter now" opportunity rankings combine vendor demand and saturation scores and small-channel case counts. They are vendor product recommendations, **not empirical probability estimates**; Mercata does not adopt or rank by them. A 5× hit could still be a small absolute number of views, carry no monetized ad impressions, fail advertiser suitability, consume many hours or lose money after production. The sample does not measure newcomer zero earners, net revenue, payment eligibility, or year-by-year channel survival.

The [machine protocol](relative-video-breakouts-2026.json) preserves separate unit labels and explicit nulls; the [validation audit](../../site/relative-video-breakout-audit.mjs) and [tests](../../tests/relative-video-breakout-audit.test.mjs) prevent using selected niche numerators as population probabilities. This complements the [existing independent vendor cohorts](channel-cohort-observations-2026.md) rather than merging data providers.
