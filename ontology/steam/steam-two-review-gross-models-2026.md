# Two public Steam lifetime gross estimators: disagreement and the reviewless floor

**Reviewed October 31, 2026.** [PureGameStats public model snapshot](https://www.puregamestats.com/data/steam-economy) · [WeLoveIt public model](https://weloveit.io/developers/steam-revenue-report/) · [structured audit data](steam-two-review-gross-models-2026.json) · [arithmetic checker](../../site/steam-review-gross-model-disagreement.mjs) · [tests](../../tests/steam-review-gross-model-disagreement.test.mjs).

Both independently branded sites estimate lifetime Steam game gross revenue from a model based on public reviews and a price proxy; neither uses publicly verifiable Valve partner financial reports. The PureGameStats page stamped its sample **2026-10-30 at 21:54:46 UTC**. The WeLoveIt report cites October 30, 2026 and refreshes continuously; figures may change on later visits.

| Provider | Paid-priced games with one or more reviews | Modeled median lifetime gross per game | Modeled total lifetime gross | Modeled share attributed to top 1% |
| --- | ---: | ---: | ---: | ---: |
| [PureGameStats](https://www.puregamestats.com/data/steam-economy) | 99,015 | $1,436 | $102.2 billion | 82.6% |
| [WeLoveIt](https://weloveit.io/developers/steam-revenue-report/) | 103,776 | $3,493 | $132.5 billion | 84.5% |

The **reported median difference is a factor of 2.43**, and the measured review-bearing game counts differ by **4,761**. These are *not* two estimates on a demonstrably identical AppID sample: roster classification, missing prices, regional versus current US prices, review-to-sales coefficients, refresh dates and other exclusions can differ. **Do not interpret the span as an empirical confidence interval, a real median developer profit range, or growth/decline over time.** Neither provider supplies an AppID-level match, and WeLoveIt does not unambiguously state whether its displayed headline median includes its separately listed zero-review class. The two reported medians are compared as labeled, **without claiming identical median denominators**. Both modeled top-one-percent shares indicate high *modeled* concentration within their own selected samples; neither validates actual dollar concentration.

### Independently checkable bins

PureGameStats additionally reports seven estimated-lifetime-revenue brackets, from less than $10,000 up through more than $1 billion, with game counts **69,776, 19,796, 4,536, 3,698, 1,006, 195 and 8**. These sum to **99,015**, exactly its published selected reviewed-game count. This supports *internal arithmetic consistency*, not accuracy of the modeled dollar outcomes. The provider derives per-game estimates with a sales estimator and tiered current regional price/initial price fallback, not actual gross transaction history.

WeLoveIt instead publishes a default **35 sales per review** multiplier (20 and 50 alternatives) and bases gross estimates on current US list prices. Its October 30 catalog lists **142,980 released games**, including **103,776** reviewed priced games receiving dollar estimates; **9,300** priced paid games with zero reviews; **19,170** free games; and **10,734** without a published price. These four categories reconcile to the publisher's 142,980 total. An additional published expensive-listing exclusion cannot be assumed disjoint without an independent overlap audit.

### What is still unknown

A zero-review paid game is not an authenticated zero-sale paid game: buyers can purchase without posting reviews, and the two providers' headline modeled samples start at *at least one review*. WeLoveIt says its reviewless count sits below its measurement floor, not that all such games had no paid orders. Free-to-play purchases, delisted price gaps, refunds, bundled revenue, region-based prices, paid Early Access initial dates and actual partner settlements cannot be recovered from either report.

No merchant transaction records, AppID lists, individual review profiles or provider database extracts were imported into Mercata. This is an additional estimator-disagreement check supporting cautious evaluation of potential publisher proceeds; it does **not** resolve median *net* developer income, the full historically first-paid game population, or the exact-zero-sale fraction.
