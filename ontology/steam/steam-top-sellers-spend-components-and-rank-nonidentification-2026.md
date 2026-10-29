# Steam Top Sellers: the spending leaderboard is not a paid-copy leaderboard

**Reviewed October 29, 2026.** [Structured public rules and invented cases](steam-top-sellers-spend-components-and-rank-nonidentification-2026.json) · [source-constrained synthetic spending audit](../../site/steam-top-sellers-synthetic-spending-guards.mjs) · [regression tests](../../tests/steam-top-sellers-synthetic-spending-guards.test.mjs). The primary source is Valve's [Top Sellers Lists](https://partner.steamgames.com/doc/store/top_sellers?l=english); see also its [Visibility on Steam](https://partner.steamgames.com/doc/marketing/visibility?l=english) explanation. No logged-in partner account, public-chart scrape or real spending information was collected.

## What Top Sellers actually measures

Steam says its real-time Top Sellers chart considers **player spending over the preceding 24 hours**, with **additional weighting for the latest three hours**. It combines spending on **base products, DLC and in-game transactions**. The weighting coefficient is not published; a researcher cannot reverse-engineer the ranking from a straightforward 24-hour sum.

Free-to-play games can therefore be prominent despite **zero upfront base-game purchase price**, if players spend on passes, expansions or other in-game content. An observed top-selling position does not mean the product sold more paid base-game licenses than a premium game. A package containing more than one AppID introduces another attribution issue.

## Geographic, audience and product-scope shifts

Valve offers a **global chart** and separate **territory charts**, with local views used by default in some countries. Customer-content preferences and owned-product filters affect which titles or DLC items appear. Consequently, screenshots from two accounts or different countries need not show the same ordering. A territory chart is not a global earnings census or a regional publisher profit statement.

The chart's spending concept also does not identify how much money reached a developer bank account: refunds, taxes, platform shares, payment timing, partner splits, staffing and development expenses are absent. A product rank does not establish the number of *unique* paying people or the number of initially paid launches.

## Synthetic components illustrate why raw dollars do not identify rankings

The [tested fixture](../../site/steam-top-sellers-synthetic-spending-guards.mjs) describes a completely invented free-to-play game with **USD 210** in unweighted 24-hour player spending, all from DLC and in-game transactions, and an invented premium game with **USD 190** from base-game purchases. The unweighted synthetic spending is greater for the free-to-play example. **That does not predict which would rank higher on Steam**, because the precise recent-three-hour weighting, territory, content filters, and other chart rules are not reconstructed.

The function validates both spending windows and all three product components, rejects user/account data and arithmetic overflow, and leaves actual ranking position, base-game unit counts, unique purchasers, net cash and profit **null**. A credible external experiment would preregister the chart surface, user eligibility, country, observation time, product type and permissible partner-report reconciliation. No such experiment has been conducted.
