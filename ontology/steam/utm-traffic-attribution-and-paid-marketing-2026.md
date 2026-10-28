# Steam UTM and marketing attribution: events versus causal sales

**Reviewed October 28, 2026.** [Machine-readable definitions](utm-traffic-attribution-and-paid-marketing-2026.json). This is a **public policy and measurement-dictionary checkpoint**, not access to any Steamworks account, real marketing campaign, or merchant sale.

## The hidden denominator trap

[Valve's UTM Analytics guide](https://partner.steamgames.com/doc/marketing/utm_analytics) distinguishes **Total Visits** (tagged page loads), **Trusted Visits** (removing bot/crawler traffic), and **Tracked Visits** (signed-in Steam visits, with abnormal repeat behavior filtered). These are not unique buyers. Tracking can miss users who opt out of cookies, use social apps' embedded browsers, or switch into another browser or Steam client without a link Steam can retain.

A tagged UTM link allows Steam to report three different **72-hour attribution events** for the same linked AppID: (1) wishlist addition, (2) purchase, (3) activation by retail key or free-to-play license. **Activation is not necessarily a Steam-store sale.** Demo-only downloads, Playtest applications, ordinary standalone DLC and in-game microtransactions are not reported as a base-game UTM purchase; Valve documents caveats for DLC packages containing the base game.

The [standard Store and Platform Traffic report](https://partner.steamgames.com/doc/marketing/traffic_reporting) is another dataset: an *impression* means product branding appeared on screen, not that someone looked at it, and a *visit* is a page load, not a distinct person. The [deterministic synthetic metric validator](../../site/steam-utm-metrics.mjs) preserves these units and refuses to estimate unique buyer rate or causal effects. The example numbers in tests are **invented fixtures only**.

## Attribution and reporting timing

Steam attributes events within **72 hours** of the UTM visit. Visit figures refresh **hourly**; conversions become finalized **four days** after the click. Valve warns that later refunded purchases are **not retroactively removed** from its finished UTM conversion counts. A ratio of reported UTM purchases to tracked visits is therefore only a **descriptive attributed-purchase-events-per-tracked-visit** figure, not probability of purchase, accounting-net units, profit, or causal lift.

Steam also notes an important historical break: sale-page tagged traffic began passing its UTM parameters to individual game pages on **April 22, 2025**. Platform traffic collection has other start dates: general reports from September 23, 2014, regional and non-store traffic from October 17, 2018, Direct Navigation from April 17, 2019, and cookie-opt-out exclusions since March 23, 2021. Cohorts crossing these dates cannot be interpreted as comparable without adjustment.

## Privacy and permissions

Steam's UTM report is restricted to partner users with **View Marketing Traffic Data**. It reports aggregate counts, hides low-volume UTM parameter combinations and does not expose Steam IDs. Small campaigns can therefore have missing rows rather than zero outcomes. No private reports or personal data were retrieved.

## Offsite advertising is allowed, but sales attribution is not a randomized experiment

[Valve's advertising policy](https://partner.steamgames.com/doc/marketing/advertising) permits developers to buy ads on other services and send visitors to a Steam game page. Valve says paid placement within the Steam store itself is not sold; developers cannot charge other developers for placement on Steam promotional pages or bundles. A required watch-ad or rewarded-ad business model within a Steam game is not supported, though appropriate licensed product placement may be allowed.

A responsible prospective study would separate tagged source/campaign, actual spend, impressions, total/trusted/tracked page visits, wishlist events, purchase events and key activations. It would predefine campaign windows, marketing permission, statistical power, no-go thresholds, refund reconciliation, and a genuine untreated or randomized comparison before making causal claims. It would measure **net merchant cash per dollar spent**, after all platform fees, tax, refunds and production costs, before asserting ROI. Source labels and publicity from earlier announcements can still contaminate controls; the UTM report alone cannot fix that.

**No campaign spend, actual visits, actual orders, refund-adjusted gross/net proceeds or causal uplift has been measured here.** Those must remain unknown.
