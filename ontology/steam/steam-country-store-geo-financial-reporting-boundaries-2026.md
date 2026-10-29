# Steam sales geography: account country, gross breakdown and monthly country payout

**Reviewed October 28, 2026.** [Machine-readable reporting units](steam-country-store-geo-financial-reporting-boundaries-2026.json) · [synthetic same-currency cash bridge](../../site/steam-country-cash-bridge.mjs) · [verification tests](../../tests/steam-country-cash-bridge.test.mjs). No accounts, bank statements, private partner reports or customer records were read.

## The customer's store country is not their physical position

[Steam's customer support guidance](https://help.steampowered.com/en/faqs/view/2B3F-DAEF-846B-A0E8) says the initial purchase establishes an account's store country; traveling customers generally continue seeing that storefront's prices. A longer-term move may allow a store-country change through a purchase with a payment method from the new country, subject to the stated three-month frequency restriction. **Store country therefore is not geolocation, citizenship, unique visitor identity or a census of buyer residence.**

Similarly, Steam's finance reporting defines its own **regions/territories**: Mexico is classified under **Latin America**, while the United States and Canada appear under the **North America** financial grouping. A publisher's incorporation and tax residence can be a third country, separate from the checkout country and local currency or regional USD price group.

## Gross geographic traffic is not the payment report

The [Steamworks Reporting and Payments guide](https://partner.steamgames.com/doc/finance/payments_salesreporting) distinguishes **near-real-time Sales & Activations** geography and gross amounts (before refunds, chargebacks and tax adjustments) from **monthly financial reports** that incorporate deductions and partner share. Valve's [Tax FAQ](https://partner.steamgames.com/doc/finance/taxfaq) and [payment reporting FAQ](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq) describe a permissioned **Steam Sales by Country** report attached to monthly partner reporting.

Applicable VAT/GST may be inclusive of the local listed price, while some sales taxes are additive at checkout; the paid partner's entitlement depends on contract share, applicable adjustments and possible U.S. withholding. Receiving bank costs can further separate payable from credited money. Thus neither a public game price nor a gross geography chart can establish country-level partner deposits or real economic profit. The actual reports require legitimate partner authorization and are not public census data.

The [synthetic test bridge](../../site/steam-country-cash-bridge.mjs) accepts already-USD-denominated illustrative gross cents, deductions, share basis points and withholding for a declared month and store-country grouping. It rejects invalid countries, duplicates, impossible deductions and mixed reporting periods. **It does not perform currency conversion, observe actual sales or infer customer location**. Its purpose is to keep the type and accounting stages explicit.

## What would allow regional demand research

A legitimate comparable study needs a fixed first-paid AppID cohort, game-level gross/refund-adjusted paid checkout records separated from retail-key activations, purchase month and permitted store-country codes, partner payout totals, and complete legal-entity costs. To estimate *buyers* rather than *orders*, actual unique purchaser denominators require a privacy-preserving authorized approach, not divided gross revenue. To estimate the causal value of translated stores or a new price tier, additional comparative treatment design is necessary.

**Still unknown:** how Steam's first-time independent publishers split completed paid orders geographically, country-specific median net returns, buyer counts, zero-sale games, and typical after-cost profit. This report documents **what the official private reporting could support**, not observations of those outcomes.
