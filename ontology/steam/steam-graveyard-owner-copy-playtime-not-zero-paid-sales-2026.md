# Steam Graveyard: zero playtime is not zero paid sales

**Reviewed October 29, 2026.** [Machine record](steam-graveyard-owner-copy-playtime-not-zero-paid-sales-2026.json) · [synthetic denominator guard](../../site/steam-owned-copy-playtime-denominator-guard.mjs) · [regression tests](../../tests/steam-graveyard-playtime-sales-denominator.test.mjs).

The [September 30, 2026 imho.run Steam Graveyard report](https://imho.run/reports/steam-graveyard) analyzes **113,781 sampled Steam libraries** containing **9,658,442 owned game-library copies** of titles now priced above zero. Library records were refreshed **May 3–September 29, 2026**. Its **32.4% never launched** means *zero recorded playtime*. **27.9% under two hours** has a *different denominator*: only copies with recorded positive playtime. Neither percentage is a refund rate, zero-transaction game fraction, zero-earning publisher share or repeat-paying-customer retention.

The publisher reports **59.1%** unlaunched among items flagged as likely bundles or giveaways, versus **24.5%** among unflagged items. Its flags use review-to-owner outliers (threefold relative to release-year peers), known free-to-keep promotions and high co-ownership patterns. Heuristics are neither verified acquisition paths nor an authenticated paid-order census. **Current US list price is not the historical amount anyone paid**. Library ownership may follow discounts, gifts, keys or promotional distribution.

The nonprobability sample uses **48 deterministic hash buckets** of **2,722,860 friend-network-crawled libraries**. The report excludes **14,343 all-zero-playtime libraries** (possibly privacy restricted) and **2,607 collectors owning more than 1,000 games**. Rankings cover **2010–2025** Steam release years and titles with **at least 500 sampled owners**; omit free-to-play, DLC, software, soundtracks and delisted titles. Acquisition dates are unknown, so a game bought yesterday can have zero minutes without implying abandonment. Engagement-focused friend-graph discovery is not representative of all Steam users.

## Why the research must not use this for a sales-zero estimate

A proper zero-sales measure begins with a complete, historic **first-paid-release AppID frame** and joined real paid-order transactions, including AppIDs with no sales. The imho.run study instead begins with visible **owner-game pairs**, excluding games no observed accounts own. It contains no authenticated paid orders, refunds, publisher payee records, bank deposits or production costs.

One million owned but never-launched copies would not prove even one game had no paid sale. Conversely, an owner row alone cannot prove a paid transaction. The [synthetic guard](../../site/steam-owned-copy-playtime-denominator-guard.mjs) validates separate observed-playtime denominators and returns null for all financial and zero-sales results. No private Steamworks or player data was accessed.

**Still unknown:** actual zero-paid-sale AppID share, paid customer denominator, payment path for sampled copies, representative publisher income, and genuine paid-buyer retention.
