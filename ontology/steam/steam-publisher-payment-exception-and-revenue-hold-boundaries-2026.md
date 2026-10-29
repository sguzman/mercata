# Steam publisher payments: missing deposits, operational delays and fraud holds

**Reviewed October 29, 2026.** [Structured classification](steam-publisher-payment-exception-and-revenue-hold-boundaries-2026.json) · [synthetic-only classifier](../../site/steam-payout-disposition-guards.mjs) · [verification tests](../../tests/steam-payout-disposition.test.mjs). These are publicly documented procedures, **not actual payment incidents** or observed enforcement rates.

## A bank deposit is a different economic event from a sale

The [official reporting and payments FAQ](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq) distinguishes near-real-time gross sales from the monthly adjusted royalty report and the ultimate transfer to one partner bank account. A publisher may have completed paid Steam game orders, accrued a royalty and still lack a bank deposit for that month. This cannot be counted as a zero-sale game, a zero-earning legal publisher or an enforcement suspension without other evidence.

| Publicly documented situation | Stage | Why absent bank cash is not zero game sales |
| --- | --- | --- |
| Unverified banking or tax records | Partner release and payment eligibility | [Onboarding FAQ](https://partner.steamgames.com/doc/gettingstarted/faq?language=english) says valid information is required for release and payment. This is not a measured game checkout outcome. |
| Earnings below minimum threshold | Payment settlement | [Finance FAQ](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq) describes a $100 minimum disbursement threshold. An unpaid smaller balance is not necessarily a zero balance. |
| Partner elects higher threshold | Voluntary payment deferral | The partner, via Actual Authority, can select a higher holding threshold to manage bank-fee exposure; this is not punitive enforcement. |
| Bank information changed late | Possible operational delay | Valve recommends changes by the **15th**. Later edits **may** postpone the monthly batch, not always. |
| Transfer returned by bank | Failed remittance | Corrected payments join the **next ordinary monthly batch**, with no off-cycle reissue. |
| Direct fee charged back, refunded or fraudulent | Potential withholding | The [Direct Fee guide](https://partner.steamgames.com/doc/gettingstarted/appfee) says sales payments **and** the fee's recoupment **may** be withheld. This is a specific possible enforcement-related cash rule, **not proof an individual account committed fraud**. |
| Restricted counterparty under applicable sanctions | Contractual eligibility | The [onboarding FAQ](https://partner.steamgames.com/doc/gettingstarted/faq?language=english) states that Valve cannot contract with certain designated parties; this is distinct from an ordinary bank batch delay and needs current legal review. |

## Payment dates are not immediate settlement guarantees

Valve describes paying the preceding month's Steam revenue share **by the 30th of the next month**, plus possible bank posting delay. The same [finance FAQ](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq) says it cannot make off-cycle replacement payments. A late bank-details update can affect that cycle. These are documented rules; they do not show actual delay rates or individual settlement dates.

Tax verification is a further separate gate: Valve's [onboarding FAQ](https://partner.steamgames.com/doc/gettingstarted/faq?language=english) gives **two to seven business days** as a typical third-party tax review interval and says further documents may be requested. Treat this as process guidance rather than a guaranteed maximum. Tax withholding on eligible US-source revenue is a deduction, not a claim that gross sales were zero or the entire bank payment was frozen.

## What constitutes enforcement evidence?

**Do not merge** voluntary holding thresholds, financial timing, an ordinary returned bank transfer, a disputed Direct fee, store review rejection, a sanctions counterparty decision and customer-level fraud flags into one measured “Steam suspension” category. The [previous enforcement review](steam-enforcement-support-and-key-revocation-boundaries-2026.md) separately describes store/build approval, help tickets, retirement and key revocation. None of those categories automatically establishes a partner revenue hold.

Valve provides a finance-team trace route for an apparently missing payment when bank and tax details are valid. It is **not** a guarantee of same-cycle remittance or a formal appeal finding. Any claim of actual fraudulent-deposit handling requires authoritative case records, not just policy eligibility.

## Research gates

To calculate how many publishers received **no bank deposit**, obtain a dated full partner population and authorized payout histories. To calculate **no paid Steam game sales**, independently construct the complete originally-paid AppID cohort and authenticate full-period paid checkout unit ledgers. Those are different populations. A bank statement alone cannot reveal all AppID sales, while gross store sales alone do not establish partner net proceeds, VAT/refunds, shares, payment delays or labor-adjusted profit.

The accompanying deterministic classifier accepts **only labeled synthetic fixtures** and returns unknown actual units, deposits, fraud rates and economic outcomes. It tests classification invariants; it does not access accounts, adjudicate sanctions, collect identifiers or model real sales. **Actual revenue-hold incidence, actual zero-sales share, payout delays and developer profitability remain unknown.**
