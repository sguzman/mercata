# Sponsor contract to cash: explicit-entry worksheet

**Scope:** One documented sponsorship agreement in one reporting currency. [Machine protocol](sponsor-contract-cash-worksheet.json), [pure calculator](../../site/sponsor-contract-cash-worksheet.mjs) and [regression tests](../../tests/sponsor-contract-cash-worksheet.test.mjs). No individual agreements or private transactions have been examined.

The YouTube-specific [Kolect managed-campaign study](https://www.kolect.ai/reports/creator-marketing-benchmarks-2026) reports **agreed creator fees** in selected contracts, not demonstrated cash receipt. The independent [OpenSponsorship completed-paid-deliverables report](https://opensponsorship.com/blog/nano-micro-mega-influencer-pricing-data) uses a separate, *multiplatform* conditional sample. Neither represents a typical first-year YouTube creator. Values from those reports must **never** be silently entered as personal contracts or combined.

## Required fields

All fields are explicit; the engine rejects missing values rather than silently replacing unknown with zero.

| Contract stage | Worksheet fields | Boundary |
| --- | --- | --- |
| Commitment | `agreed_gross_fee` | Not automatically invoiced or paid |
| Invoice | `invoiced_gross_fee` | At most the documented gross agreement absent amendments |
| Cleared receipt | `cash_received` | Money actually deposited, net of source deductions |
| Source deductions | `tax_withheld_at_source`, `agent_fee_deducted_before_receipt`, `other_deductions_before_receipt` | Excluded from cleared cash; never double-count as paid expenses |
| Cash costs | `negotiation_cash_paid`, `production_cash_paid`, `fulfillment_cash_paid`, `admin_cash_paid` | Outlays already paid, not estimated wages |
| Separately paid tax | `tax_paid_directly` | Actual cash tax payment distinct from withholding |
| Labor | `negotiation_hours`, `production_hours`, `fulfillment_hours`, `admin_hours` | Recorded effort, including attributable unsuccessful negotiation if tracked |

The simple cash statement is **cleared receipt minus directly paid cash costs and directly paid tax**, never gross sales minus both actual and hypothetical expenses. The invoice reconciliation is **gross invoiced minus cleared receipt minus documented deductions = invoiced but unsettled balance**. Outstanding amounts are not bank deposits; paid tax withholding is not a second cash outflow. Hours can produce a cash-movement-per-hour accounting diagnostic, not a wage.

**Unknown:** accrual recognition, refunds outside the agreed fee, FX translation, cost allocation across several contracts, the creator's ultimate tax liability and net accounting profit. The helper cannot validate underlying contracts, and it does not estimate the chance of receiving a sponsorship. No genuine private invoices, bank details or creator-level records are published.
