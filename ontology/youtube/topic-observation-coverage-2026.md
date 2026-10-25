# YouTube topical atlas: measurement coverage is not audience size

**Reviewed 2026-10-25.** This audit reconciles the [33-category research taxonomy](taxonomy.json) with the [36 existing topic-specific observations](topic-observations.json). **18** topics have at least one source-selected observation; **15** have none. Missing observations indicate unknown audience size, *not* zero viewers or creators.

The [machine crosswalk](topic-observation-coverage-2026.json) preserves the observation ID, metric, unit, period, geography, population and original linked source per topic. Source counts are document counts, not independent participant samples. Categories are nonexclusive; a person, channel, video or survey respondent may belong to several.

Video views are playback events, not deduplicated people. Watch hours measure duration, uploads measure content supply, selected fan-survey percentages belong to their actual response frames, and sports-event unique people/average-minute audience have different denominators. Two lifetime cumulative view figures cannot be added to estimate a unique global topic audience. The existing rows do not establish platform-wide demographic or creator-income distributions.

## Required comparison and revision gates

Descriptive comparisons require compatible **metric, unit, geography, observation period and named population**, with separately recorded selection bias. Even matching units do not prove disjoint samples, causal relationships or additive communities. For taxonomy changes (split/merge/rename), record the effective date, old topic ID, new ID, source and destination definition versions, and reason. Old measurements retain original definitions unless there is a documented backfill.

No account-level observations were collected. The [audit](../../site/topic-observation-coverage-audit.mjs) and [regression tests](../../tests/topic-observation-coverage-audit.test.mjs) enforce the coverage count and forbid invented deduplicated audience totals.
