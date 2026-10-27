# itch.io buyer checkout methods — availability is not buyer demand

**Public operator documentation reviewed October 26, 2026.** [Machine evidence](buyer-checkout-route-eligibility-2026.json) · [Pure route evaluator](../../site/itch-buyer-checkout-eligibility.mjs). No real payment, checkout, account access, buyer identity or test purchase was performed.

The [official payment guide](https://itch.io/docs/creators/payments) documents **PayPal** (PayPal funding, supported cards or bank) and **Stripe** (credit/debit card) as payment-provider families. The [buyer walkthrough](https://itch.io/docs/creators/how-buying-works) describes initiating purchase from a project page, embedded purchase widget or popup. The method buttons **depend on the configured seller payment mode**. A completed payment can issue a download key and receipt even if the customer does not hold an itch.io account; therefore registered-user populations are not a buyer census.

## Seller merchant route versus buyer payment instrument

- In **Direct to you**, the publisher must connect each supported processor they wish to offer, and the individual merchant/provider's permitted card regions and currencies can further restrict eligible buyers. An unconnected route is not available on that account.
- In **Collected by itch.io**, itch.io handles the supported payment methods and is merchant of record, and the public guide says its processor setup is configured to accept all payments. That is a description of operator configuration, **not a guarantee any particular buyer, country, issuer, content category or transaction will be approved**.
- The choice of PayPal or Stripe is a payment *mechanism*. It does not identify how many people in a country can pay, how many tried, how many succeeded, or how many of those paid for a positive-price 2D game.

The [machine country rows](buyer-checkout-route-eligibility-2026.json) intentionally set the country-specific outcomes for Mexico, the US and UK to **null** because neither generic account settings nor platform policy proves actual checkout success on each specific game. Similarly, buyer residence, billing address, card issuing country and seller account country are different concepts. No buyer-count estimate is built from a country's population or from processor brand presence.

## Offline eligibility check

The tested evaluator can reject a direct route when the seller has not connected the selected provider, and can label a transaction as *conditionally configured* when a known eligible processor/region pair was supplied as input. It returns **unknown** when provider, jurisdiction or content restrictions are not verified. Even a conditionally configured route is not a processed order. Results never contain a predicted paid population, payment approval or revenue.

This is partial progress toward the fixed **regional buyer payment access** and **currency** tasks. Comprehensive country-level approval rates and successful paid-buyer cohorts are still unobserved; the work cannot fill the representative paid-game demand or seller-income gaps.

## Observed 2026 checkout failure, not measured zero demand

A [July 17 creator report](https://itch.io/t/6635856/sale-ends-in-20-hours-203-views-0-sales-thank-you) documented zero sales and explicitly said Stripe was **not connected for individual games** while a separately offered PayPal bundle remained available. This is an actual published example of a seller payment route failing at configuration, not a measured population of shoppers who refused to pay. An [October 25 new-game report](https://itch.io/t/7220162/nobody-leaves-700-impressions-under-1-click-0-sales-what-makes-you-skip-it) instead describes weak browsing click-through with unknown checkout setup. Both are selected, self-reported cases and neither yields an eligible buyer denominator. [Case comparison](short-launch-zero-sales-checkout-versus-discovery-2026.md).

The route evaluator now reports `known_successful_transactions: null` in **every unobserved case**. A disabled provider can justify `conditional_checkout_possible: false` for that *one route*, but never a numerical assertion of observed zero purchases. The study itself did not make any checkout attempts and cannot assert current country/issuer success rates.
