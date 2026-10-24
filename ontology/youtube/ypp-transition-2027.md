# Announced YouTube Partner Program transition — February 2027

**Research snapshot: October 23, 2026.** These rules have been **announced but have not yet taken effect**. [Structured comparison](ypp-transition-2027.json). The primary sources are the [August 10, 2026 YouTube announcement](https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/) and the [current YPP Help page with a future-terms notice](https://support.google.com/youtube/answer/72851?hl=en). Neither is a survey of actual creator earnings.

## New applicants versus admitted channels

| Route | October 2026 requirement | Announced from February 1, 2027 | Population |
| --- | --- | --- | --- |
| **YPP ad/Premium application, watch time** | 1,000 subscribers **and** 4,000 qualified public watch hours in last 12 months | **8,000 qualified watch hours in 365 days** | *New* ad/Premium applicants |
| **YPP ad/Premium application, Shorts** | 1,000 subscribers **and** 10 million qualified Shorts views in last 90 days | **20 million qualified Shorts views in 90 days** | *New* ad/Premium applicants |
| **Already accepted into YPP** | Approved members retain YPP subject to current program and content requirements | New entry thresholds **do not apply retroactively** | Existing YPP members |
| **Ongoing Shorts ads/subscription revenue sharing** | Admitted YPP creators follow current monetization and eligible-view rules | **10 million qualified Shorts views in a rolling 90 days** to receive Shorts share | YPP members using Shorts monetization |
| **Fan funding and Shopping early entry** | Expanded YPP: 500 subscribers, three public uploads in 90 days and 3,000 public watch hours (12 months) **or** three million Shorts views (90 days), plus required conditions | **No announced threshold change** | Early-access applicants in available regions |

**Important unresolved detail:** The [official August announcement](https://blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/) specifies the new watch-hour and Shorts-view numbers, but does **not independently restate the 2027 subscriber floor**. Mercata leaves this field `null` until authoritative 2027 help or contract terms verify it. The 2026 1,000-subscriber condition must not simply be assumed to carry forward.

For Shorts, a channel falling below the **rolling 10-million-view** product threshold can **remain a YPP member and continue eligible long-form monetization**; its Shorts share resumes once the rolling threshold is met. This condition is *not* the same as the 20-million-view admission rule for **new** ad/Premium applicants. Qualified metrics are distinct from public playback starts, particularly after [the August 2026 video-count redefinition](view-definition-break.md).

## Monthly Shorts accounting and targeted advertising

The [official Shorts monetization policy](https://support.google.com/youtube/answer/12504220?hl=en) adds a timing detail to the announced **10-million-qualified-views** requirement. For each earning month, eligibility is measured over the 90-day period **ending on the 15th day of the preceding calendar month**. That is not the same as simply checking the prior 90 days on an arbitrary day in YouTube Studio. The source does not identify the measurement timezone; Mercata does not invent one. The Shorts Monetization Module must also have been accepted, and views before acceptance do not become payable retrospectively.

Two advertising routes have distinct bases:

| Route | Creator share | Share base | Extra scope |
| --- | ---: | --- | --- |
| **Ordinary Shorts Feed advertising** | 45% | The eligible creator's country-allocated share of the **Shorts Creator Pool** after music-related allocation | Aggregated feed ads; eligible engaged views, music usage and country allocations matter |
| **Direct channel-targeted Shorts ads**, beginning February 1, 2027 | 45% | **Net revenue from the specific targeted ad** | Applies when the ad targets specific channels in groups of **five or fewer**; is **additional to** the Creator Pool mechanism |

The direct route is not a 45% share of all Shorts views, nor is it a guarantee of advertisers buying such inventory. It must not be mixed with the pooled revenue base or added twice in cash-flow projections. The policy does not publish representative creator receipts from either route.

## Premium and Premium Lite allocation

YouTube's announcement describes dedicated subscription pools, each defined against **net subscription revenue** for that subscription type:

| Member product | Pool allocation of net subscription revenue | Creator share from applicable allocated pool |
| --- | ---: | --- |
| Premium | 30% | 55% long-form / 45% Shorts |
| Premium Lite | 60% | 55% long-form / 45% Shorts |

Distribution to channels depends on subscribers' **watch time and views**. These percentages do not directly state the amount any creator will earn per view, and they are not shares of the full retail subscription price. The source includes costs of running/promoting subscriptions and payments to music partners in explaining the allocation basis. Do **not** multiply a guessed membership price into a guaranteed creator check or double-apply a 55%/45% share to already-net creator proceeds. Territory availability and specific channel allocation remain unknown.

The announced **Premium Lite expansion** concerns countries with Premium service, but cannot be taken as proof of membership or the same net subscription value in every country.

## Updated terms and planned incentives

The current [official Help page](https://support.google.com/youtube/answer/72851?hl=en) tells partners to **review and accept updated terms by January 31, 2027** to continue full monetization, with those terms taking effect **February 1, 2027**. Mercata does not infer the precise consequence for an individual channel if it misses this step.

The announcement also describes future Shopping, brand partnership and trend incentives for creators not meeting the ongoing Shorts threshold. **Payments, program dates, and detailed qualification rules are unspecified.** They are possibilities, not a guaranteed alternative income stream.

## Business-model consequences

The new entrant thresholds are **double** the current qualified watch hours and Shorts views, but **not** a claim that entry effort, time or costs mechanically double. Production workload, median earned dollars, fan-funding access, country restrictions, review approval and the share of creators who succeed remain separately unknown. Existing members and new applicants have different exposure to these changes, so surveys of already monetized channels cannot represent applicants.

This dated transition must be revisited when updated February 2027 contractual documentation becomes effective. Until then, the original [October 2026 policy snapshot](policies.json), [feature matrix](eligibility-matrix.json) and [application lifecycle](application-lifecycle.json) remain historic/current reference points rather than being silently rewritten to future values.
