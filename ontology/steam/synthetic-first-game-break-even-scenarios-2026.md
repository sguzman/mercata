# Hypothetical first-game cash and labor break-even scenarios

**Reviewed October 28, 2026.** [Machine-readable assumptions](synthetic-first-game-break-even-scenarios-2026.json) and [pure tested model](../../site/steam-hypothetical-break-even.mjs). **No actual Steam game, publisher income, or business cost observation appears in these examples.**

## Why the distinction is necessary

Steam's [Direct application fee](https://partner.steamgames.com/doc/gettingstarted/appfee) is a fixed entry cost, but a game's full budget also includes unpaid labor opportunity cost, contractors, marketing and ongoing service. [Valve's financial reporting documentation](https://partner.steamgames.com/doc/finance/payments_salesreporting) separately addresses gross, returns, tax and royalties. The [public 2018 revenue-sharing announcement](https://steamcommunity.com/groups/steamworks/announcements/detail/1697191267930157838) is **not** verification of each publisher's signed 2026 contract. A model can therefore only accept an **explicit assumed platform rate**, not assert a universal rate as the actual one.

### Two break-even thresholds

- **Cash break-even:** hypothetical developer proceeds cover fees, contractors, marketing and other out-of-pocket cash expenses.
- **Economic break-even:** the same costs **plus assumed development hours × opportunity-cost rate**. This second threshold can be much larger even if little cash was paid out.

Both are calculated per assumed gross paid checkout order, after **assumed refund fraction, sales-tax component, platform share and publisher recoup share**. Rates are supplied in basis points to avoid implicit financial assumptions. The result is an illustration of average retained revenue, **not** a historical sales record, return distribution or real company profit.

## Transparent synthetic example

Assume an *invented* single game with a **USD $8 average paid checkout price** (for example a $10 list price with a wholly hypothetical 20% discount), 10% hypothetical refunds, 10% sales-tax component of retained checkout receipts, 30% illustrative platform share, and a further 50% publisher recoup/retention of post-platform proceeds. In this illustrative model, one gross paid order contributes **about $2.27** to developer receipts before fixed costs.

A hypothetical cash expense budget of $2,268 breaks even near **1,000 gross paid orders** under those assumptions. If 500 development hours are also valued at $20/hour, economic break-even rises to about **5,410 gross paid orders**. These numbers are **not Steam averages or recommendations** and depend strongly on every input. They deliberately exclude personal income taxes, financing costs, FX and any unique contractual waterfalls.

The tested module provides outputs for both thresholds, nullable fields for *actual* bank payments/profits, and guards for invalid inputs, impossible rates and unsafe numeric magnitudes. It is intentionally unable to estimate the odds of meeting the thresholds.

## Evidence and decision limits

[Steam pricing](https://partner.steamgames.com/doc/store/pricing?l=english), [discounting](https://partner.steamgames.com/doc/marketing/discounts?l=english) and [refund eligibility](https://store.steampowered.com/steam_refunds?l=english) imply wide variation in realized checkout values, but they **do not** supply actual tax mixes or refund rates. The publisher's share can also include advance recoupment or royalty schedules not represented by a single percentage.

The next empirical task is to obtain rights-cleared, consenting **aggregate** sale and cost observations from a representative mix of unsuccessful and successful first-game publishers. Until then no published scenario should be converted into an actual typical Steam indie's income, profitability or survival probability.
