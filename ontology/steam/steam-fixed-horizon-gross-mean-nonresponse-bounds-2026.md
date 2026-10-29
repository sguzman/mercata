# Steam mean gross revenue: finite-cohort bounds when sales data are missing

**Reviewed October 29, 2026.** [Machine-readable study](steam-fixed-horizon-gross-mean-nonresponse-bounds-2026.json) · [synthetic bounds calculator](../../site/steam-gross-mean-nonresponse-bounds.mjs) · [tests](../../tests/steam-gross-mean-nonresponse-bounds.test.mjs).

This is a study-design tool, **not an estimate of Steam revenue**. It extends the previous [median identification study](nonresponse-gross-median-identification-bounds-2026.md) using the missing-data framework of [Charles F. Manski](https://www.sciencedirect.com/science/article/pii/S0888613X04001124) and the field definitions in [Valve's restricted financial API](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService).

## The lower average is estimable only with a complete game population

Define N independently known originally-paid Steam base-game AppIDs, including retired games. Each revenue is complete **gross paid Steam store sales in USD**, aligned to 30, 90, or 365 days after the **first commercial paid launch**. Gross sales are nonnegative, but never the same as bank receipts or after-cost profit.

Given complete verified observed game totals summing to S, and m games with missing outcomes, the sharp *population* lower mean is **S divided by N**, assigning $0 to missing games only as one possible extreme. It does **not** assert those games actually earned zero.

Without externally verified upper limits on every missing outcome, **the upper possible mean is unbounded**. The highest revenue observed among a volunteer sample is not a valid bound on an unobserved hit game. When independently justified finite upper caps for missing games exist, the possible upper mean becomes **(S plus all missing caps) divided by N**.

| Completely invented 5-game example | Complete observed gross | Missing games | Lower mean | Upper mean |
| --- | --- | --- | ---: | ---: |
| All observed | $0, $10, $20, $50, $100 | None | $36 | $36 |
| Three observed | $10, $20, $30 | Two with no proven cap | $12 | Unbounded |
| Three observed | $10, $20, $30 | Two with independently verified $50 and $70 caps | $12 | $36 |
| Incomplete cohort frame | $10, $20, $30 | Two known missing within a partial roster | Unreportable | Unreportable |

The [helper](../../site/steam-gross-mean-nonresponse-bounds.mjs) validates unique synthetic game fixtures, nonnegative safe integer USD cents, matching observation horizons, complete reconciled known sales, missing observations and explicit verification of every proposed revenue cap. It refuses to produce population figures when the overall original-paid AppID roster is incomplete.

## The necessary financial observation

Valve documents distinct **Steam Package purchases**, **Retail key activations**, and **MicroTxn** line types. Gross paid store dollars, returned units, refunds, taxes and net sales are separate fields. Valve also explains that old reporting dates can reappear after late payment settlement, so changed-date financial summaries must be refreshed with complete per-date pagination. None of that can be retrieved from public store reviews or owner models, and no private account or API key was used here.

A true first-30-day Steam-wide mean requires the population of originally-paid launches, proper initial paid release dates, accurate package and bundle attribution, authorized complete settlement histories, and explicit nonresponse tracking. A sample of voluntarily publishing successful developers cannot be promoted to a representative industry mean without justified sampling assumptions.

**Remaining unknown:** Steam-wide first-year and launch-month gross averages, exact zero-sale frequency, mean publisher net proceeds and mean after-cost profit. The new numerical fixtures establish algebraic behavior and error handling, not missing empirical earnings observations.
