# Steam income sampling: nonresponse and possible median gross bounds

**Reviewed October 28, 2026.** [Structured research protocol](nonresponse-gross-median-identification-bounds-2026.json) and [tested synthetic quantile helper](../../site/steam-gross-median-bounds.mjs). This is not a measured Steam seller income dataset.

## Why a median from volunteers can be misleading

Steam has [protected merchant finance reporting](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService?l=english), and earlier Mercata studies already distinguish complete, partial and unavailable ledger histories. A list of consenting successful developers may be useful for validating a model *inside that sample*, but the same values cannot be assumed typical of games with no public reviews, delisted titles or publishers that refuse to respond.

Economist Charles F. Manski's [partial-identification survey](https://www.sciencedirect.com/science/article/pii/S0888613X04001124) explains why, when outcomes are missing, a population distribution may be **set identified** without inventing the missing values. Mercata now provides a simple deterministic lower-median calculation for **nonnegative gross Steam paid sales** only. This is not a confidence interval, a random-sample estimator, a prediction or a profit model.

## How the bounds work

Let the independently verified complete population have **N** originally paid game AppIDs. For each game, either an authenticated, complete, correctly period-matched **gross Steam paid-sales USD** observation is available, or its observation is missing. The code uses the lower median at order-statistic rank **ceil(N/2)** (not the average-of-two-middle-values convention).

- For the **lowest possible median**, put unobserved gross outcomes at **$0** and take that rank.
- For the **highest possible median**, put unobserved outcomes above every finite observed outcome and take the same rank. If that rank would fall among missing values, the upper bound is **unbounded**, represented by **null**.
- If the full cohort frame is not independently known, neither population bound is reportable.

These extreme assignments are **possible values used for proof**, not claims that missing games sold nothing or everything.

| Entirely invented population | Known, complete gross observations | Missing | Lower-median possibilities |
| --- | --- | ---: | --- |
| Five complete | $0, $10, $20, $50, $100 | 0 | $20 to $20 |
| Five, only three observed | $10, $20, $30 | 2 | $10 to $30 |
| Five, four observed | $10, $20, $30, $40 | 1 | $20 to $30 |
| Five, two observed | $10, $20 | 3 | $0 to **unbounded** |

The [test cases](../../tests/steam-income-partial-identification.test.mjs) assert these results and deliberately reject negative gross sales and incomplete-frame claims. This method deliberately does *not* infer an exact zero-paid-order share. A product's gross dollars, gross units, refunds and developer after-cost income are distinct measures.

## What this cannot solve

Even a complete AppID-level **gross** sample cannot identify the median **legal publisher's income**, because multiple games may pay one partner, rights may transfer between partners, publishers share contracts and costs are not observed. An individual's take-home can be negative after labor and cash costs even if merchant gross revenue is positive. That variable needs its own lawful and fully covered population and cost model; nonnegative gross bounds must not be silently reused.

The actual Steam-wide cohort is not verified complete, nor have consenting publishers supplied comprehensive actual sales. Thus **Mercata's genuine Steam gross median, developer net proceeds, exact zero-sale fraction and profit distributions remain unknown**. This checkpoint improves statistical honesty, not empirical completeness.
