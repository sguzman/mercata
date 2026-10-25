# Live YouTube earning mechanics: Supers, memberships, Gifts and Rubies

**Checked:** 2026-10-25. This revisits the existing [sixteen earning pathways](revenue-pathways.json) and [product-specific eligibility register](eligibility-matrix.json) with current official YouTube documentation.

Official sources: [Revenue-sharing modules](https://support.google.com/youtube/answer/72902?hl=en), [Virtual Items and Ruby value](https://support.google.com/youtube/answer/15427201?hl=en), [Gifts across vertical and horizontal live streams](https://support.google.com/youtube/answer/15534883?hl=en), [Gifts country and stream exclusions](https://support.google.com/youtube/answer/15535963?hl=en), and [Super Chat / Super Sticker restrictions](https://support.google.com/youtube/answer/9277801?hl=en).

## Three incompatible revenue bases

| Route | Who is paying or buying? | Creator-side accounting basis |
|---|---|---|
| **Super Chat and Super Stickers** | A qualified viewer buys a paid chat message/sticker during an eligible live or Premiere | **70% of eligible *net* Commerce revenue**, after applicable sales tax and iOS App Store fees. Not 70% of the gross checkout price |
| **Channel memberships** | Individual recurring channel members | Separate **70% of eligible *net* Commerce revenue**; exclude the subscriber count from the payment denominator |
| **Live Gifts** | Viewer purchases Jewels and redeems them for gifts | Creator earns **Rubies** through the **Virtual Items Module**, not the Commerce Module. Official program terms: **2 redeemed Jewels → 1 Ruby**, paid at **USD $0.01 per earned Ruby** |
| Watch-page advertising | Advertiser delivers eligible ad with watch-page content | **Different ad-revenue module and denominator**, not derived from Super or gift transactions |
| Direct live sponsorship | Independent brand contracts with creator | Negotiated business income and settlement schedule, outside the native fan-funding formula |

Current YouTube Help describes Gifts on eligible **horizontal as well as vertical live streams**. The older Virtual Items policy's vertical-only language must not be treated as the complete current surface list; eligibility still depends on the accepted module and actual country/account requirements.

**Super Chat/Super Stickers are not available** on age-restricted, unlisted, private, made-for-kids or YouTube Giving fundraiser videos, or without enabled live chat/comments. Current Gifts eligibility has analogous per-stream restrictions. Availability does not establish that a particular creator is YPP-approved or that a specific broadcast is monetized.

## Calculating only where the correct denominator is known

The [pure research unit calculator](../../site/live-monetization-denominators.mjs) accepts *explicit* eligible net Commerce revenue in the accounting currency; the illustrative creator allocation is `net_eligible_receipts × 0.70`. It rejects gross viewer spend presented as net receipts. It separately accepts **earned Rubies** and calculates `Rubies × USD 0.01`. The Jewel conversion is applicable only to **Jewels already redeemed for actual gifts**; merely purchasing Jewels cannot establish a creator gift or payout.

The two modules are not given the same share calculation: **never apply 70% again to Ruby value**. Currency conversion into a non-USD reporting account, refund adjustments, taxes and actual bank transfers are unknown here. These values are research definitions and conditional scenarios, not verified after-tax net profit or paid cash. The [monthly cash-flow protocol](monthly-creator-cash-flow-protocol.md) separately records posted amounts, issued payments and bank receipts.

## Evidence boundaries

The selected [1,923-VTuber empirical Super Chat study](vtuber-superchat-cohort-2025.md) measures historic public transaction face values and selected paying-chat-user shares; these cannot be substituted for the actual Commerce net denominator, all-viewer conversion rate, live Gifts payout, or typical creator earnings. No private monetization accounts, subscriber records or purchases were accessed.

[Machine rule matrix](live-monetization-units-2026.json) · [Denominator audit](../../site/live-monetization-denominators.mjs) · [Regression tests](../../tests/live-monetization-denominators.test.mjs).
