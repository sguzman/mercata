# itch.io — hypothetical game-sale break-even scenarios

**Scenario tool, not observed earnings or a sales forecast.** The source for the sample fee structure is [itch.io's official payments guide](https://itch.io/docs/creators/payments). It uses a **configurable** platform share; the illustrated assumptions below are 10% share, 2.9% percentage processing and USD $0.30 fixed processing fee. Actual seller transaction costs may differ.

The tested [calculator](../../site/itch-break-even.mjs) accepts an explicit game price, both rate components, processor fixed fee, cash game-development costs, other fixed costs, valued production labor and a target pre-income-tax surplus. It produces separate **cash cost recovery**, **cash plus valued labor recovery**, and **target surplus** thresholds measured in successful paid orders.

The worked inputs in [machine scenarios](break-even-scenarios-2026.json) are **illustrations only**: USD $100 fixed development cash costs, USD $0 other fixed costs, 20 hours valued at $20 per hour, and a USD $500 target pretax surplus, across four prices ($2, $5, $10, $20).

The calculation is:

1. Per successful sale: `price - platform_share - (processor_fixed + price * processor_rate)` with transaction-fee cents rounding.
2. Cash break-even units: `ceil(fixed_cash / sale_contribution)`.
3. Valued-labor break-even units: `ceil((fixed_cash + valued_labor) / sale_contribution)`.
4. Target units: `ceil((fixed_cash + valued_labor + target_surplus) / sale_contribution)`.

For the documented $10 fee example, per-sale contribution is **$8.41** before further costs. With the stated invented-for-math cost inputs, cash break-even takes **12** paid orders, full-valued-labor break-even **60**, and a further $500 target takes **119** orders. All are threshold calculations, not likely outcomes.

If contribution is zero or negative, the model returns `null` rather than inventing a finite break-even volume. Missing or invalid assumptions fail rather than silently becoming zero. Calculated numbers omit VAT, refunds, chargebacks, income taxes, FX and payout deductions. Labor is valued under an explicit chosen hourly rate, not assumed free.

Crucially, the calculator never estimates whether a developer will actually sell the required units. That requires separate empirical demand and conversion evidence, which Mercata does not yet have.
