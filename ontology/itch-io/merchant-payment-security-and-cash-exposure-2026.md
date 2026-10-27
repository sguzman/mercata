# Publisher fraud exposure, payment reversals and account safeguards

Reviewed **October 26, 2026**. [Structured risk crosswalk](merchant-payment-security-and-cash-exposure-2026.json). This records operator policy and a conditional resilience model, **not observed loss frequency**.

## Merchant mode is not the whole risk allocation

Under [itch.io payment rules](https://itch.io/docs/creators/payments), **Direct to you** connects a publisher to its own configured PayPal/Stripe provider and the publisher is merchant of record. **Collected by itch.io** makes the platform merchant of record, but the seller relies on tax validation, staff review, payout providers, and contractual balance adjustments. The same official guide says accumulated payments can be reduced by refunds, transferred payout fees, and **some chargeback costs**, especially where the operator observes high disputes.

A reported gross buyer payment is neither a seller's available payout nor profit. A refund before payout can reduce a pending transfer; after payment, it can be carried as a later account adjustment. Fraud review and buyer disputes may lengthen payout timing, and the exact amount owed is account- and processor-specific. The platform's guidance documents a **$5 minimum available payout**, seven-day initial transaction hold, at least seven days review after a payout request, typical 10–14 days review and exceptional longer holds. These figures do not promise money will reach a bank on a particular day.

## Account safety: available controls, unknown outcomes

The official [two-factor authentication guide](https://itch.io/docs/advanced/two-factor-authentication) documents **TOTP**, six-digit codes renewing every 30 seconds, and separate eight-digit backup recovery codes. SMS two-factor authentication is not available. The existence of these features does not prove every publisher has enabled them, recovered successfully, or avoided compromise. No actual account or codes were accessed.

The [creator FAQ](https://itch.io/docs/creators/faq) expressly restricts publishing or passing buyer names, emails, IPs, country codes, and transaction IDs to unrelated third parties. Buyer information is for authorized records and transaction-related communications. External mailing lists require specific opt-in.

## Continuity and downside

| Failure type | What may stop | What a publisher can prepare |
|---|---|---|
| Search/Browse deindexing | New discoverability, not necessarily direct-link downloads | Compliant listing, independent marketing links and owned backups |
| Payment processor or merchant restriction | New transactions or payout eligibility | Up-to-date eligible merchant configuration and independent revenue risk analysis |
| Payout review or chargeback adjustment | Available cash after sales | Reconcile each merchant mode, hold, refund and payout expense |
| Site unavailability | Page, installs and new orders | Independent source/build archives, maintained asset licenses, lawful communication continuity |

For a future game, a cash or labor cap must be approved **before** spending or execution. A hypothetical no-new-cash boundary is not consent to begin an account, pay for certificates, publish a title or test buyers. No probability of fraud, loss rate, average chargeback amount, live merchant balance, paid sales, or recovery success rate has been measured.

**Acceptance scope:** policy-backed definitions and conditional control planning, not a completed merchant-specific financial-risk audit.
