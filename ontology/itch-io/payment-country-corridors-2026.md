# itch.io — payout routes and Mexico example (October 26, 2026)

A commercial developer must distinguish the customer checkout route, merchant of record, source currency, processor account eligibility, payout review and local-bank settlement. This example uses Mexico as one jurisdiction, **not as a verified individual account assessment**.

## Platform rules

[itch.io's payment guide](https://itch.io/docs/creators/payments) documents **Direct to you** and **Collected by itch.io** modes. Collected transactions are in USD, paid out later to a selected payout provider such as PayPal or Payoneer; direct sellers configure processor and currency and carry different VAT/chargeback responsibility. Collected money becomes payout eligible after a stated seven-day transaction hold and a USD $5 available minimum, and requests require tax verification and human review (at least seven days, typically 10–14). Those numbers are not guaranteed final transfer dates, and approval is still account-specific.

## Provider geography is not itch.io integration eligibility

[Stripe's global country list](https://stripe.com/global) includes Mexico, and [Stripe's Mexico methods guidance](https://support.stripe.com/questions/supported-payment-methods-in-mexico?locale=en-GB) says domestic charges to Mexican cards require MXN. However, itch.io's **direct Stripe integration documentation** lists a narrower set of country/currency examples. We therefore **cannot infer that a Mexican Stripe account is permitted for direct itch.io sales** just because Stripe operates generally in Mexico. That must be checked by actual account-specific provider configuration and current itch.io support.

[PayPal Mexico](https://www.paypal.com/mx/cshelp/article/how-do-i-receive-money-through-paypal-help667?locale.x=en_MX) documents automated transfer to a linked Mexican CLABE bank account, potential conversion to MXN and exchange fees. A USD amount shown as itch.io proceeds is not necessarily the final pesos delivered after payout fees and conversion.

## Tax and operating caveats

itch.io requires a completed and ultimately validated tax interview for collected payouts. Its help page states a **default 30% withholding** in certain missing-valid-tax-ID circumstances, and that foreign entities may qualify for a treaty reduction. This is a platform description, **not a calculated Mexican withholding rate or legal/tax recommendation**. Actual taxes, reporting, treaty eligibility and payout approval remain unknown without individual facts and current competent guidance.

[Machine crosswalk](payment-country-corridors-2026.json) preserves those unknowns as null. There has been no private account login, money transfer or publication experiment.
