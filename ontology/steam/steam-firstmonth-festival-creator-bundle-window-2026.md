# First-month Steam launch: festival exposure, creator outreach and bundle timing

**Reviewed October 29, 2026.** [Structured case](steam-firstmonth-festival-creator-bundle-window-2026.json) · [channel-stage audit](../../site/steam-developer-launch-channel-guards.mjs) · [regression tests](../../tests/steam-developer-launch-channel-guards.test.mjs).

## First-person report and finance denominator

The developer of *Planet Harvester: Incremental Odyssey* [described the team's first major full-time release](https://www.reddit.com/r/gamedev/comments/1wkqe7x/postmortem_first_fulltime_release_12000_and_2k/) in a September 19, 2026 post. The two-person team reported **2,325 first-month copies sold**, **USD 12,467 gross** and approximately **2,500 wishlists on launch**. The disclosed **6.8% refund rate** is an author-reported rounded percentage without independently disclosed numerator, and the reported **3 h 26 min median playtime** and 74 reviews are player-engagement observations, not financial receipts.

## Marketing stages that cannot be collapsed into buyer orders

| Channel or stage | Author-reported observation | Valid inference |
| --- | ---: | --- |
| Ukrainian Games Festival release listing | ~158,000 impressions | Display events, not verified unique buyers |
| Festival-to-store traffic | ~1,700 visits | Roughly 1.08 visits per 100 festival impressions, **not** a purchase conversion rate |
| Creator outreach | 170 creators contacted | Outreach attempts, not impressions or game sales |
| Creator keys and content | 20 activated keys and 7 videos | Noncommercial key activations and content outputs, not Steam paid orders |
| Creator videos | ~186,000 combined views | Views that may repeat; not unique purchasers |
| Participating bundles at posting date | ~30 bundles | Offers/partnerships, not 30 extra paid titles |
| Author-described bundle sales share | ~20% | Not proven to refer to the exact reported first-month sales cohort |

The author describes currently being in approximately 30 bundles and around 20% of total sales coming through bundles. Those statements are recorded at the **post date**, not necessarily the same period as the reported first-month 2,325 copies. Multiplying 2,325 by 20% to invent an exact 465 bundle sales would merge mismatched windows. Likewise, activated review keys cannot be added to paid orders.

## Why exposures do not demonstrate incremental income

An event impression might lead to a store visit, wishlist, or checkout, but the post lacks a user-matched conversion funnel and a comparison period or random assignment for each channel. Creators published videos over different weeks, and bundles and festival featuring overlap. The author's interpretation that these campaigns helped is a plausible hypothesis, **not a measured incremental-sales effect**.

The [tested instrument](../../site/steam-developer-launch-channel-guards.mjs) preserves a descriptive store-visits/impressions ratio and explicitly rejects any claim of verified unique reach, first-month bundle sales, buyer-level attribution, bank receipts, profit or representative return on marketing. It is one self-selected studio account, not a population estimate.

**Zero-exposure denominator guard (October 29, 2026).** The descriptive store-visits/impressions ratio is `null` if the reported impression denominator is zero. This is a missing or undefined ratio, not a zero conversion rate, and it says nothing about incremental sales. The synthetic validator rejects visits exceeding impressions while keeping free creator keys and bundle observations separate from paid checkout counts.
