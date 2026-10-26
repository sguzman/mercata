# itch.io direct-seller country examples and the first-payout deductions

**Reviewed October 26, 2026 from the current official [itch.io payments guide](https://itch.io/docs/creators/payments).** Machine record: [merchant-country-first-payout-2026.json](merchant-country-first-payout-2026.json).

## The specific direct Stripe combinations documented by itch.io

| Seller-account country in itch.io's direct-Stripe list | Documented checkout currencies |
|---|---|
| United States | USD |
| Canada | CAD, USD |
| Ireland | EUR, GBP, USD |
| United Kingdom | EUR, GBP, USD |

These rows describe **the itch.io integration's published options**, not a census of all countries Stripe operates in, all potentially approved merchants or buyer residency. In particular, [Stripe's global list](https://stripe.com/global) includes Mexico, but itch.io's direct-Stripe table does **not** list Mexico. Neither fact alone proves a particular Mexico-based itch.io account can or cannot be approved. That requires checking the platform's current merchant setup and payment-provider eligibility. No login or such test was performed.

For **direct PayPal**, itch.io's documentation offers checkout settings of **USD, CAD, GBP, EUR, JPY and AUD**, but these currencies do **not** establish corresponding worldwide seller-country eligibility. A merchant must configure matching payment-account currency acceptance.

## Collected payouts have account-level deductions too

Under **Collected by itch.io**, the platform acts as merchant of record and uses **USD** for transactions. After per-order marketplace/processor charges, the publisher requests payment through supported payout providers, after completing the tax interview and satisfying availability and risk-review conditions.

The same guide's account-adjustment section lists a **flat $3 tax-identity verification adjustment once per collected publisher account**. This is not a charge to upload a game, not a recurring $3 tax, and not part of the per-order payment-processor formula. There can also be payout transfer charges and foreign-exchange deductions, which the public guide does not specify as a universal final amount. The platform recommends batching withdrawals roughly monthly, subject to its restrictions on older unclaimed balances.

A default **30% withholding** can apply in defined circumstances without valid tax identification; treaty documentation and account validation can change that outcome. No seller's actual tax rate or local bank amount is known. The $10 illustrative **$8.41 per-sale proceeds** figure remains *before* payout adjustments, individual tax consequences, and potentially currency conversion.

## Research boundaries

This resolves several documented *settings and fee categories*, not the country-by-country population of eligible commercial developers, a universal payout approval guarantee or median income. The results are public operator documentation rather than an account-level merchant test.
