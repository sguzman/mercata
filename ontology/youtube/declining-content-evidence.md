# Detecting a genuinely declining YouTube topic

**Research date: October 24, 2026.** [Machine decision and missingness record](declining-content-evidence.json). This is an explicitly **incomplete measurement framework**, not a list of declining topics or prediction of monetization.

## Why the available source set does not prove a declining niche

- YouTube's [February 2026 NFL report](https://blog.youtube/culture-and-trends/nfl-youtube-culture-trends-report/) reports **positive** 2020–2025 annual view/upload endpoint growth. It does not include every intermediate year, and cannot substantiate a decline for other content categories.
- The [prom/GRWM article](https://blog.youtube/culture-and-trends/prom-youtube/) reports a **single full-year 2024** title-filtered view lower bound. There is no matched 2025 or 2026 measurement under the same title predicate.
- The [Halloween makeup article](https://blog.youtube/culture-and-trends/halloween-makeup/) reports a **partial 2025** title-filtered view lower bound. It cannot be contrasted against full-year prom views, even though both concern clothing/beauty formats.
- YouTube's [August 2026 public-view revision](view-definition-break.md) changed the counting rule for playback starts. Apparent before/after movement could be a definition change rather than true audience demand, unless comparable measurement epochs are reconciled.

The correct conclusion for the candidate *declining* niches is **unknown**, not that all are stable or growing. Editorial trend rankings, channel anecdotes and search results are not probability samples or a matched topic series.

## Minimum comparability rules

A descriptive numerical change between two observations requires the same **topic query or category predicate**, **territory**, **view-event definition**, **content format**, **age/device selection if any**, **source sampling frame** and **equal-duration time windows**. A point estimate must be exact enough for the intended arithmetic. Two values separately reported as “more than N” are lower bounds, and **their difference or growth ratio is not a measured change**.

For multiple countries or formats, describe separate panels; a Simpson's-paradox-style shift in the mix of markets or formats cannot be interpreted as a topic-wide decline. No viewer names, demographics or subscriber histories are needed to do this work.

The [pure-JavaScript observation audit](../../site/topic-decline-audit.mjs) and [synthetic unit tests](../../tests/topic-decline-audit.test.mjs) enforce the required matching fields, reject lower-bound arithmetic and deny causal or persistent trend conclusions from two observations alone.

## What would support a real decline

Repeated month- or year-level observations **across several seasons** need a stable category query, defined population of videos/views, consistent duration, matched viewer geography, measurement-epoch handling, comparable platform-wide baselines, documented sampling uncertainty, and an appropriately chosen comparison topic. Even then, observed falling event counts are not the same as fewer **unique people**, fewer independent creators, lower newcomer earnings, or causation.

No such repeatable declining-topic cohort and no creator-profit decline are presently measured. All decline population, strength, forecast and earnings fields in the machine record remain `null`. See the [seasonality comparison](seasonal-discovery-comparison.md), [public-view revision](view-definition-break.md) and [topic taxonomy](taxonomy.json).
