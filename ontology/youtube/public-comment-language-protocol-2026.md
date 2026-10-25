# Cross-language community participation: public comment-event protocol

**Reviewed 2026-10-25.** Sources: the [YouTube Data API commentThreads.list documentation](https://developers.google.com/youtube/data/reference/rest/v3/commentThreads/list), [comments.list](https://developers.google.com/youtube/data/reference/rest/v3/comments/list), and [video language metadata definitions](https://developers.google.com/youtube/data/reference/rest/v3/videos). This is a reproducible collection *protocol*, not an executed scrape or a count of worldwide multilingual YouTube audiences.

YouTube distinguishes the language of a video's **title/description** (`snippet.defaultLanguage`) from its **default audio track** (`snippet.defaultAudioLanguage`). Search's `relevanceLanguage` biases search *relevance*, not guaranteed audio or the language a viewer actually speaks. The video can have multiple dubbed audio tracks and localized metadata.

## Public comment versus public person

The documented `commentThreads.list` method retrieves top-level published threads, with pagination of at most 100 per request. Returned inline replies are not necessarily the full reply set; `comments.list` with the top-level parent ID is needed to enumerate accessible replies. Moderation, deletion and disabled comments create structural missingness.

YouTube does not supply a trustworthy `commenterSpokenLanguage` dimension. An optional coding study could detect written language in public comments temporarily and publish only **aggregate counted public comment events** grouped by defined language, with an explicit unknown/mixed class and uncertainty. Never retain comment text, author handle, user IDs or personal profiles in the public output. Codeswitching, mixed scripts, emoji-only messages and very short text make automatic classification unreliable. Do not convert public writing language into residence, ethnicity, religion, gender, political beliefs or first-language identity.

## How to compare language communities

Predeclare a public-video cohort, equal observation windows, selection and pagination rules, metadata/audio language inclusion criteria, and the denominator **sampled published comment events**. Capture missing, suppressed and removed comments as unknown; require small-cell suppression. Compare proportions *within the collected sample* only after sample comparability review. Counts of comments, distinct speakers, viewers, subscribers, paid users, and video titles are different denominators. The language-specific participation of all YouTube viewers remains **unknown**.

The [machine protocol](public-comment-language-protocol-2026.json), [inference validator](../../site/public-comment-language-audit.mjs) and [regression tests](../../tests/public-comment-language-audit.test.mjs) enforce these distinctions.
