# Shopping behavior: transactions, discovery and merchant funnel units

**Reviewed:** 2026-10-24. Primary sources: [YouTube's 2025 Shopping Trends disclosure](https://blog.youtube/culture-and-trends/tr25-youtube-shopping-report/) and [Google Merchant Center's YouTube affiliate analytics definitions](https://support.google.com/merchants/answer/14947975?hl=en).

## Real observations that must not be pooled

YouTube's October 2025 shopping study examined the **5,000 most-purchased tagged products in January–June 2025** and **1,000 videos ranked by tagged-product transactions** within a separate 60-day 2025 window. These are **ranked selections**, *not* totals of five thousand purchase events or one thousand distinct converted buyers. The underlying volumes for the complete product universe and any creator cash margin are not disclosed.

Separately, a **Google/SmithGeiger April 2025 survey of 500 U.S. online Gen Z respondents aged 14–24** found **61% agreed that YouTube helped them discover brands or products previously unfamiliar to them**. Agreement with brand *discovery* is not a completed sale, a product purchase rate, or a survey of all U.S. adults. These samples cannot be divided into one another to calculate conversion.

## What real merchants are allowed to measure

Google Merchant Center's private YouTube affiliate dashboard offers:

| Metric | What it actually measures |
|---|---|
| Gross Sales | Sales attributed to the program, pending **and** approved |
| Net Sales | Sales after returns, which may still include pending transactions |
| Commissions | Creator-affiliate commission and possible flat-fee/guarantee hybrid payment entries, pending and approved |
| Tagged-video Views | Views on content with eligible tags, not individual buyers |
| Product-tag Impressions | Displays of product tags, not clicks |
| Merchant Clicks | Clicks to a merchant's store, not distinct paid customers |
| Orders | Order events, including pending and approved, not verified final settled orders or distinct customers |

Traffic can be classified as organic affiliate or paid advertising. Low-volume views/clicks may be hidden or aggregated for privacy. These are **merchant-authorized**, not public whole-platform statistics. Google prohibits attempts to re-identify viewers, combining these data with outside person-level data, and reverse-inference of sensitive health, political or religious traits.

## Buyer intent versus casual viewing

The research framework separates (1) survey-reported discovery, (2) product-tag exposure, (3) store clicks, (4) provisional orders, (5) verified settled sales and (6) creator profit after fees, returns, taxes and labor. Only compatible window-, product-, channel- and approval-status-aligned values can support the relevant comparisons. No merchant account was connected, no creator profit was observed, and there is **no verified public conversion rate** for the shopping ecosystem.

[Machine frames](shopping-funnel-evidence-2025.json) · [Validator](../../site/shopping-funnel-audit.mjs) · [Regression suite](../../tests/shopping-funnel-audit.test.mjs).
