# Playlists and series: official YouTube Analytics measurement boundaries

**Checked:** 2026-10-24. Sources: [Channel reports](https://developers.google.com/youtube/analytics/channel_reports), [Metrics](https://developers.google.com/youtube/analytics/metrics), and [Sample queries](https://developers.google.com/youtube/analytics/sample-requests). All playlist reports require authorized YouTube channel-owner access. No account was accessed.

Google distinguishes aggregated measures of **videos owned by the playlist owner** from **views inside the playlist context**, which can include videos from other channels. The reporting units are different.

| Metric | Report population | Critical limit |
|---|---|---|
| `views` | owner video aggregate | Owned-video playbacks across contexts, not strictly in the playlist |
| `estimatedMinutesWatched` | owner video aggregate | Owned-video minutes across contexts, not strictly in the playlist |
| `playlistViews` | in playlist | In-playlist video views including videos owned by other channels |
| `playlistEstimatedMinutesWatched` | in playlist | Minutes watched within a playlist context |
| `playlistAverageViewDuration` | in playlist | Seconds per video view, not a duration per playlist visit |
| `playlistStarts` | in playlist | Starts counted only when playlist playback begins on the web |
| `viewsPerPlaylistStart` | in playlist | Video views per web playlist initiation, not a series-completion percentage |
| `averageTimeInPlaylist` | in playlist | Estimated minutes after web playlist initiation |
| `playlistSaves` | in playlist | Net saved playlist change, not unique subscribers |

**Web-only restrictions:** `playlistStarts`, `viewsPerPlaylistStart` and `averageTimeInPlaylist` count only playlist use initiated on the web. They are not whole-device statistics. `playlistViews` counts *video events* within playlists, not unique people. `playlistSaves` is a *net change* in saves after additions and removals.

## Reproducible owner-authorized series design

The official sample playlist-specific query selects `views,estimatedMinutesWatched,playlistStarts,playlistViews,viewsPerPlaylistStart` and filters `playlist==PLAYLIST_ID` for an authenticated owner. This describes API capability; it does **not** supply any creator's private measurements.

For a valid follow-on series experiment, define playlist ID, series topic, public release dates, episode order and count, baseline comparison, predeclared end date and abandonment threshold. Treat `viewsPerPlaylistStart` only as web-playlist *view-event depth*, not the share of viewers who completed all episodes. Tracking actual repeat persons or unique final-episode completers requires compatible owner analytics and cohort denominators unavailable to this public study. Sales also require separately attributable completed purchases and costs.

No authorized channel observations, cohort completion rates or creator earnings have been recorded.

Machine record: [playlist-series-observability.json](playlist-series-observability.json). Audit: [playlist-series-audit.mjs](../../site/playlist-series-audit.mjs). Tests: [playlist-series-audit.test.mjs](../../tests/playlist-series-audit.test.mjs).


## Series packaging in YouTube Shows (product rules, not measured retention)

[YouTube's current Help for Shows](https://support.google.com/youtube/answer/16590581?hl=en), reviewed October 25, 2026, distinguishes **non-serial** collections from **serial** series. Non-serial shows default to **newest-first** presentation and can be consumed out of order. Serial shows display episodes in **oldest-first** sequence and are intended for sequential viewing. Creators can convert existing playlists, assign seasons/episode numbers (the default conversion begins with Season 1), and adjust episode ordering. Eligibility for search, Recommended shows and Continue watching is described as possible, **not guaranteed impression or audience retention evidence**.

For a Shorts series, the playlist must contain **only Shorts**, portrait or square, with a **maximum of 180 seconds** per episode. The platform offers a Watch Series entry point and previous/next sequential navigation. YouTube's [September 23, 2026 product announcement](https://blog.youtube/news-and-events/made-on-youtube-creators-shorts-series-tv-features/) documents the rolling introduction across web, mobile and TV. Feature access can vary; the repository has not tested any channel's eligibility.

**Scientific measurement boundary:** Episode count, show creation, Watch Series placement, and sequential UI navigation are *product affordances*, not observations of people watching multiple episodes or returning after a day/week. The existing owner-only playlist report measures playlist-context video events and web-only playlist starts, which **cannot** be converted to a percentage of unique viewers finishing a season. No approved owner-channel longitudinal episode or retention cohort has been examined, and the effect of switching non-serial to serial on repeat visits, monetization or causal watch-time gain remains `null`.
