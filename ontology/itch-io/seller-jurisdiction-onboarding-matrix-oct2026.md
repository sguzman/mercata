# Seller payment country and currency matrix — October 27, 2026

**Population:** four countries explicitly listed under direct Stripe in the [itch.io payments guide](https://itch.io/docs/creators/payments), plus Mexico as a jurisdiction with separate [Stripe global availability](https://stripe.com/global). **Unit:** one route/jurisdiction documentation row, not a verified paying creator.

| Country | itch.io direct-Stripe published currencies | Country listed by Stripe generally | Individual itch.io merchant eligible? |
| --- | --- | --- | --- |
| United States | USD | Yes | Not account-tested |
| Canada | CAD, USD | Yes | Not account-tested |
| Ireland | EUR, GBP, USD | Yes | Not account-tested |
| United Kingdom | EUR, GBP, USD | Yes | Not account-tested |
| Mexico | **Not listed in itch.io direct-Stripe table** | Yes | **Unknown, not disproved** |

For **Mexico**, [Stripe onboarding documentation](https://support.stripe.com/questions/required-information-to-open-your-stripe-account-in-mexico) describes business identity/RFC and Mexico-based MXN bank-account/CLABE details. [Stripe payment methods documentation](https://support.stripe.com/questions/supported-payment-methods-in-mexico?locale=en-GB) says domestic Mexican card charges use MXN. These are **processor-level** conditions; they do *not* mean the itch.io direct Stripe integration can necessarily use a Mexican account or MXN seller-set checkout currency.

## Seller route comparison

For **Direct to you**, the creator is merchant of record, connects PayPal or Stripe (subject to account and country rules), and handles applicable VAT/tax obligations. Direct PayPal supports creator-selected checkout currencies USD, CAD, GBP, EUR, JPY and AUD in itch.io's published guide, but that is not a global merchant-country eligibility census.

For **Collected by itch.io**, itch.io is the merchant of record and accepts USD, with later payout via PayPal or Payoneer. Public conditions include a verified tax interview, at least **$5** available, normally **7-day transaction availability**, staff review of **at least 7 days** from payout request (typically **10–14 days**), and no more than **3 concurrent payout requests**. None of those timings guarantees a specific seller's actual settlement date, local currency, withholding or account approval. Payout transfer, FX, withholding and tax consequences remain account-specific.

**Scope of acceptance:** the fixed tasks request a *country-by-country official-rule comparison and eligibility/payout matrix*. This five-country documentation frame supplies one, with explicit limits rather than an invented global census. It does not establish a Mexico direct Stripe checkout, live eligible sellers, buyer-card success rates or country profitability. [Machine matrix](seller-jurisdiction-onboarding-matrix-oct2026.json).
