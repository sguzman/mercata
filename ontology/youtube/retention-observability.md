# Retention, completion and viewing-session metrics on YouTube

**Reviewed October 24, 2026.** [Machine unit and access dictionary](retention-observability.json), [validation rules](../../site/retention-observability-audit.mjs), and [regression tests](../../tests/retention-observability-audit.test.mjs).

YouTube's [key moments for audience retention](https://support.google.com/youtube/answer/9314415?hl=en) report is accessible at the **single-video level in owner Studio Analytics**, not as a public video statistic. It usually takes **1–2 days** to process, and automatic highlighted moments require at least **60 seconds** of video and **100 views**. Owner reports may compare viewers at the 30-second introduction marker, typical retention of similarly long videos and parts where viewers skipped or replayed.

The [Studio performance dictionary](https://support.google.com/youtube/answer/12220281?hl=en) defines Shorts **Stayed to watch** as a viewer continuing beyond the opening seconds rather than swiping away. Shorts **engaged views** exclude loops; average view duration and average percentage viewed use engaged watch events and associated time. These are not the fraction of viewers who reach a final second. [Engagement Analytics](https://support.google.com/youtube/answer/9313698?hl=en) reports watch time and video-level retention but not a universal average duration of *all videos consumed during a multi-video YouTube session*.

## Units are not interchangeable

| Metric | Basic unit | What it does **not** establish |
| --- | --- | --- |
| Public views | Playback-start events | Distinct viewers or completed plays |
| Estimated unique viewers | Modeled people in a window | Number who watched to the end |
| Thumbnail CTR | Clicks / eligible impressions | Video retention |
| Shorts stayed-to-watch | Passed initial-second threshold | Full Shorts completion |
| Engaged views | Qualifying watch events, loops excluded | Finished videos |
| Average view duration | Viewed time per engaged event | Full YouTube session duration |
| Average percentage viewed | Average of watched fraction | Percent of viewers who finished |
| 30-second intro retention | Retained at 30 seconds | Retention at final frame |
| Segment replay count | Playback activity at a moment | Distinct viewers; a segment can exceed total video views |
| Aggregate watch hours | Time across events | People, profit, complete views |

A valid **full-video completion fraction** needs owner-authorized, explicitly defined final-frame activity over a compatible start cohort. Even this may need adjustments for replay, seeking, autoplay, looping and missingness; it cannot be calculated by dividing unrelated public counters. Average percentage viewed is not a binary completion indicator and can be greater than 100% when playback repeats, depending on measurement.

A credible study must fix content format, duration, date range, view-count definition epoch and video sampling frame. Owner privacy matters: no personal watch histories or identities are gathered. The actual end-reach distribution, comparable cross-video sessions and its causal relation to creator profit remain **unmeasured**.
