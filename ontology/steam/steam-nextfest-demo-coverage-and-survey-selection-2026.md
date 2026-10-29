# February 2026 Steam Next Fest: demo availability versus voluntary survey results

**Reviewed October 29, 2026.** [Structured evidence](steam-nextfest-demo-coverage-and-survey-selection-2026.json) · [synthetic denominator guard](../../site/steam-demo-festival-coverage.mjs) · [tests](../../tests/steam-demo-festival-coverage.test.mjs).

## A current demo tag does not reveal whether a game launched with a demo

On October 29, [SteamDB's Demo Available category](https://steamdb.info/stats/releases/?tagid=21491) classified **4,663 games released in 2025** as having a demo; the [all-game release count](https://steamdb.info/stats/releases/) for 2025 was **21,222**. The previous day's Mercata source had recorded **21,224**, so even the secondary catalog count changes over time. The two October 29 numbers imply an **approximate 22%** current-demo-tag share for SteamDB's 2025 releases, **not** a rate of games with a demo *on launch day*, originally paid games with demos, Playtest users, or festival participants. Demos can be added after release. A complete time-stamped AppID relationship history would be needed for the original-release claim.

## Two February 2026 Next Fest measurements should not be pooled

The [GameDiscoverCo full-field February 2026 analysis](https://newsletter.gamediscover.co/p/who-won-february-2026s-steam-next), published March 3, counted **more than 3,500 participating demos** (19% more than October 2025; 51% above February 2025), reporting **median 11 new followers** and about **350** at the top 5%. Its estimates of roughly **200** and **7,000 wishlists** at those positions come from *inferred follower-to-wishlist multipliers*, not direct financial or wishlist exports.

The [April 13 voluntary developer survey by Chris Zukowski](https://howtomarketagame.com/2026/04/13/making-sense-of-the-february-2026-steam-next-fest/) instead reports **median 806 wishlist additions**, with 30th, 70th, and 95th percentiles of **382**, **1,839**, and **13,461**. Around **182 developers responded**, and roughly 170–174 supplied valid answers for many questions. This is a nonrandom set of developers willing and able to share private analytics, not a census.

**806 wishlists is not the same metric as 11 Steam followers.** Converting the follower series using an uncertain estimate does not identify the magnitude of survey selection bias. Dividing 182 responses by 3,500+ festival participants is also not a conventional survey response rate: the number who actually received or saw the survey invitation is unspecified.

## What this adds to Mercata

The [tested audit](../../site/steam-demo-festival-coverage.mjs) explicitly reports the retrospective SteamDB tag fraction and a purely numerical ceiling on the share of entrants represented by survey responses. It returns **null** for demo-at-launch prevalence, matched participant purchasing, net publisher receipts, after-labor profit, causal festival effects, and estimated survey-selection-bias magnitude.

Neither source warrants a generic forecast that a first game will gain a fixed number of wishlists or generate a fixed number of sales through Next Fest. That requires matched originally paid releases, known demo and Playtest timing, an eligible cohort including underperformers, and consented post-launch game-order records.