# Creator processing costs: who pays, what is deducted, and when money becomes final

**Checked:** 2026-10-25. Official source families: [YouTube partner earnings](https://support.google.com/youtube/answer/72902?hl=en), [membership analytics and refunds](https://support.google.com/youtube/answer/7491256?hl=en), [Supers management and revenue share](https://support.google.com/youtube/answer/7288782?hl=en), [affiliate pending and attribution](https://support.google.com/merchants/answer/13773820?hl=en), [Shopify affiliate billing](https://support.google.com/merchants/answer/14235796?hl=en), and [Merchant Center affiliate reporting](https://support.google.com/merchants/answer/14947975?hl=en).

## Three distinct payment contracts

| Mechanism | Stated creator basis | Card processing cost / refund exposure |
|---|---|---|
| **Channel memberships** | 70% of recognized **net** membership revenue after applicable taxes/fees; eligible Commerce Product Module required | YouTube currently covers card-processing transaction costs. Refunds granted by YouTube deduct the creator's share from AdSense for YouTube. MCN arrangements may further reduce a creator's amount. |
| **Super Chat, Stickers and Thanks** | 70% of revenue recognized by Google **after local sales tax and applicable iOS App Store fees** | YouTube currently covers card-processing costs. Purchases are generally voluntary and nonrefundable; unauthorized charges can be reported, and removal/moderation conditions are product-specific. |
| **YouTube Shopping affiliate commissions (Shopify merchant setup)** | Merchant-set percentage of an attributable **qualifying purchase amount excluding taxes/other fees**, not a universal 70% share | Merchant-side commissions have a pending period; cancellations/returns can reverse them. Payment processor fees for a particular independent merchant contract are **not disclosed here**, so no extra creator rate is inferred. |

The Commerce Product Module **70% is not a rate for every YouTube product**. In particular, it cannot be multiplied into the Shopping affiliate system. Equally, applying a second percentage card-processing deduction to the native fan-funding proceeds would double-count a cost YouTube says it covers. Those official cost-allocation descriptions do not eliminate an individual creator's separate income tax, agency/MCN share, FX or production expenses.

## Distinguish attribution, pending, locked, billed and creator-paid

Google's Shopify merchant guidance provides a recommended **30-day product-tag click attribution** window using the **last qualifying YouTube creator click**. A qualifying commission then has a configurable **30–50-day pending period** (default 30 days); returned or cancelled transactions may reverse during this stage. Locked previous-month transactions are billed to merchants on the first day of the following month.

These are **merchant billing and eligibility stages**, not proof that an individual creator's bank account received a transfer on that date. Merchant Center gross sales, net sales, orders and commissions may include pending as well as approved transactions. The net-sales label alone does not prove settled creator payout or net creator profit.

## Gaps and reproducibility

Actual payment-provider fee contracts, conditional local withholding, MCN agreements, production labor, refund rates and creator bank deposits are **unknown** without individual authorized account records. No actual merchant or YouTube payment accounts were opened. Payment amounts in tests are hypothetical fixtures to validate the classification logic, **not a market estimate**.

[Machine allocation matrix](creator-processing-settlement-2026.json) · [Audit](../../site/creator-processing-settlement-audit.mjs) · [Tests](../../tests/creator-processing-settlement-audit.test.mjs).
