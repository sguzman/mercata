# YouTube versus Google products: distinct accounts, permissions and money units

**Study date: October 25, 2026.** [Machine role/product graph](product-account-population-graph-2026.json) and [cardinality audit](../../site/product-account-population-audit.mjs). Complements the existing [economic participant roles](operator-market-roles.md) and [viewing-person measures](viewer-person-metrics.md).

| Concept | Grounded definition | Must not be conflated with |
| --- | --- | --- |
| Google Account | Authenticated Google sign-in principal | Not a unique YouTube creator or a channel |
| Brand Account | Shared ownership and manager association for a channel | Not a distinct human or a view event |
| YouTube channel | Channel ID and public metadata | Not always an active human publisher or paid business |
| Creator owner | Person or business with controlling rights | Not deducible from the channel count or subscriber total |
| Channel delegate | Authorized manager or editor access | Not automatically a legal owner, payee or rights holder |
| Viewing person | A signed-in, signed-out or co-viewing person estimated within scope | Not identical to a Google Account or one playback event |
| Channel subscription | Account relationship to channel | Not a unique active person, order or membership payment |
| Video playback | Time-scoped legitimate view event | Not a unique person, ad payment, or creator wage |
| YouTube Studio | Permissioned management and analytics interface | Not a separate population of people or advertiser bills |
| YouTube Analytics API | Authorized channel metric and dimension reports | Not public competitor earnings or all YouTube unique viewers |
| YouTube Data API | Public channel/video resources and conditionally authorized actions | Not owner-only Analytics or unique human counts |
| Google Ads | Paid advertising campaign performance and billing | Not YouTube public views or creator net revenues |
| AdSense for YouTube | Conditional finalized publisher payment routing | Not an advertising buyer or cash profit before costs |
| YouTube Partner Program | Approved channel monetization and module eligibility | Not a guarantee of positive income |
| Paid service customer | Consumer buying an applicable YouTube paid product | Not every free viewer or channel subscriber |
| Advertiser | Entity purchasing video advertising | Not a creator by default or video viewer population |

## Practical consequences

A [Brand Account channel](https://support.google.com/youtube/answer/3056283?hl=en) may have multiple owners/managers, while [channel permissions](https://support.google.com/youtube/answer/9481328?hl=en) govern tasks an editor or manager can perform. This means public channel IDs and Google accounts do not uniquely identify individual content creators.

[YouTube Studio](https://support.google.com/youtube/answer/9314416?hl=en) provides owner-access analytics, whereas the [YouTube Data API](https://developers.google.com/youtube/v3/docs/channels) exposes channel resources and their public metrics. The owner-authorized [YouTube Analytics API](https://developers.google.com/youtube/analytics/dimensions) reports scoped dimensions, not raw personal identities or universal person counts.

[Google Ads](https://support.google.com/google-ads/answer/6086441?hl=en) provides advertiser-side paid campaign measurements; these cannot substitute for public playback views or creator revenue. [AdSense for YouTube](https://support.google.com/youtube/answer/7164703?hl=en) handles finalized payout timing, with separate tax/eligibility conditions. Neither number establishes creator *profit*, which requires actual expenses and labor.

Viewers may watch without paying or being subscribed. Subscribed account relationships, paying customers, advertiser accounts, rights holders and creators overlap but do not have a published one-to-one population mapping. All people counts, earned wages, payouts and business profits remain unmeasured.
