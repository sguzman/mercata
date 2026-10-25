# YouTube traffic-source concentration and distribution risk

**Observed October 23, 2026.** [Machine study](traffic-concentration.json), [pure calculation and guard module](../../site/traffic-concentration.mjs), and [synthetic tests](../../tests/traffic-concentration.test.mjs).

The [official YouTube Reach guide](https://support.google.com/youtube/answer/9314355?hl=en) classifies how viewers find a creator's videos. Traffic source types include **browse features** (which combine Home, subscriptions, Watch Later and more), **suggested videos** (which include certain video-description links), **Shorts feed**, native search, subscriber notifications, playlists, outside referrals, and direct or unknown referrals such as bookmarks and unidentified applications.

**None of these is a verified all-channel traffic share**. The actual data require owner-authorized YouTube Studio reports. Mercata does not have any creator's counts or revenue.

## Measurement design

For one channel, one format/definition and one bounded period, obtain **all** mutually exclusive Studio traffic-source row counts, explicitly retaining zero and unidentified/paid rows. Never calculate a fraction from only the top displayed categories when an unmeasured remainder exists. A view fraction is not a share of unique people, income or causal platform dependence.

If the source partition is complete, compute:

- Largest source share = largest source attributed views / total attributed views.
- Concentration HHI = sum of squared source shares.
- Effective source count = 1 / HHI.

These are descriptive diagnostics from the chosen source grouping. Finer-grained source rows change HHI, so the partition must be versioned and not compared casually across years or content formats. No universal threshold marks a creator safe, profitable or independent.

The calculator refuses missing authorization, incomplete sources, mixed hours-and-views units, missing observation periods, impossible counts and unsafe sums. Its test examples are entirely synthetic.

## Unknown economic consequences

Browse features can include subscriptions and are not exclusively algorithmic recommendations. External embeds and direct/unknown traffic do not prove a creator owns a contact list or has permission to export viewer identities. Short-form versus long-form views and the August 2026 play-start revision require distinct comparisons.

Real disruptions, changes in views, income by source, channel-level paid traffic, traffic volatility, subscriber retention and median concentration across new YouTube creators remain **unknown**. Only a consented longitudinal channel cohort with compatible observations could estimate what a traffic-source shock actually costs.

See [creator discovery study](creator-growth.md), [public-person metrics](viewer-person-metrics.md), and [new-creator income protocol](newcomer-income-cohort.md).

## Native search, external referral, Shorts and subscriber-status crosswalk (October 25, 2026)

The [official Analytics API dimensions](https://developers.google.com/youtube/analytics/dimensions) define exact `insightTrafficSourceType` codes, while the [Studio Reach taxonomy](https://support.google.com/youtube/answer/9314355?hl=en) describes presentation-level source families. These are related but not interchangeable. The machine crosswalk above records fifteen documented referral codes without merging separate observation units.

| Official API source | Matched interpretation | Prohibited inference |
| --- | --- | --- |
| `EXT_URL` and `NO_LINK_EMBEDDED` | Links and embeds originating outside YouTube, including Google Search traffic | Not the same as `YT_SEARCH`, unique referred people, or an owned mailing list |
| `NO_LINK_OTHER` | Direct or unidentified sources including some apps | Cannot assert deliberate direct relationships or that viewers are subscribed |
| `RELATED_VIDEO` | A video suggested alongside another video's watch page | Cannot infer fixed recommendation weights, view positions, or exclusively algorithmic discovery |
| `SHORTS` | The Shorts vertical swipe referral | Not equivalent to `creatorContentType=SHORTS`, qualified Shorts monetization events, sound pages or remixes |
| `SUBSCRIBER` | YouTube homepage/feed or subscription feature referral | Not `subscribedStatus` at the viewing event; cannot be counted as unique subscribers |
| `ADVERTISING` | Paid advertising referral | Not creator income or an organic audience relationship |
| `NOTIFICATION` | Notification/email referral | No proof of opt-in contact details or a portable recurring customer |

The new [attribution validator](../../site/traffic-referral-audit.mjs) protects this code-to-surface interpretation with regression tests. Observed traffic, cross-service customer transfers, and business outcomes are **unknown**, not zero. The underlying official document is the same previously registered primary reference, not a new independent dataset.
