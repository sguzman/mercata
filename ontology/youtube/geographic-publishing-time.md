# Geographic publication timing and viewer activity: YouTube's actual evidence

**Research checked October 24, 2026.** [Structured source and acceptance record](geographic-publishing-time.json). This is a study of official capability and an experiment specification, **not** a measured universal optimal posting time.

## What YouTube actually states

The [YouTube Studio Audience report](https://support.google.com/youtube/answer/9314416?hl=en) includes *When your viewers are on YouTube*: a **28-day retrospective view** of when people who watch the channel were online **across YouTube**. This is channel-owner analytics, not a publicly available country-level online population or a record of which hour those people watched a particular video.

The [official performance FAQ](https://support.google.com/youtube/answer/141805?hl=en) says an active-audience release may help **early views**, but video release time is **not known to influence long-term video performance**. It separately identifies **livestreams and Premieres**, where simultaneous attendance makes timing a practical concern. The available sources do not prove any universal best posting hour for ordinary videos or Shorts.

## The geographically relevant operations are different

| Research dimension | Documented observation | Unsupported shortcut |
| --- | --- | --- |
| Owner activity | 28-day channel-audience activity across YouTube, owner access | A public, country-wide population heatmap or an individually identified viewer schedule |
| Scheduled release | [Studio scheduling](https://support.google.com/youtube/answer/1270709?hl=en) accepts the selected **date, time and time zone** | Creator's device time zone automatically equals viewers' geography |
| Watch-page date | YouTube says the watch-page publication date uses **Pacific Standard Time** | A watch-page calendar date proves the creator's local release date |
| Live/Premiere | [Premieres](https://support.google.com/youtube/answer/9080341?hl=en) have shared start, chat and optional reminders; Shorts cannot be Premieres | Live attendance lift proves general long-term earnings lift |
| Country report | [Geography cells may be withheld](https://support.google.com/youtube/answer/9101241?hl=en) for low-volume traffic | A missing country row means zero viewers |
| Privacy coverage | Geography in realtime, private, and unlisted contexts is unavailable under documented limits | A complete audience country breakdown can always be reconstructed |

Scheduled uploads are initially private or scheduled; a Community Guidelines strike may prevent publication and require rescheduling. This is not an observed frequency of strikes or an average publication delay.

## Separating clock time, language and territory

A video has an actual **instant**, a chosen *civil time zone*, and a possibly different date shown on the watch page. Future analyses must preserve an IANA time-zone identifier, resolve daylight-saving transitions, and record the UTC release instant before comparing observations. Audience location, language, creator residence and channel account country are independent; one cannot be inferred from the others.

Even an owner Analytics country table may omit low-volume rows while still including those views in the total. Missing country cells stay *unknown*, rather than being set to zero or allocated proportionally. Owner data also cannot be used to invent competitor performance.

## Reproducible civil-time audit

The [publication instant validator](../../site/publish-time-audit.mjs) and its [synthetic tests](../../tests/publish-time-audit.test.mjs) check that a local date, local clock time and IANA time-zone identifier resolve to a real UTC instant. Nonexistent spring DST times are rejected; repeated autumn clock times require an explicit instant. A second check requires compatible reporting units and owner authorization before descriptive comparisons, while explicitly refusing to claim causation. These are software safeguards, **not measured improvements in audience attendance or earnings**.

## Valid experiment, not a guessed recommendation

A defensible channel-level experiment would pre-register matched content types, audience periods, public versus engaged view definitions, topic and language controls, randomized scheduling slots when feasible, and measurement horizons at **24 hours, 30 days and 90 days**. It should separately compare live/Premiere attendance outcomes and on-demand video long-term outcomes.

At present Mercata has no observed random assignment, channel-level activity report, signed-out timezone distribution, country-specific schedule lift, per-slot profits, or causal result. All those fields are explicitly `null` in the [machine study](geographic-publishing-time.json), and its five empirical acceptance gates remain open.

For related methodology, see [viewer-person access definitions](viewer-person-metrics.md), [geographic research axes](geographic-scope.md) and [format economics](content-formats.md).
