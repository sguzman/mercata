# Refunds and chargeback costs — explicit single-game scenarios

Source review October 26, 2026. [Machine assumptions](refund-chargeback-unit-cost-2026.json) · [offline calculator](../../site/itch-refund-cost-audit.mjs).

The [official payment guide](https://itch.io/docs/creators/payments) separates direct seller transactions from itch.io-collected payouts and emphasizes differing merchant-of-record responsibilities. The [public Terms](https://itch.io/docs/legal/terms) permit refund requests under defined circumstances and recognize disputes. **Neither source supplies a universal 2026 refund rate, chargeback incidence or globally constant per-dispute merchant fee.** Those amounts are unknown and cannot be guessed from a typical game.

## Audit the actual cash sequence

The bounded model accepts the count of **captured paid orders**, **fully refunded orders** and separate **fully reversed chargebacks** in the *same game/time period*, with no overlap between the two reversal categories. It requires an explicit item price, retained-order marketplace fee, captured-order processing fee, processor credits on refunds and disputes, unrecovered platform fees, dispute fee, payout/FX costs, cash development costs and monetized labor. It then reports how many **retained paid orders** remain and the cash result under exactly those inputs.

A synthetic ten-order example uses a $10 price, two full refunds and one fully reversed dispute, with assumed $1 store charge on each retained order, a 59-cent processor cost on each initial capture, no processing refunds or retained platform fees on reversals and a **hypothetical $15 dispute fee**. The resulting seven retained orders leave a **$42.10** pre-tax, pre-development cash amount. That example is **not** a real itch.io merchant's fees or a prediction of typical losses, and cannot be treated as an observed rate of three reversed orders in ten.

The calculator refuses negative or inconsistent event counts, non-integer cents, refunds plus disputes exceeding captured orders and refund credits exceeding original processing charges. Output additionally keeps market-wide refund probability, net developer profit distribution, revenue forecast and conversion explicitly `null`. A route-specific tax model or real settlement records would be separately necessary for actual profit.

No private purchase records were accessed; the example values exist solely to test reconciliation. This advances the existing refunds, disputes and downside-risk tasks without claiming market-level income evidence.
