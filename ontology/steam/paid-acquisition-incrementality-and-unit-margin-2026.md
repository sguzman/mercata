# Paid acquisition on Steam: what would actually make an ad campaign profitable?

**Reviewed October 28, 2026.** [Structured evidence and synthetic example](paid-acquisition-incrementality-and-unit-margin-2026.json) · [Deterministic scenario evaluator](../../site/steam-acquisition-economics.mjs). This is a **study design and arithmetic guard**, not a measured CAC benchmark, commercial recommendation or live campaign.

## The real economic question

An independent game developer should not ask only how many store-page visits, wishlists or UTM conversions a paid ad produced. The relevant quantity is **incremental refund-adjusted cash contribution per paid game order caused by the campaign**, after variable service costs, minus all campaign spending and any fixed creative expense. This requires two separate evidentiary layers:

1. [Valve's UTM Analytics](https://partner.steamgames.com/doc/marketing/utm_analytics) attributes reported wishlist, purchase and key/free-license activation events to tagged links when the action occurs within **72 hours**. This is an **attribution window**, not a randomized incremental-sales estimate. It misses some browsers and users and may retain conversions later refunded.
2. [Valve's partner financial API](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService) distinguishes `Package`/`Steam` paid checkout units, retail key activations, return amounts and taxes. Even those protected records do not directly determine a game's publisher-contract split, labor, campaign cost, or which sales would have happened without advertising.

[Valve permits off-platform paid ads](https://partner.steamgames.com/doc/marketing/advertising) and suggests UTM analytics to understand referral activity. The official guide does **not** report a Steam-wide cost-per-acquisition, profit margin or recommended ad budget. Mercata has not run an experiment or downloaded merchant reports.

## A strictly hypothetical paid-order cost bridge

All amounts in this table are **invented for testing the arithmetic**, in US dollars. The 10 orders are *assumed genuinely incremental*, not observed UTM conversions.

| Scenario input or result | Hypothetical value |
| --- | ---: |
| Assumed net publisher receipts per incremental paid order | $8.00 |
| Assumed variable support and other costs per order | $1.50 + $0.50 |
| Marginal contribution per incremental paid order | **$6.00** |
| Assumed incremental paid orders | 10 |
| Total assumed contribution | **$60** |
| Ad spending + fixed creative expense | $30 + $40 |
| Surplus after the campaign (before the chosen reserve) | **−$10** |
| Additional profit reserve desired | $10 |
| Maximum ad spending for that 10-order scenario **and** reserve | **$10** |
| Incremental paid orders needed for current spend **and** reserve | **14** |

The [tested evaluator](../../site/steam-acquisition-economics.mjs) uses integer cents, rejects impossible inputs and arithmetic overflow, calculates a threshold conditional on user-supplied assumptions, and always returns **null for actual customer acquisition cost, true incremental orders and observed publisher profit**. These values would be unverified even if the same number appeared in a real campaign's UTM purchase column.

A scenario using **UTM-attributed purchases alone** must be labeled descriptive spend-per-attributed-event. It is *not* cost per newly acquired buyer. Actual incremental sales might differ because customers were already planning to buy, saw another ad, switched devices, or purchased outside the attribution window. It also excludes fixed games production overhead and ongoing labor unless those are separately introduced as campaign costs.

## Evidence required before a real ROI or threshold claim

First reconcile eligible paid Steam purchase events, refunds, localized prices, taxes, packages and historical partner transfers. Then establish actual net receipts to the correct payee and per-buyer support cost. Design a genuine counterfactual (such as a feasible randomized holdout or defensible time/location design) *before* spending; UTM alone is not enough. Track advertising spend and creative production time, set a maximum acceptable cash loss and prevent double counting across campaigns. Finally report coverage, uncertainty, external validity and any ethical/privacy limitations.

**Current empirical result: none.** Actual Steam developer CAC, mean/median return on paid marketing, incremental first-game orders, net publisher payout and launch success probabilities remain unknown. This project contains no seller data or executed advertising tests.
