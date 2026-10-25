# Language counts are not country counts: official YouTube API measurement crosswalk

**Checked: 2026-10-25.** Source: official [video resource documentation](https://developers.google.com/youtube/data/reference/rest/v3/videos), [videos.list](https://developers.google.com/youtube/data/reference/rest/v3/videos/list), [YouTube Analytics dimensions](https://developers.google.com/youtube/analytics/dimensions), [caption-track listing](https://developers.google.com/youtube/data/reference/rest/v3/captions/list), and [YouTube's multilingual content guidance](https://support.google.com/youtube/answer/13338784?hl=en). This is a **reproducible measurement plan**, not a performed census.

## Seven different things often called a "language audience"

| API field / concept | Actual denominator | Not evidence of |
|---|---|---|
| `videos.snippet.defaultLanguage` | Language of a video's default *title and description* | Spoken audio or viewer language |
| `videos.snippet.defaultAudioLanguage` | Language of the video's default spoken audio track | All dubbed tracks, speaker origin |
| `videos.localizations` | Translated metadata entries per video | Unique people or translated video audiences |
| `captions.list` track `snippet.language` | A caption/subtitle track of a video, with owner/partner authorization | Actual audio used, public transcript rights or view counts |
| Authorized `reports.query` dimension `country` | Location of counted events/analytics rows, sometimes `ZZ` unknown | Native language, ancestry or nationality |
| Viewer preferred playback language | Individual viewer preference, separate from app locale and country | A public global distribution of languages |
| Person's spoken or first language | A person-level linguistic characteristic | Directly measurable from video title or geography |

A Spanish-language audio track may belong to a video with a translated English title and viewers in India. None establishes the **number of Spanish-speaking people who watched**, nor does one viewer counted in several dubbed-language contexts become several unique people. The API's `defaultLanguage` refers specifically to metadata text, whereas `defaultAudioLanguage` refers to the default audio track.

YouTube's `captions.list` method requires authorized access and returns caption **track metadata**, not transcript text; the official documentation lists a **50-unit quota cost** per request. No caption-list endpoint was invoked, and no caption files or person-level records were collected here.

## Reproducible public sample, not a global population estimate

Predeclare channels or the selected public discovery procedure, collection dates, release windows, quota assumptions and whether counts refer to *videos* or *channel accounts*. For each video, use a stable ID exactly once, preserve explicit BCP 47 codes for audio/metadata **separately**, record unknown audio and metadata fields, and count many localizations as *many tracks*, not many distinct videos.

No publicly selectable video sample is automatically representative of all videos, active channels, geographic audiences, women/men, ethnic identities or viewer language proficiency. Country-level `Analytics.reports.query` can yield owner-authorized geographic breakdowns, but **country is not language**; differences cannot be resolved by multiplying public video shares by country population or reported YouTube reach. Secondary spoken languages, dubbed audio, captions, public metadata localization and individual viewer preference are conceptually distinct with overlapping sets.

## Progress and remaining limits

This crosswalk supplies a tested procedure for existing audience-by-language and language-vs-country tasks. It supplies **no observed global distribution of first languages, secondary languages, creator profits by language, or causal effectiveness of dubbing**. See [multilingual distribution](multilingual-distribution.md) for actual, narrowly selected multi-audio watch-time evidence.

[Machine protocol](language-audience-api-crosswalk-2026.json) · [pure video-count validator](../../site/language-audience-crosswalk.mjs) · [regression tests](../../tests/language-audience-crosswalk.test.mjs).
