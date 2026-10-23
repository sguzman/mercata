# YouTube payment gates and regional eligibility

**Source snapshot 2026-10-23.** Payment account reporting currency, the creator's residence, payment address, viewer geography and program country are distinct. The [machine model](payment-gates.json) preserves those fields separately.

## Payment thresholds by account currency

[AdSense for YouTube's published thresholds](https://support.google.com/youtube/answer/14727140?hl=en):

| Reporting currency | Choose payment method at | Payment threshold | Cancellation threshold |
|---|---:|---:|---:|
| MXN | MXN 120 | MXN 1,200 | MXN 120 |
| USD | USD 10 | USD 100 | USD 10 |

These thresholds apply by the account's reporting currency; one cannot infer that every Mexico-based creator is automatically paid in pesos, or that the U.S. threshold applies to all accounts. Tax details and identity/address verification are separate conditions. Revenue accumulated below a threshold is not automatically a zero earning.

## Mexico as a public country case study

YouTube [lists Mexico as a YPP region](https://support.google.com/youtube/answer/7101720?hl=en). The expanded program, Shopping affiliates, live gifts and Creator Partnerships each separately list Mexico among eligible regions; these are independent eligibility checks, not automatic activation. According to [official payout-method documentation](https://support.google.com/youtube/answer/14728152?hl=en), Mexico payment addresses support electronic funds transfer and wire transfer, but not paper checks or Hyperwallet.

An available feature still depends on channel standing, program acceptance, content age designation, rights, tax setup, AdSense verification and sometimes country of viewers or sellers. A creator's payout currency and residence cannot be reverse-engineered from a viewer-country earnings sample.

## Investigations still open

Program approval probabilities, personal legal/tax treatment, currency conversion charges, country-specific actual cash settlement timing, storefront costs, commission rates and fee schedules need separate dated sources. No one should disclose banking, identity or tax documents in this public repository.

## Monthly settlement sequence

According to [YouTube's published monthly cycle](https://support.google.com/youtube/answer/7164703?hl=en) and [AdSense for YouTube payment guide](https://support.google.com/youtube/answer/14728151?hl=en), earnings accrue during a calendar month; the previous month's adjusted amount normally posts on the next **7th–12th**; threshold and account details must be in order by the **20th**; and eligible payments are generally issued on the **21st–26th**.

Issuing money is not the same as receiving it. The help center describes up to seven business days for an EFT and as long as 15 business days for a wire transfer after issuance or initiation, subject to bank and account circumstances. Claims, invalid traffic, taxes, verification and holds can modify or delay amounts. Earnings below the payment threshold carry forward rather than being paid on the normal cycle.

The [machine version](payment-gates.json) keeps stages, offsets, account currency, available rails and exceptions distinct. These dates should never be interpreted as a creator's actual scheduled deposit.
