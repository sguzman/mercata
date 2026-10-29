# Steam localized checkout economics: regional price realization versus US list price

**Reviewed October 28, 2026.** [Machine-readable policy and synthetic data](regional-price-realization-and-value-2026.json) · [Synthetic fixed-cohort calculator](../../site/steam-regional-checkout.mjs). No partner reporting, buyer information, historical prices or live sales were accessed.

## The actual pricing rules

Valve's [public pricing documentation](https://partner.steamgames.com/doc/store/pricing?l=english) describes **37 currencies** and **four regional USD price groups**. The [Supported Currencies guide](https://partner.steamgames.com/doc/store/pricing/currencies?l=english) identifies **USD_CIS, USD_LATAM, USD_MENA and USD_SASIA**, along with local-currency and currency-fallback rules. Where a native currency is not supported, prices generally use USD; geographically European countries without a native listed currency use EUR. Some currencies have special required minor-unit price increments (for example JPY and VND), so a supposedly universal cents conversion is not valid.

Developers may use **exchange-rate-only**, **purchasing-power-only**, or **multi-variable** regional price suggestions, or set their own valid prices. The paid partner's authorized user with **Manage pricing and discounts** permission controls package prices. Valve reviews proposed changes, typically within one or two business days. These guidance and suggestion values are *not evidence of historic collected prices*.

The minimum base-price reference is the **USD $0.99 multivariable-conversion tier**, and the rough minimum checkout equivalent is **USD $0.49**. Each market has its own currency equivalents and potentially stricter rounding increments. Missing a local price or breaching a country's minimum after a discount can make the item **unavailable to buy in that market**. This is a sale-eligibility issue, not evidence that local players have no demand.

## Player value and relative price

Valve's launch-pricing guidance calls attention to expected play duration, replayability, multiplayer, Early Access, nearby comparable games and future discounts. These are useful **hypotheses** for a matched competitor study, not verified coefficients. It would be misleading to assign a fixed US-dollar value per hour or claim an optimal price-to-length ratio from this qualitative source. Actual game time, local prices, reviews, tags, age and production quality require common sample definitions.

Valve generally asks for about 30 days before normal price changes after launch, and rising base prices generally impose a 30-day discount cooldown. Converting an initially free game to paid (or paid to free) uses Steam support and at least **one week of customer notice** under the current policy. An initially free game that later charges money must not be silently counted as an originally-paid launch.

## Hypothetical paid checkout, not estimated real revenue

Suppose one invented base-game package has three **hypothetical** markets, with each amount already specified in USD cents for arithmetic. These cents are invented values, *not conversions of real MXN or USD_LATAM transaction records*.

| Synthetic checkout market | Gross paid units | Synthetic gross USD | Returned units | Returns USD | Net taxes USD |
| --- | ---: | ---: | ---: | ---: | ---: |
| USD | 100 | $1,000 | 10 | $100 | $80 |
| MXN | 200 | $900 | 20 | $90 | $70 |
| USD_LATAM | 50 | $200 | 0 | $0 | $10 |
| **Total** | **350** | **$2,100** | **30** | **$190** | **$160** |

The **synthetic** gross mean checkout amount is **$2,100 / 350 = $6.00**. Its hypothetical return/tax-adjusted subtotal is **$1,750** across 320 remaining units; it is **not** the partner's remittance or developer profit. By contrast, naively multiplying 350 units by an invented US list price of $10 would return $3,500, an **unsupported** number even within this fictitious case.

The [strict calculator](../../site/steam-regional-checkout.mjs) rejects negative/noninteger money amounts, refunds above fixed-cohort gross, duplicate region-period pairs, retail-key activations and cross-app bundle rows. It reports a conditional weighted price only for supplied synthetic rows, and returns `null` for actual seller-wide orders, publisher payouts, true regional mix, customer count and profit.

A real accounting model must derive each order's converted USD amount from authorized provider records and effective dates, refund within the same purchaser cohort, distinguish tax and royalty deductions, reconcile packages/bundles, and record missing or blocked sale regions rather than imputing zero demand. **No worldwide, first-game, or region-specific price realization has been measured in Mercata.**
