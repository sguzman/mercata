# Subscriber versus non-subscriber attention: owner-restricted evidence

**Reviewed October 25, 2026.** [Machine measurement contract](subscriber-status-reach-2026.json) · [report validator](../../site/subscriber-status-audit.mjs). No creator account has been queried.

[YouTube Analytics API dimension `subscribedStatus`](https://developers.google.com/youtube/analytics/dimensions) distinguishes `SUBSCRIBED` and `UNSUBSCRIBED` **at the time each activity happened**. The *same viewer* who subscribed during a day can contribute views to both categories. The official [channel report definition](https://developers.google.com/youtube/analytics/channel_reports) permits reports of user activity by subscription status, optionally broken down by `creatorContentType` and a `day` or `month` dimension. It is available through **authorized owner analytics**, not public video counters.

## Units that must stay distinct

| Unit | What it is | Not what it is |
| --- | --- | --- |
| Subscriber-status views | Eligible view events attributed to the viewer's subscription state at that event | Number of unique people in each state |
| Current subscribers | Channel relationship count at snapshot | Watching population, paid buyers, or per-video reach |
| Subscriber-feed traffic source | Referral surface/source category | `subscribedStatus` itself |
| New or returning viewers | Audience behavior estimates under [Studio's definitions](https://support.google.com/youtube/answer/9314416?hl=en) | Equivalent to unsubscribed or subscribed status |
| Estimated minutes watched | Watch-time sum within matched report grain | Unique people or revenue |
| Shorts engaged views | Separately defined qualified engagement activity | Every raw Shorts play start |

The [official YouTube viewer guidance](https://support.google.com/youtube/answer/13615784?hl=en) explicitly warns that subscribers are not necessarily active viewers. Thus public subscriber counts alone cannot establish the split of attention from subscribers and non-subscribers, even if a channel's total views are published.

## Executable audit and missing data

The audit accepts only matching **same channel, dates, region, content surface and metric** owner report rows, one per subscriber status. It can calculate an event-level split for complete validated rows, with an optional total reconciliation check. Synthetic arithmetic tests demonstrate the formula; **no actual owner rows or observed ratio have been collected**. Owner reports may suppress or aggregate some data, so this test does not guarantee two complete bins in every report.

No personal subscriber lists, credentials, per-user histories, actual viewer counts or creator earnings are recorded. Future research requires authorized aggregation and privacy-preserving publication of only appropriate, permitted summaries.
