# YouTube topical atlas: measurement coverage is not audience size

**Reviewed 2026-10-26.** This audit reconciles the [33-category research taxonomy](taxonomy.json) with the [37 existing topic-specific observations](topic-observations.json). **18** topics have at least one source-selected observation; **15** have none. Missing observations indicate unknown audience size, *not* zero viewers or creators.

The [machine crosswalk](topic-observation-coverage-2026.json) preserves the observation ID, metric, unit, period, geography, population and original linked source per topic. Source counts are document counts, not independent participant samples. Categories are nonexclusive; a person, channel, video or survey respondent may belong to several.

Video views are playback events, not deduplicated people. Watch hours measure duration, uploads measure content supply, selected fan-survey percentages belong to their actual response frames, and sports-event unique people/average-minute audience have different denominators. Two lifetime cumulative view figures cannot be added to estimate a unique global topic audience. The existing rows do not establish platform-wide demographic or creator-income distributions.

## Required comparison and revision gates

Descriptive comparisons require compatible **metric, unit, geography, observation period and named population**, with separately recorded selection bias. Even matching units do not prove disjoint samples, causal relationships or additive communities. For taxonomy changes (split/merge/rename), record the effective date, old topic ID, new ID, source and destination definition versions, and reason. Old measurements retain original definitions unless there is a documented backfill.

No account-level observations were collected. The [audit](../../site/topic-observation-coverage-audit.mjs) and [regression tests](../../tests/topic-observation-coverage-audit.test.mjs) enforce the coverage count and forbid invented deduplicated audience totals.


## Explicit metric-family audit (October 26, 2026)

The existing **33 topics and 37 selected observations** supply **eight nominal metric types**. These are not eight independent population studies: 23 rows are video-view event counts; other rows count watch hours, uploads, survey responses, one video’s lifetime views, and several event-specific viewing indicators. Multiple metric types do **not** imply that one selected sample provides a complete audience census.

| Published observation metric | Selected observations |
| --- | ---: |
| Video-view events (`video_views`) | 24 |
| Watch hours | 3 |
| Within-selected-fan-survey percentages | 4 |
| Event-specific unique viewers | 1 |
| TV event-specific unique viewers | 1 |
| Event average-minute audience | 1 |
| Single video lifetime views | 1 |
| Uploaded video events | 2 |
| **Total** | **37** |

**Only 4 of 33 categories contain at least two distinct metric types** within the currently admitted observations: general-animation (selected video views and fan-survey percentages), crafts (views and uploads), sports-general (views and watch hours), and football-soccer (four metrics from one selected sports-event source). None has a matched, deduplicated **whole-category audience plus whole-category active-creator population**. The four metrics for the single football-event source are not four independent studies or four nonoverlapping audiences. Distinct source document counts similarly do not prove independently drawn channel/person sampling frames.

The machine record now enumerates each category's actual metric-family coverage and explicitly leaves full-category people/creator counts unknown. It is **not** a claim that other public evidence is absent globally; only that the 37 currently registered topic-specific observations do not satisfy the research task's representative multi-dimensional population requirement.

### Requirements before an audience-size ranking

A comparable cross-category estimate would require a **defined, reproducible genre classifier and universe**, identical calendar coverage and eligible territories, public or permitted deduplicated viewer counts, matched active-creator/channel populations, separately counted upload and video-view events, total watch hours and transparent sampling error. It would also require an independently validated overlap model because videos and audiences cross genre boundaries.

Without those, the only valid site indicator is **evidence coverage**, not subculture size, competition intensity or predicted creator earnings. Missing groups are **unknown**, not zero. The [audit module](../../site/topic-observation-coverage-audit.mjs) and its tests ensure this remains true when the category source set changes.
