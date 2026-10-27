# Why a representative paid-game seller mean and median remain unknown

**Evidence review: October 27, 2026.** [Machine identification audit](paid-seller-mean-median-identification-2026.json). Mercata's target is a **deduplicated publisher payout entity** offering at least one eligible positively priced itch.io game in a defined release cohort. Include zero-order projects and delisted entries where possible. Separately report an individual's multiple games, team contributors, and separate commercial entities.

For one aligned 30-, 90-, or 365-day period, a mean needs **summed eligible publisher earnings divided by all eligible publishers**. A median needs the **middle publisher(s) of the same full or properly probability-sampled distribution**, including publishers whose qualifying games have no retained orders. Distinguish gross price charged, refund-adjusted paid orders, seller proceeds after marketplace and processor costs, actual payouts and profit after development labor.

## Why the available sources cannot identify those values

| Evidence | What it supports | Why it cannot provide a representative income statistic |
|---|---|---|
| [Operator payment guide](https://itch.io/docs/creators/payments) | Fee basis, cash waterfall and payout modes | No game-by-game seller population or income records |
| [Server-side API: purchases and `profile:games`](https://itch.io/docs/api/serverside) | Authenticated buyer-specific checks plus owner/editor game summaries with purchase counts, prices and per-currency earnings | Neither returns a public eligible seller census, refund-aware 30/90/365-day first-game income, or verified payout-entity receipts |
| [Public paid/2D catalog](https://itch.io/games/store/tag-2d) | Public indexed listing/filter counts | Can include temporary $0 promotions, duplicate publisher pages, no sale histories |
| [One creator's retrospective](https://itch.io/blog/1284030/2025-in-review) | Selected project/category receipts | One voluntary publisher does not cover unpublished or low-sale creators |
| [Gamedev.js 2025 community survey](https://gamedevjs.com/survey/2025/) | Self-reported broad gamedev income of nonrandom respondents | Not merchant-side itch game payouts and no seller-identity cross-tab |
| [Public genre/rating study](https://indiegameinsights.com/itch-io-2025-in-review/) | Ratings and catalog tags | Ratings cannot prove a completed paid sale |
| Modeled domain traffic | Approximate sessions across the whole website | Site visits are neither people nor buyer payments |

Given the same public observations, unseen eligible sellers could have zero orders **or** large receipts. Both situations are compatible with the available data and yield different means and medians. Without a compatible inclusion frame and monetary observations, the target distribution is *statistically unidentified*. It cannot be reconstructed by averaging published successes, multiplying visitors by arbitrary conversion percentages, or treating zero public ratings as zero income.

The existing **2025 Gamedev.js survey bracket median of $0 applies to that voluntary web-game-developer respondent sample only**. It does not identify an itch.io paid-seller median. Likewise, no representative 2026 paid-seller zero-income share, total paid buyers, genre income comparison or top-earner concentration follows from the cited material.

**Conclusions:** the representative itch.io seller mean and median are explicitly **unknown**, not zero. The original mean/median *research tasks* can be closed under their “or mark unknown” acceptance criteria; tasks demanding actual monetary estimates and representative distributions remain incomplete until valid transaction/population records exist. No private merchant accounts or buyer records were used.

**Owner-scoped collection option (reviewed October 27, 2026):** the officially documented `profile:games` route is a candidate for a strictly consented publisher-portfolio collection. It returns game summaries for works a credential holder uploaded **or can edit**, not necessarily the payee's own commercial portfolio. The sample purchase count and earnings fields are not merchant-verified sale-window records, price-history, refunds, or bank payouts. No authenticated call was made. This clarifies a route to ethically obtain suitable inputs without changing the conclusion that platform-wide means and medians are statistically unidentified.
