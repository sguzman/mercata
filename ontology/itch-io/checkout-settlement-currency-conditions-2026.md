# Checkout, payout and bank money are distinct currency measurements

**Source review: October 26, 2026.** [Machine comparison](checkout-settlement-currency-conditions-2026.json). This completes the fixed **currency configuration and FX exposure** research task, not a seller's actual tax, profitability or country eligibility check.

The official [itch.io payments guide](https://itch.io/docs/creators/payments) distinguishes *Direct to you*, with a seller-connected processor and manually selected price currency, from *Collected by itch.io*, where the platform processes buyer transactions and issues publisher payouts in **USD**. Under collected payments the buyer may still have currency-conversion charges at their funding provider. A published dollar figure in an itch.io dashboard is not a guarantee of dollars after all transfer fees and tax, nor of the local currency deposited in the final bank.

## Source-published combinations

| Route | Source-published currency acceptance | Separate verification still needed |
|---|---|---|
| Collected by itch.io | Transactions and itch payout denominated USD | Payout recipient approval, fees, withholding, bank exchange conversion and final arrival |
| Direct PayPal | USD, CAD, GBP, EUR, JPY and AUD | Seller's PayPal account configured to accept the selected currency; individual merchant country |
| Direct Stripe, United States | USD | Actual merchant setup and buyer instrument |
| Direct Stripe, Canada | CAD, USD | Actual merchant setup and buyer instrument |
| Direct Stripe, Ireland | EUR, GBP, USD | Actual merchant setup and buyer instrument |
| Direct Stripe, United Kingdom | EUR, GBP, USD | Actual merchant setup and buyer instrument |

These are the **four combinations published in itch.io's own direct Stripe integration guide**, not the complete list of countries where Stripe operates. [Stripe's public international list](https://stripe.com/global) includes Mexico, but itch.io's table does not list a Mexico direct-Stripe combination. The safe conclusion is **unknown platform integration eligibility**, not automatic approval or a definitive countrywide prohibition.

[PayPal's Mexico guidance](https://www.paypal.com/mx/cshelp/article/how-do-i-receive-money-through-paypal-help667?locale.x=en_MX) describes receiving funds and converting to a linked local account, subject to provider fees. That is an example of **a separate bank-conversion stage**, not an inference that all Mexico-based game publishers are approved or that any particular publisher will receive a fixed number of pesos.

A recorded game-list price is not the same as a collected transaction, pre-fee gross, payable USD balance, after-tax business profit or MXN bank receipt. The machine model keeps unsupported FX spreads, tax liability and countrywide paid seller income as `null`. No provider account, seller details, international transfer or actual checkout was accessed.
