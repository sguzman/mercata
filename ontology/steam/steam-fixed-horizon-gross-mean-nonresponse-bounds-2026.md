# Steam mean gross revenue: finite-cohort bounds when sales data are missing

**Reviewed October 29, 2026.** [Machine-readable study](steam-fixed-horizon-gross-mean-nonresponse-bounds-2026.json) · [synthetic bounds calculator](../../site/steam-gross-mean-nonresponse-bounds.mjs) · [tests](../../tests/steam-gross-mean-nonresponse-bounds.test.mjs).

This is a study-design tool, **not an estimate of Steam revenue**. It extends the previous [median identification study](nonresponse-gross-median-identification-bounds-2026.md) using the missing-data framework of [Charles F. Manski](https://www.sciencedirect.com/science/article/pii/S0888613X04001124) and the field definitions in [Valve's restricted financial API](https://partner.steamgames.com/doc/webapi/IPartnerFinancialsService).

## The lower average is estimable only with a complete game population

Define N independently known originally-paid Steam base-game AppIDs, including retired games. Each revenue is complete **gross paid Steam store sales in USD**, aligned to 30, 90, or 365 days after the **first commercial paid launch**. Gross sales are nonnegative, but never the same as bank receipts or after-cost profit.

Given complete verified observed game totals summing to S, and m games with missing outcomes **and no authenticated partial sales floor**, the sharp *population* lower mean is **S divided by N**, assigning $0 to missing games only as one possible extreme. It does **not** assert those games actually earned zero.

Without externally verified upper limits on every missing outcome, **the upper possible mean is unbounded**. The highest revenue observed among a volunteer sample is not a valid bound on an unobserved hit game. When independently justified finite upper caps for missing games exist, the possible upper mean becomes **(S plus all missing caps) divided by N**.

| Completely invented 5-game example | Complete observed gross | Missing games | Lower mean | Upper mean |
| --- | --- | --- | ---: | ---: |
| All observed | $0, $10, $20, $50, $100 | None | $36 | $36 |
| Three observed | $10, $20, $30 | Two with no proven cap | $12 | Unbounded |
| Three observed | $10, $20, $30 | Two with independently verified $50 and $70 caps | $12 | $36 |
| Three observed + partial positive | $10, $20, $30 | One missing has an attested $4 lower floor; missing caps $50 and $70 | $12.80 | $36 |
| Incomplete cohort frame | $10, $20, $30 | Two known missing within a partial roster | Unreportable | Unreportable |

**Partially observed games need not have a zero lower bound.** If incomplete report rows yield a verified, game-attributed gross-sales floor \(L_i\) within the same first-release horizon, the lower mean is **\((S+\sum L_i)/N\)**. A missing game's independently verified upper cap \(U_i\) must satisfy \(U_i \geq L_i\); without a justified cap, the upper population mean remains unbounded. An absent, unauthenticated, or improperly attributed floor remains zero **only as a logical lower bound**, never an observed no-sale outcome. Equal authenticated floor and cap can mathematically identify the synthetic mean without claiming every underlying report is complete.

The [helper](../../site/steam-gross-mean-nonresponse-bounds.mjs) validates unique synthetic game fixtures, nonnegative safe integer USD cents, matching observation horizons, complete reconciled known sales, missing observations and explicit verification of every proposed revenue cap. Its partial-floor flag additionally requires authenticated financial data, attribution to the paid base game, and a verified matching release-age window. It rejects upper caps below known partial floors, malformed extra fields, and unsafe accumulation. It refuses to produce population figures when the overall original-paid AppID roster is incomplete.

## The necessary financial observation

Valve's API transmits `gross_sales_usd` as a **decimal USD string with four fractional digits**, not integer cents. If an external source is later converted to this cents-based sensitivity model, rounding an *observed floor upward* or a *verified upper cap downward* could invalidate the bounds. Conservatively round floors **down** and upper caps **up**, or retain exact ten-thousandth-dollar arithmetic until aggregation; neither precision nor source authenticity may be silently assumed.

Valve documents distinct **Steam Package purchases**, **Retail key activations**, and **MicroTxn** line types. Gross paid store dollars, returned units, refunds, taxes and net sales are separate fields. Valve also explains that old reporting dates can reappear after late payment settlement, so changed-date financial summaries must be refreshed with complete per-date pagination. None of that can be retrieved from public store reviews or owner models, and no private account or API key was used here.

A true first-30-day Steam-wide mean requires the population of originally-paid launches, proper initial paid release dates, accurate package and bundle attribution, authorized complete settlement histories, and explicit nonresponse tracking. A sample of voluntarily publishing successful developers cannot be promoted to a representative industry mean without justified sampling assumptions.

**Remaining unknown:** Steam-wide first-year and launch-month gross averages, exact zero-sale frequency, mean publisher net proceeds and mean after-cost profit. The new numerical fixtures establish algebraic behavior and error handling, not missing empirical earnings observations.

### Exact four-decimal USD conversion

The [synthetic helper](../../site/steam-gross-mean-nonresponse-bounds.mjs) now parses Valve-style four-decimal, nonnegative USD strings using integer arithmetic before converting to safe integer cents. It exposes **both** conservative limits: `$12.3456` becomes a **1,234-cent lower floor** and a **1,235-cent upper cap**; `$12.3400` becomes 1,234 cents in both directions. The parser rejects negative, scientific-notation, noncanonical and unsafe amounts. These are isolated arithmetic tests, **not data drawn from a Steam merchant account**. Gross receipts should remain separate from signed returns, tax and developer bank remittances.
