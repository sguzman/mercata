# Country-specific YouTube program access and payment-method evidence

**Observed October 23, 2026.** [Structured record](country-eligibility-payments.json). This is a *three-country official-policy sample*, not a complete global eligibility database, nor an actual creator account assessment.

## Available country-level entries

| Payment address / YPP sign-up country | Standard YPP listed | Expanded YPP listed | Cheque | EFT | Wire | Hyperwallet |
| --- | --- | --- | --- | --- | --- | --- |
| Mexico | Yes | Yes | No | Yes | Yes | No |
| United States | Yes | Yes | No | Yes | No | Yes |
| United Kingdom | Yes | Yes | No | Yes | Yes | No |

Sources: YouTube's [standard Partner Program country list](https://support.google.com/youtube/answer/7101720?hl=en), [expanded Partner Program country list](https://support.google.com/youtube/troubleshooter/13536952?hl=en), and [AdSense for YouTube country-specific payment-method table](https://support.google.com/youtube/answer/14728152?hl=en).

**Scope:** A country appearing in YPP listings permits geographically eligible creators to *attempt* application. It does not establish the applicant's actual residence, age, accepted modules, channel review, specific paid-feature permissions, or income. The payment-method table is indexed by **payment address** and cannot predict an individual account's displayed options. Feature-specific regional and channel requirements require additional verification; these values remain `null` in the machine file.

## Currency thresholds — not an automatic residence assignment

The official [payment-threshold table](https://support.google.com/youtube/answer/14727140?hl=en) defines the following **account-reporting-currency examples**:

| Account currency | Select payment method at | Payment threshold | Cancellation threshold |
| --- | ---: | ---: | ---: |
| MXN | 120 | 1,200 | 120 |
| USD | 10 | 100 | 10 |
| GBP | 10 | 60 | 10 |

**Do not read the rows as "everyone residing in Mexico is paid in MXN," or similarly for the U.S. and UK.** Reporting currency belongs to the actual AdSense for YouTube account. These numbers are disbursement conditions, not estimated income, platform fees, purchasing-power parity, or a promise of payment at a particular date.

## Payment and verification boundaries

A YPP creator must submit tax information regardless of location. Account holds, verification, and program compliance affect disbursement. The Help page indicates that the bank or branch for a wire transfer must be in the same country or region as the payment settings address; no personal bank details were collected. For separate AdSense and AdSense for YouTube payment accounts, the thresholds apply independently.

## Reproducible expansion protocol

For any further territory: capture the **date**, canonical country/territory identifier, exact standard/expanded YPP listing, product-level eligibility, payment-address-country method table, account reporting-currency qualification, named currency threshold, applicable verification/tax rules, source IDs, and any explicit omissions. Represent each still-unchecked field as `null` instead of inventing unavailable services or a negative finding.

The [geographic scope protocol](geographic-scope.md) explains why viewer country, advertising market, creator residence, payment address, and content language must remain distinct. No creator income, labor hours, approval probabilities, or country-wide creator population was measured here.
