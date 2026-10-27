# Merchant-of-record, VAT, withholding and cross-currency cash routes

Reviewed October 26, 2026. [Machine financial crosswalk](merchant-tax-fx-cash-waterfall-2026.json). This is an audit of **published operating rules**, not an actual seller payout or tax return.

The [operator's payment guide](https://itch.io/docs/creators/payments) distinguishes **Direct to you** and **Collected by itch.io (Payouts)**. Direct mode uses the publisher's own PayPal/Stripe provider and the publisher is merchant of record. Collected mode makes itch.io merchant of record, processes all checkouts and payouts in **USD**, and offers PayPal or Payoneer disbursement on request.

| Dimension | Direct to you | Collected by itch.io |
|---|---|---|
| Merchant of record | Publisher | itch.io |
| EU VAT collection/remittance | Seller is liable; optional operator collection assistance | Operator collects and remits VAT |
| Payment account | Separate eligible PayPal or Stripe connections | Platform collection, later eligible payout |
| Currency | Account-selected, processor-compatible | USD buyer transaction and USD payout |
| Transaction hold | Provider-specific | Seven-day sale aging before eligibility |
| Payout review | Provider-specific | Staff approval, at least seven days from request, typical 10–14 days |
| Tax interview and forms | Provider's requirements and reporting | Platform tax interview and payout validation; $3 one-time account adjustment |
| Chargebacks | Direct publisher liability | Platform merchant handling, with some account adjustments possible |

The published direct Stripe examples cover **United States (USD), Canada (CAD/USD), Ireland (EUR/GBP/USD), and United Kingdom (EUR/GBP/USD)**. The operator lists PayPal checkout currencies **USD, CAD, GBP, EUR, JPY, and AUD**. Neither list proves countrywide seller approval; external processor support in Mexico does **not** establish integration or onboarding success for a particular itch.io account. [Stripe's general availability](https://stripe.com/global) is a different scope from this site's gateway support.

**Cash waterfall:** distinguish gross buyer charge, actual sale VAT, refunds, operator share, processing fees, account adjustments, any seller withholding, payout fees and final bank currency conversion. A given fee should be counted **only once in its applicable route**. The public **$10 → $8.41** example assumes 10% platform share and 2.9% + $0.30 processing before all remaining individual deductions; it does not predict publisher profit.

For non-US publishers using collected payouts, the [payment guide](https://itch.io/docs/creators/payments) documents a **30% default withholding rate** with tax-identity and treaty-related qualifications. It is *not* a blanket tax rate for everyone, nor the same as buyer VAT or the seller's eventual personal income tax. A local bank's FX spread, provider transfer fee, valid tax treaty treatment and seller's legal liabilities require individual verified inputs.

**Measurement boundary:** No commercial account, processor transfer, country approval, purchaser record or bank settlement was examined. All actual merchant FX costs, net bank receipts, withholding rates, profit and number of eligible sellers remain unknown.
