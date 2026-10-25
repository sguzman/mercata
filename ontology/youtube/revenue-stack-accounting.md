# Multi-stream revenue accounting: 16 pathways, different settlement ledgers

**Verified:** 2026-10-25. This study extends the existing [16-pathway feature inventory](revenue-pathways.json) and [channel-specific eligibility matrix](eligibility-matrix.json), without creating a second inventory or observing any actual creator earnings. Official inputs: [YouTube monetization modules](https://support.google.com/youtube/answer/94522?hl=en), [partner earnings and payout share definitions](https://support.google.com/youtube/answer/72902?hl=en), [Shopping affiliate payment rules](https://support.google.com/youtube/answer/13376398?hl=en), and [AdSense payout process](https://support.google.com/youtube/answer/14728151?hl=en).

## Settlement and entitlement matrix

| Settlement ledger | Pathways | Economic rule |
|---|---|---|
| AdSense for YouTube | Watch-page ads, Shorts ads, Premium allocations, channel memberships, Super Chat, Super Thanks, live gifts, **YouTube Shopping affiliate** | Each product requires actual channel/module/region/rights eligibility; finalized credits and bank deposits are separate events |
| Outside merchant or service provider | Shopping own products, independent affiliate deals, owned software, off-platform support, content licenses, services | Payment provider, fulfillment/refunds, tax and settlement conditions depend on independent agreement |
| Contract-defined, not inferred | YouTube creator partnerships and direct sponsorships | Signed deal, invoice and actual payment route control; this is not automatically a YouTube platform-revenue transfer |

**Key correction:** YouTube Shopping **affiliate** revenue is not the same as an independently contracted off-platform affiliate commission. The official Shopping program says commissions are paid via **AdSense for YouTube 60–120 days after purchase**, subject to returns/cancellations. The existing [monthly liquidity ledger](monthly-creator-cash-flow-protocol.md) already separates AdSense posted balance, issued transfers and cleared bank receipts from `affiliate_cash_received` for external sources. A Shopping-affiliate payment already in `platform_posted_net` must **never be entered again** as external `affiliate_cash_received`. Do not treat a pending Shopping purchase as deposited cash.

## Compatibility is conditional, not a promised bundled income

The 16 pathways are not mutually exclusive across an entire creator business, but each has its own eligibility, relevant video surfaces, commerce module, country restrictions, rights and payer. An unchecked or checked hypothetical revenue-pathway selector never grants eligibility. The public dossier now provides a route selector that groups chosen pathways by actual settlement route without inserting fake revenue.

Two seemingly independent streams may be the **same payment**: a facilitated and directly arranged sponsor integration, an offsite commission also reported via YouTube Shopping, a product sold under two sales descriptions, or supporters simultaneously counted in two reporting systems. Treat them as separate only after observing distinct contracts, invoices or payment IDs.

For earnings arithmetic, **estimatedRevenue** must not be added to its reported ad-only or Premium components. Advertiser `grossRevenue` and creator net `estimatedAdRevenue` have different accounting bases, and finalized `platform_posted_net` credits and later `platform_bank_received` transfers are *two stages of the same money*. This is a consistency check, not an estimator of ordinary creator pay.

No creator accounts, purchase events, sponsorship contracts or bank statements were accessed. The result leaves creator profit, average income, taxes, FX, account approval and per-channel net revenue unknown.

[Pure selection and duplication validator](../../site/revenue-stack-audit.mjs) · [Tests](../../tests/revenue-stack-audit.test.mjs).
