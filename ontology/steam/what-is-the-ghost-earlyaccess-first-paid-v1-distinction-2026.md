# What Is The Ghost: Early Access first paid offer versus later version 1.0

**Reviewed October 29, 2026.** [Case data](what-is-the-ghost-earlyaccess-first-paid-v1-distinction-2026.json) · [regression tests](../../tests/steam-earlyaccess-first-paid-date-audit.test.mjs).

## Count one first paid game, not two

The [Steam store](https://store.steampowered.com/app/3929260/What_Is_The_Ghost/) lists an **Early Access Release Date of March 23, 2026**, and a subsequent **full release of October 1, 2026**. The same AppID and developer/publisher Deda Games persist. The [July 23 developer's retrospective](https://www.reddit.com/r/gamedev/comments/1v49g0o/my_first_steam_game_a_retrospective/) describes the title as a first Steam release after about four months of Early Access. Counting March and October separately would introduce a second false newcomer game into the population. A demo is a different nonpaid exposure event, not an original paid checkout.

## Returns-adjusted net is not verified publisher cash

The author reports **183 sold copies**, **14 returned**, and **$1,370 labelled net after returns**. The denominator convention for the 183 and the 14 is not proven; exact refund rates are unknown. The author's phrasing does not establish that the $1,370 is after Steam's platform share, withholding, other taxes, bank fees or production labor. [Valve's monthly reporting guidance](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq) separates gross, adjusted net and revenue share payment. There is no authenticated bank or monthly partner statement.

## Observational launch context

The author reports **1,300 wishlists at the July post**, compared with around **300 entering an earlier Next Fest**, plus 35 reviews and 110 minutes median playtime. None proves matched wishlist conversion, actual unique paying customers or gameplay retention. A buggy early demo, over 50 creator contacts and multiplayer time costs are anecdotal qualitative assessments, not causal purchase effects. Current storefront reviews and metadata are later observations, not July evidence.

The [local regression tests](../../tests/steam-earlyaccess-first-paid-date-audit.test.mjs) fix the historical ordering and prohibit converting return-adjusted author-labelled net into realized cash or a market income statistic.

**Unidentified:** actual bank remittance, complete after-cost profit, genre-relative earnings, demo/creator effect, first-paid market median and exact zero-paid-sale proportion. This is one voluntary unverified case.
