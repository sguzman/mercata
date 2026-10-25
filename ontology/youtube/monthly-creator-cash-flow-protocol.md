# Monthly creator cash-flow ledger — accounting, not income promises

**Source review: 2026-10-25.** YouTube's [payment process](https://support.google.com/youtube/answer/14728151?hl=en), [AdSense monthly schedule](https://support.google.com/adsense/answer/7164703?hl=en), [currency threshold list](https://support.google.com/youtube/answer/14727140?hl=en), and [territory payment methods](https://support.google.com/youtube/answer/14728152?hl=en) are the underlying official sources, already registered in Mercata.

The ordinary cycle has **three financially distinct events**: previous-month YouTube earnings *finalized and posted* to AdSense for YouTube around the **7th–12th**; payment threshold and holds checked at the **20th** cutoff; an eligible payout *issued* around the **21st–26th**. Issuance is **not** the same as a cleared bank deposit. Payment methods and holidays can delay the actual receipt.

The [existing account threshold table](payment-gates.json) documents standard minimum payouts of **USD 100** and **MXN 1,200** only for a payment account actually denominated in that currency. A creator's residence or a viewer's country does not establish the reporting currency. An ordinary below-threshold or held balance rolls over; the model never fabricates an automatic transfer.

## Cashbook input contract

Every calendar month requires explicitly entered fields. Monetary entries, held status and publication counts are not defaulted; missing data is rejected rather than silently treated as zero. **All transfers are entered at actual observation dates**, not the month the underlying video was published.

| Field | Accounting basis |
|---|---|
| `platform_posted_net` | Finalized credit to YouTube payments account **after** Google-applied adjustments and withholding; do not include unfinalized Studio estimates |
| `platform_issued` | Transfer **actually issued**, constrained by balance, threshold and holds |
| `platform_bank_received` | Transfer **actually cleared**, possibly the following month; cannot exceed cumulatively issued but undeposited funds |
| `sponsor_cash_received` | Sponsor payment received; not an unsigned proposal or unpaid invoice |
| `affiliate_cash_received`, `merch_cash_received`, `other_non_youtube_cash_received` | Outside-platform cash only, with mutually exclusive streams |
| `refunds_paid` | Actually refunded or charged back cash; avoid counting amounts already withheld |
| `production_cash_paid`, `marketing_cash_paid`, `admin_cash_paid` | Cash expenses paid, including attributable equipment, rights, contractors, advertising and operating costs |
| `hours_production`, `hours_marketing`, `hours_admin` | Labor, including abandoned attempts, community work and bookkeeping |
| `published_video_count` | Actually published output cadence |
| `payment_hold` | Whether the platform account is held at standard cutoff |

Also supply opening YouTube payment-account balance, opening transfers already issued but not received, opening liquid cash and reporting currency. The model requires consecutive ISO months and two-decimal account amounts; it reconciles **platform-unpaid, transfer-in-transit and cleared cash as three separate balances**. Only cleared bank receipts and separately recorded non-YouTube funds enter monthly liquidity. It reports labor and publishing cadence alongside cash but does **not** turn cash movement into a creator hourly wage, accrued profit, or an industry prediction.

Taxes that are not already included in posted net amounts, merchant refunds not recorded, currency conversion, billed-but-unpaid sponsorships, commitments, depreciation and direct/indirect noncash expenses require a separate accounting record. The underlying model is a scoped **liquidity** model, not a GAAP profit-and-loss statement or an IRS/local tax calculation. None of Mercata's fixtures contains real participant income, bank records or personal identifiers.

[Machine contract](monthly-creator-cash-flow-protocol.json) · [Pure reconciliation engine](../../site/monthly-creator-cash-flow.mjs) · [Regression cases](../../tests/monthly-creator-cash-flow.test.mjs).
