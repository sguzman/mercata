# Steam reviews, estimated game sales and the missing low-sales population

**Reviewed October 28, 2026.** [Machine-readable audit](review-data-and-sales-estimation-2026.json). The research unit here is a Steam game/AppID and the separate merchant or publisher behind it. It is **not** a sample of real paid orders. This checkpoint documents public review evidence and its ability (or inability) to support valid earnings studies.

## A new source break: October 2026 review API migration

[Valve's current GetAppReviews reference](https://partner.steamgames.com/doc/webapi/IUserReviewsService) replaces the old `store.steampowered.com/appreviews/<appid>?json=1` endpoint with `IUserReviewsService/GetAppReviews/v1/`. A [dated October 2 change announcement summarized publicly](https://gamedev.net/news/6178-changes-to-steam-user-reviews-api/) announced an October 22 shutdown of the old route. This study has **not** tested whether old calls still succeed.

The currently published Valve reference explicitly allows **anonymous, keyless reads** at a lower shared rate limit. This is more specific than the announcement summary suggesting a key is always required. Treat the official API method reference as the current permission statement, with operational rate limits untested.

By default the new method requests **English-language**, **Steam-purchase-origin** reviews, not all player reviews. Requesting all languages or all purchase types changes the denominator. By default it excludes off-topic review activity, and its Helpful filter does not provide a stable full-history pagination order. Recent/Updated ordering, cursors, request dates, source filters, and query timestamps must be preserved if comparisons will be reproducible. No personal review records or user IDs were downloaded for this report.

Valve's [user reviews policy](https://partner.steamgames.com/doc/store/reviews) explains that key, free and family-sharing players may leave visible reviews, but only eligible Steam-purchase-origin reviews contribute to its usual paid-game review scores. **A scored review is neither a purchased-unit count nor a unique-buyer ledger.**

## Calibrations: historical, selected and moving over time

| Study | Denominator and observation | Reported sales per review | What it cannot establish |
| --- | --- | --- | --- |
| [Birkett, May 2018](https://www.gamedeveloper.com/business/using-steam-reviews-to-estimate-sales) | More than 50 voluntarily supplied *premium indie* game data points, two outliers excluded | Median **77×**, mean **82×**, reported spread roughly **30–150×** | Typical present-day paid game, zero-seller prevalence or exact game revenue |
| [Carless / GameDiscoverCo, August 2020](https://newsletter.gamediscover.co/p/how-that-game-sold-on-steam-using) | **237** developer-submitted, non-outlying games; mixed launch years | Pooled median **58×**, mean **63×**; **2020 release-year median 38×** | A 2026 universal multiplier or a representative all-release cohort |
| [Steamlense methodology, reviewed October 2026](https://steamlense.com/methodology) | Public review and historical-price heuristic, not a known merchant transaction panel | Low **20×**, expected **45×**, high **80×** | Validated prediction intervals or true seller receipts |

The historical shift is material: Carless documents an October 2019 review reminder that changed how customers leave reviews. It would be inaccurate to apply a pooled 2018 or 2020 ratio to all later cohorts without era, review origin, genre, size and observation-window controls.

## How multi-signal estimators fare — and where validation fails

[Gamalytic's 2023 published method](https://gamalytic.com/blog/how-to-accurately-estimate-steam-sales) combines review ratios, bestseller rank, player-concurrency information and public profile samples. It reports approximately **120** public-disclosure calibration titles and excludes games with **fewer than 1,000 paid copies** from its accuracy tests. The operator reports **76.92% within 30% error** and **99.15% within 50%** in its selected test sample. These are **operator-reported validation numbers**, not independent guarantees for every game. The exclusion matters most for precisely the low-volume Steam newcomers Mercata is trying to understand.

The operator's [metric definitions](https://gamalytic.com/about) also distinguish **owners** (including some key/bundle/free access), **players**, and estimated **copies purchased directly on Steam**. A simple owner estimate cannot be relabeled paid purchases.

[Steamlense](https://steamlense.com/methodology) uses monthly review histograms and observed historical prices, a more nuanced approach than multiplying all lifetime reviews by the current list price. Yet review lag, regional prices, short discount windows, DLC, refunds and bundles all distort inferred gross sales. No model here directly measures platform settlement, publisher splits, tax withholding, paid development hours or developer profit.

## Cohort design and no-inference boundary

A valid future cohort must define **paid status at first public paid release**, count first Early Access launch as appropriate, cover delisted and zero-review apps, deduplicate apps to publishers where possible, preserve identical sales horizons and record filters/response snapshots. Stratify by release era, genre and review-count band, especially the nearly invisible tail. Where merchant orders are unavailable, report scenarios or calibrated sensitivity ranges, not exact-zero sales or verified incomes.

**No market-wide paid-game median, mean, zero-sales fraction, publisher-income distribution, net payout or after-cost profit was inferred or measured.** The present studies cannot recover those quantities. The next useful step is to investigate a rights-compliant, fixed-window paid-release frame and independent validation against permissioned *aggregate* merchant figures, including unsuccessful titles. All data-acquisition and publication terms must be checked before any ingestion.
