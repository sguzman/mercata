# Same-livestream LIVE versus ON_DEMAND research protocol

Checked October 25, 2026. Official references: [Analytics dimensions](https://developers.google.com/youtube/analytics/dimensions), [channel report compatibility](https://developers.google.com/youtube/analytics/channel_reports), [live archive conditions](https://support.google.com/youtube/answer/6247592?hl=en), and [Live Chat replay](https://support.google.com/youtube/answer/15268877?hl=en).

## Units and correct pairing

The Analytics dimension **liveOrOnDemand** yields LIVE for playback occurring while a live broadcast is in progress and ON_DEMAND for playback outside the live window. The video's **creatorContentType** remains LIVE_STREAM for this same livestream recording. Therefore an on-demand view of an archived live broadcast must not silently be compared to VIDEO_ON_DEMAND content type for unrelated uploaded recordings.

Owner-authorized playback-detail reports can group by liveOrOnDemand and show engagedViews, views, estimatedMinutesWatched and averageViewDuration. They **cannot** combine liveOrOnDemand with averageViewPercentage. A reproducible study fixes a single owned video ID and matching reporting dates and country before comparing broadcast versus replay view events or watch minutes. A derived replay share is a fraction of **view events**, not a unique-person retention or paid-member conversion rate.

## Missing archives are selected missing data

YouTube says streams under 12 hours may be auto-archived, while streams longer than 12 hours might not be captured. Edits to archived streams remove chat replay. Public survival and chat availability therefore select non-representative recordings. A zero in a missing archive is not a verified zero in live or post-live interest.

The [machine research frame](live-replay-observability.json), [pure same-video verifier](../../site/live-replay-observability.mjs) and [tests](../../tests/live-replay-observability.test.mjs) check the owner authorization, metric compatibility and measured-unit restrictions. No private creator Analytics was accessed, and **no actual live versus replay income or people were observed**.
