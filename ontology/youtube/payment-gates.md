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
