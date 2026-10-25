# Creator public communities: Posts, public comments and sampling limits

**Source snapshot:** 2026-10-25. Official references: [YouTube's Learn about Posts](https://support.google.com/youtube/answer/9409631?hl=en), [Create a Post](https://support.google.com/youtube/answer/7124474?hl=en), and [Data API commentThreads.list](https://developers.google.com/youtube/data/reference/rest/v3/commentThreads/list). These describe eligible surfaces, not an actual census of community membership.

## Posts are not equivalent to subscribers or commented videos

YouTube describes Post formats including text, images, GIFs, polls, quizzes and video, with additional music options on supported surfaces. A post may appear on a channel's Posts tab, **Home** or **Subscriptions** feed, and certain image posts may also show in the **Shorts feed**. Distribution is recommendation-dependent, not identical to publication, membership or notifications. Posts are not available on supervised accounts, and made-for-kids channels do not expose their Posts tab publicly.

Members-only content and subscriber-focused Communities require separate eligibility/authorization. An ordinary public post must not be used to count all members, active creators or the distinct audience of a theme. A viewer may participate in multiple communities; thematic labels overlap.

## What the ordinary YouTube Data API actually returns

The official `commentThreads.list` endpoint retrieves published top-level **video/channel comment threads**, with date/relevance ordering, pagination and at most **100 entries per page**. It does **not** establish an endpoint for enumerating all Creator Posts. The API notes that its thread resource may not include all replies: `comments.list` may be necessary. Moderation, content removal and privacy boundaries mean a retrieved public thread page cannot be treated as all submitted speech. Do not substitute video comments for Post participation.

## Ethical aggregate research design

Predeclare a list of public channels chosen by a reproducible theme/size/geography-independent selection method, observation window, post types and sample truncation rules. Record *public Post IDs* only for deduplication and **counts** such as public likes/comments, alongside observation date and missing-value status. Do not store commenter IDs, comment text, names or group-membership in a shared research artifact.

The [post-count auditor](../../site/public-community-post-audit.mjs) accepts only public post observations with an explicit type and counts that are integers or `null` (unavailable). It reports posts, metric coverage and observed aggregate event counters. It **cannot** divide them into a viewer engagement percentage because no verified reach/impression denominator is supplied. Relative post activity comparisons must retain the same sampling periods, observation cutoff, post-type mix and channel-selection biases.

This is a sourced sampling method, **not evidence** for an all-YouTube fandom population, participant demographics, purchase conversion, creator income, or causal effects of Posts.

[Machine protocol](public-community-post-protocol.json) · [audit](../../site/public-community-post-audit.mjs) · [tests](../../tests/public-community-post-audit.test.mjs).
