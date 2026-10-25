# Native YouTube title and thumbnail A/B experiment boundaries

**Observed:** 2026-10-24. Official documentation: [YouTube Help: A/B test titles and thumbnails](https://support.google.com/youtube/answer/16391400?hl=en). This is a published feature specification, not an experiment run on a real creator channel.

## What the product can test

An eligible channel with **advanced features** enabled can use desktop YouTube Studio to concurrently compare **two or three** title variants, thumbnail variants, or combined title-plus-thumbnail variants. A running test is generally resolved within **up to two weeks**. The platform optimizes for the **share of watch time**, not merely click-through rate (CTR), and may withhold a small proportion of traffic in a separate default-variant control group.

A *Winner* is an option YouTube regards as having a statistically clear watch-time-share advantage. *Performed Same* and *Inconclusive* do **not** establish an uplift; when no clear winner emerges the first submitted title/thumbnail remains the default unless the creator changes it. Mutating title or thumbnail during the test stops the test.

**Excluded:** Shorts (including those that transitioned into Shorts), scheduled live events, active Premieres, made-for-kids videos, mature/age-restricted or private videos, desktop-ineligible setups, and creators without advanced-feature access. Eligible live archives and concluded Premieres converted to ordinary long-form videos can be tested.

## Measurement and test design

For an eligible owner-authorized video, preregister the video ID, original publication date, planned two or three variants, whether title and/or thumbnail changes, test start/end timestamps, outcome state (Winner, Performed Same, Inconclusive), experiment result screenshot/authorized report, and any intervening video edits. Retain experiment and any exposed watch-time figures **only when actually obtained**; unavailable metrics stay unknown.

A combined title-and-thumbnail test cannot isolate whether text or image caused an effect. A sequential manual replacement is not the same experiment; impressions, viewers, recommendation surfaces and age of video change over time. A winner in watch-time share is **not** a buyer conversion, profit improvement, subscriber migration, or cause of a cross-platform lift without separate compatible evidence.

No test, experiment outcome, creator receipt or buyer conversion has been observed for Mercata. The [machine rule matrix](native-packaging-ab-tests.json), [invariant evaluator](../../site/native-packaging-ab-audit.mjs) and [regression suite](../../tests/native-packaging-ab-audit.test.mjs) preserve this boundary.
