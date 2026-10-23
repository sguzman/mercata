# How viewers discover, watch and return to YouTube creators

**Source snapshot: 2026-10-23.** The [machine model](creator-growth.json) maps six stages of audience activity with 17 separately defined measurements. This is not a conversion-rate forecast, a model of YouTube's hidden recommendation software, or a dataset of private viewer histories.

## A viewer's path

1. **Exposure:** Eligible thumbnail impression or Shorts feed appearance exposes content to a potential viewer. Not unique people; thumbnails in external embeds often do not enter the denominator.

2. **Selection or swipe:** Someone clicks a thumbnail or stays rather than swiping away in a Shorts feed. CTR and Shorts stayed-to-watch are not directly comparable; avoid using all views divided by impressions.

3. **Watching:** The viewer watches for a measured duration; engaged views and watch time are distinct from playback starts. Raw public views changed definition in August 2026; watch time remains a different unit.

4. **Returning:** A prior channel viewer revisits the channel across sessions. New, casual and regular categories depend on lookback windows; they do not predict purchase behavior.

5. **Community interaction:** The person participates through comments, community posts, polls, live chat or recurring viewing. Interactions are events, not distinct fans or necessarily positive relationships. Child-directed feature restrictions may apply.

6. **Paid support or purchase:** A qualified user makes an eligible native payment or purchases through an outside seller. No universal observable conversion rate from YouTube viewer to buyer, and third-party sales attribution may be incomplete.

Not everyone moves through all six stages. A viewer can arrive through an external link rather than a counted thumbnail impression, watch without subscribing, or purchase without becoming a regular channel viewer. These are distinct behaviors, not one automatic linear funnel.

## What YouTube actually measures

[Official thumbnail guidance](https://support.google.com/youtube/answer/9314486?hl=en) requires at least half a thumbnail to be visible for more than one second for a registered impression. Views from some external websites, end screens, notifications and YouTube products do not enter that denominator. Official [impressions CTR](https://support.google.com/youtube/answer/7628154?hl=en) consequently does **not** equal all video views divided by thumbnail impressions.

YouTube's [August 24, 2026 raw-view revision](https://support.google.com/youtube/answer/2991785?hl=en) counts playback starts for regular videos, live streams and Shorts, while qualification for monetization and revenue uses engaged or qualified watching. Mixing historical raw views with qualified views would be a measurement error.

The [Reach report](https://support.google.com/youtube/answer/9314355?hl=en) separates search traffic, suggested videos, playlists, external referrers and notifications for owners who have access. These reports cannot be downloaded for arbitrary competitors simply because their subscriber numbers are public.

## Returning audiences are not automatically paying audiences

[YouTube Audience documentation](https://support.google.com/youtube/answer/9314416?hl=en) defines a rolling 28-day monthly channel audience. New viewers, casual viewers and regular viewers describe activity over different historical windows: casual viewers watched in one to five months of the preceding year, regular viewers in more than six months. Private browsing and cleared watch histories can cause previously exposed viewers to appear new. Subscriber counts are not unique active viewers.

[Community Posts](https://support.google.com/youtube/answer/9409631?hl=en) may contain polls, images, quizzes and text; posts can surface in several feeds. They are **not** available for channels set as made for kids. A like, comment or poll vote is not a payment and doesn't imply a particular demographic.

## Economic interpretation

A category with large total viewing may still be highly competitive, low-paying, difficult to produce or poor at converting to a product sale. A small niche with high CTR can reach its entire interested audience quickly; YouTube notes that CTR may fall as recommendations expand to a broader audience ([official explanation](https://support.google.com/youtube/answer/16767369?hl=en)). There is no published universal CTR threshold at which a video earns money.

Mercata therefore treats exposure, viewing, returning, community participation and purchases as separately observable measurements, each with its own population and possible selection bias. No demographic microtargeting, simulated subscriber conversion, or made-up average revenue is used.

## Work that remains

Measure comparable newcomer cohorts, supply of active creators, audience language, seasonality, content production hours, attributable external conversions and churn. These need permissioned data or licensed studies; the public YouTube Data API alone cannot reproduce private acquisition and retention funnels.
