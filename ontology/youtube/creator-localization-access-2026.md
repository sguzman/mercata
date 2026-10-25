# YouTube localization and accessibility: six distinct feature routes

**Checked:** 2026-10-25. Official YouTube sources: [Add subtitles and captions](https://support.google.com/youtube/answer/2734796?hl=en), [Automatic caption quality](https://support.google.com/youtube/answer/6373554?hl=en), [Translated titles and descriptions](https://support.google.com/youtube/answer/6289575?hl=en), [Manual multi-language audio](https://support.google.com/youtube/answer/13338784?hl=en), [Automatic dubbing](https://support.google.com/youtube/answer/15569972?hl=en), and [Viewer language preferences](https://support.google.com/youtube/answer/13339776?hl=en).

## Official access and workflow differences

| Route | Who supplies the text or audio | Critical gate |
|---|---|---|
| Manual captions | Creator supplies a timed file, auto-synced eligible transcript or manually entered text | Owner/editor permissions, selected language and caption review |
| Automatic captions | YouTube ASR recognizes the original language of eligible videos | ASR language/audio suitability; errors with dialects, accents, overlap and noise |
| Translated titles and descriptions | Creator publishes target-language metadata | Per-video target language and translated title/description; no additional voice track created |
| Manually uploaded multilingual audio | Creator supplies recorded dubbed audio track | Feature must be available to channel and audio file must be correctly prepared and licensed |
| Automatic dubbing | YouTube can generate translated speech tracks | Eligible creator/video, supported source-target languages and speech; a video over **120 minutes** may be ineligible |
| Viewer language preference | Viewer selects preferred audio/title/description languages | Available tracks or translations only; not a setting that changes viewer search results or recommendations |

Automatic captions should be reviewed before relying on their text; the default automatic caption language is the video's source language and captions do not constitute translated voice. Automatic dubs may be inaccurate due to dialect, names, pace, idioms and background noise; YouTube says their audio cannot be directly edited by the creator. The currently supported automatic dubbing languages may vary by channel and video.

## What this does *not* measure

A published translated title might be discoverable through a language-specific search query, but it is **not a query-volume measurement**, a new distinct audience or proof of incremental views or sales. YouTube says a viewer's preferred audio/title language setting is separate from app language and locale and does not affect search results or recommendations. Language preference does not equal viewer nationality, spoken language or identity.

A proper future research design would record video ID, source language, target language, each localized asset's availability, caption correctness, date and observation method; compare aligned channel-owner traffic reports by geography and access status if voluntarily provided, without identifying or profiling individuals. No account, language-specific audience data or private transcripts have been collected.

[Machine route register](creator-localization-access-2026.json) · [Eligibility and inference validator](../../site/creator-localization-access.mjs) · [Regression tests](../../tests/creator-localization-access.test.mjs).
